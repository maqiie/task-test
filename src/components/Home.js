import React, { useState, useEffect, useCallback } from "react";
import { FaTrash } from "react-icons/fa"; // Assuming you are using Font Awesome icons
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";

import { UserCircleIcon } from '@heroicons/react/outline'; // Importing the UserCircleIcon from Heroicons

const Home = ({ currentUser }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [specialEvents, setSpecialEvents] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [upcomingTask, setUpcomingTask] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [completed, setCompleted] = useState(false); // New state variable to track completion
  const [currentTaskTimer, setCurrentTaskTimer] = useState(null); // Define setCurrentTaskTimer
  const navigate = useNavigate();

  const now = new Date();
  const currentHour = now.getHours();
  let greeting = "";

  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const currentDate = new Date(); // This gets the current date and time in UTC
  const localCurrentDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  ); // This converts the UTC time to local time

  const fetchTasks = useCallback(async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get("https://tasked-f9aa59675043.herkuapp.com/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      // Filter out tasks where completed is true
      const incompleteTasks = response.data.filter((task) => !task.completed);

      // Update the state with incomplete tasks only
      setTasks(incompleteTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const fetchCompletedTasks = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get("https://tasked-f9aa59675043.herkuapp.com/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      // Filter out reminders where completed is true
      const completedReminders = response.data.filter(
        (reminder) => reminder.completed
      );

      return completedReminders;
    } catch (error) {
      console.error("Error fetching completed reminders:", error);
      return []; // Return an empty array in case of error
    }
  };

  const fetchSpecialEvents = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get("https://tasked-f9aa59675043.herkuapp.com/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      // Filter special events from the response data
      const specialEventsData = response.data.filter(
        (event) => event.is_special_event
      );

      // Log the filtered special events data to verify
      console.log("Special Events Data:", specialEventsData);

      // Set the filtered special events in state
      setSpecialEvents(specialEventsData);
    } catch (error) {
      console.error("Error fetching special events:", error);
    }
  };
  useEffect(() => {
    fetchSpecialEvents();
  }, []);

  // Example usage of fetchCompletedTasks:
  const loadCompletedTasks = async () => {
    try {
      const completedTasksData = await fetchCompletedTasks(); // Fetch completed tasks data
      setCompletedTasks(completedTasksData); // Update the completedTasks state with the fetched data
      console.log("Completed Tasks:", completedTasksData);
      // Do something with the completed tasks
    } catch (error) {
      console.error("Error loading completed tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks(); // Fetch incomplete tasks
    loadCompletedTasks(); // Fetch completed tasks
  }, []); // Empty dependency array to run this effect only once when the component mounts

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDay(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const calculateEndTime = (dueDate, duration) => {
    if (!duration) {
      return dueDate; // Return dueDate if duration is null
    }

    const durationMinutes = parseInt(duration.split("-")[1], 10);
    const endTime = new Date(dueDate);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    return endTime;
  };

  const updateTasks = useCallback(() => {
    const now = new Date();
    const upcoming = tasks
      .filter((task) => new Date(task.due_date).getTime() > now.getTime())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    const ongoing = tasks.filter((task) => {
      const dueDate = new Date(task.due_date);
      const endTime = new Date(dueDate.getTime() + task.duration * 60000); // Convert duration to milliseconds
      return now >= dueDate && now < endTime;
    });

    // If there's an ongoing task, set it as current task
    if (ongoing.length > 0) {
      setCurrentTask(ongoing[0]);
      setUpcomingTask(
        upcoming[0] && ongoing[0].id !== upcoming[0].id ? upcoming[0] : null
      );
    } else {
      // If no ongoing task, check for upcoming tasks
      if (upcoming.length > 0) {
        // Check if upcoming task's due time has arrived
        if (new Date(upcoming[0].due_date).getTime() <= now.getTime()) {
          // Set upcoming task as current task
          setCurrentTask(upcoming[0]);
          // Calculate end time for the upcoming task
          const endTime = calculateEndTime(
            new Date(upcoming[0].due_date),
            upcoming[0].duration
          );
          // Schedule a function to unset the current task after its duration
          const timer = setTimeout(() => {
            setCurrentTask(null);
          }, endTime.getTime() - now.getTime());
          // Save the timer reference so it can be cleared later if needed
          setCurrentTaskTimer(timer);
          // Set the next upcoming task if available
          setUpcomingTask(upcoming[1] || null);
        } else {
          // If upcoming task's due time hasn't arrived yet, set it as upcoming task
          setCurrentTask(null);
          setUpcomingTask(upcoming[0]);
        }
      } else {
        // If no ongoing or upcoming tasks, set both to null
        setCurrentTask(null);
        setUpcomingTask(null);
      }
    }
  }, [tasks]);

  useEffect(() => {
    updateTasks();
    const interval = setInterval(updateTasks, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tasks, updateTasks]);

  const calculateTimeUntil = (dueDate) => {
    const diff = new Date(dueDate) - new Date();
    if (diff <= 0) return "Now";
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  const calculateTimeRemaining = (endTime) => {
    const now = new Date();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) {
      return "Task is already over";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  if (currentTask) {
    const endTime = new Date(currentTask.due_date);
    const durationMilliseconds = currentTask.duration * 60000; // Convert duration to milliseconds
    endTime.setTime(endTime.getTime() + durationMilliseconds); // Add duration to the due date
    const timeRemaining = calculateTimeRemaining(endTime);
    console.log("Time remaining for current task:", timeRemaining);
  }

  const handleCompleteTask = async (reminderId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.patch(
        `https://tasked-f9aa59675043.herkuapp.com/reminders/${reminderId}/complete`,
        { completed: true },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      // Update the tasks state to remove the completed task
      setTasks((updatedTasks) =>
        updatedTasks.filter((task) => task.id !== reminderId)
      );

      // Update the current task and upcoming task if needed
      updateTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const upcoming = tasks
    .filter((task) => {
      const dueDate = new Date(task.due_date);
      return dueDate.getTime() > now.getTime() && !task.completed;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const currentTasks = tasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    const endTime = calculateEndTime(dueDate, task.duration);
    // Check if task is ongoing and not completed
    return now >= dueDate && now < endTime && !task.completed;
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  const handleDetailsClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleDeleteClick = async (reminderId) => {
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.delete(`https://tasked-f9aa59675043.herkuapp.com/reminders/${reminderId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      // Update the tasks state to remove the deleted reminder
      setTasks(tasks.filter((task) => task.id !== reminderId));

      // Close the popup and clear the selected task
      setShowPopup(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleClickDay = (day) => {
    setSelectedDay(day);
  };

  const addSpecialEvent = (date, name) => {
    const newEvent = { date, name };
    setSpecialEvents([...specialEvents, newEvent]);
  };
  const handleReschedule = (task) => {
    navigate('/create', { state: { taskToReschedule: task } });
  };

  return (
    <div className="w-full px-4 py-8 bg-white rounded-lg shadow-lg mb-8">


<nav className="fixed top-0 left-0 right-0 z-50 mb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16 items-center">
            <Link to="/profile" className="flex items-center">
              {currentUser && currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt="User Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out transform hover:scale-110" />
              )}
            </Link>
          </div>
        </div>
      </nav>
      <div className="w-full px-4 py-8 bg-white rounded-lg shadow-lg mb-8">
        {currentTask ? (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 md:p-4 shadow-lg border border-gray-300 border-solid">
            <h2 className="text-lg font-semibold mb-4 md:mb-2">Current Task</h2>
            <div className="flex flex-col md:flex-row items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-400 md:mr-4 md:mb-0 mb-4 md:mb-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  className="fill-current text-green-400"
                />
              </svg>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-200">
                  {currentTask.title ? currentTask.title : "No Title"}
                </h3>
                <div className="flex flex-wrap items-center mt-2">
                  <p className="text-xs text-gray-300 mr-4 mb-2 md:mb-0 md:mr-8">
                    Due:{" "}
                    <span className="text-gray-200">
                      {currentTask.due_date
                        ? new Date(currentTask.due_date).toLocaleDateString()
                        : "No Due Date"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-300 mr-4 mb-2 md:mb-0 md:mr-8">
                    Priority:{" "}
                    <span className="text-gray-200">
                      {currentTask.priority
                        ? currentTask.priority
                        : "No Priority"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-300 mb-2 md:mb-0">
                    Duration:{" "}
                    <span className="text-gray-200">
                      {currentTask.duration
                        ? currentTask.duration
                        : "No Duration"}
                    </span>
                  </p>
                  {currentTask.due_date ? (
                    <p className="text-xs text-gray-300">
                      Time Remaining:{" "}
                      <span className="text-gray-200">
                        {calculateTimeRemaining(
                          new Date(currentTask.due_date).getTime() +
                            currentTask.duration * 60000
                        )}
                      </span>
                    </p>
                  ) : null}
                </div>
                <button
                  onClick={() => handleCompleteTask(currentTask.id)}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-300"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        ) : upcomingTask ? (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 md:p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 md:mb-2">
              Upcoming Task
            </h2>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-400 mr-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  className="fill-current text-green-400"
                />
              </svg>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-200">
                  {upcomingTask.title}
                </h3>
                <div className="flex items-center mt-2">
                  <p className="text-xs text-gray-300 mr-4">
                    Due:{" "}
                    <span className="text-gray-200">
                      {new Date(upcomingTask.due_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-300 mr-4">
                    Priority:{" "}
                    <span className="text-gray-200">
                      {upcomingTask.priority}
                    </span>
                  </p>
                  <p className="text-xs text-gray-300">
                    Time Until:{" "}
                    <span className="text-gray-200">
                      {calculateTimeUntil(new Date(upcomingTask.due_date))}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 md:p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 md:mb-2">No Tasks</h2>
            <p className="text-gray-200">You have no upcoming tasks.</p>
          </div>
        ) : null}

        <h1 className="text-2xl md:text-4xl font-semibold mb-1 mt-4 text-center text-gray-800">
          {greeting},{" "}
          <span className="text-purple-600 font-bold">
            {currentUser ? currentUser.name : "Guest"}
          </span>
          !
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-4 text-center">
          Stay organized and boost your productivity!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/create">
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 block w-full">
              Create Task
            </button>
          </Link>
          <Link to="/tasks">
            <button className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 transition duration-300 block w-full">
              View Tasks
            </button>
          </Link>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Upcoming Tasks
          </h2>
          <ul className="divide-y divide-gray-200">
            {tasks
              .filter((task) => new Date(task.due_date) >= new Date()) // Filter tasks that haven't passed
              .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
              .slice(0, 4) // Only show the next 4 upcoming tasks
              .map((task) => (
                <li key={task.id} className="py-2 flex items-center">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                    {/* // Inside the JSX where you want to display the time remaining */}
                  </div>
                  <button
                    onClick={() => handleDetailsClick(task)}
                    className="ml-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300"
                  >
                    Details
                  </button>
                </li>
              ))}
          </ul>

          {showPopup && selectedTask && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
              <div className="bg-white rounded-lg p-8 w-96 relative z-10">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedTask.title}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Due: {new Date(selectedTask.due_date).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Location: {selectedTask.location}
                </p>
                <p className="text-gray-700 mb-4">{selectedTask.description}</p>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <svg
                      onClick={handleClosePopup}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-gray-500 text-sm">Close</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      onClick={() => handleDeleteClick(selectedTask.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-700 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-red-500 text-sm">Delete</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Calendar
          </h2>
          <div className="calendar-grid bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 shadow-md xl:w-3/4 mx-auto">
            <Calendar
              onChange={setSelectedDay}
              value={selectedDay}
              className="w-full border border-gray-200 xl:w-auto"
              tileClassName={({ date, view }) =>
                view === "month" && date.getDate() === selectedDay.getDate()
                  ? "selected-day"
                  : "normal-day"
              }
            />
          </div>

          {tasks
            .filter(
              (task) =>
                new Date(task.due_date).toDateString() ===
                selectedDay.toDateString()
            )
            .map((task, index) => (
              <div key={index} className="mt-4">
                <ul className="space-y-4">
                  <li className="task-item bg-white rounded-lg p-4 shadow-md hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-semibold">
                        {task.title}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Due: {new Date(task.due_date).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                    <div className="flex justify-end mt-2">
                      {/* <button className="text-sm text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none">
                        Edit
                      </button> */}
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="flex items-center text-sm text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5 12a1 1 0 01-2 0V8a1 1 0 112 0v9zm4 0a1 1 0 102 0V8a1 1 0 10-2 0v9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Notifications
          </h2>

          <div className="space-y-6">
          <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Missed Tasks</h3>
        <ul className="space-y-2">
          {tasks
            .filter((task) => new Date(task.due_date) < new Date())
            .slice(-4)
            .map((task, index) => (
              <li
                key={index}
                className="bg-red-100 rounded-lg px-4 py-3 shadow-md flex items-center justify-between"
              >
                <span className="text-red-600">
                  You missed the task: {task.title}
                </span>
                <button
                  onClick={() => handleReschedule(task)}
                  className="text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300"
                >
                  Reschedule
                </button>
              </li>
            ))}
        </ul>
      </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
              <div className="completed-tasks-container max-h-72 overflow-y-auto">
                <ul className="space-y-2">
                  {completedTasks.slice(0, 3).map((task) => (
                    <li
                      key={task.id}
                      className="completed-task bg-green-100 rounded-lg px-4 py-3 shadow-md flex items-center justify-between"
                    >
                      <span className="text-green-600 line-through">
                        Task completed: {task.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Upcoming Tasks</h3>
              <ul className="space-y-2">
                {tasks
                  .filter((task) => new Date(task.due_date) >= new Date())
                  .map((task, index) => (
                    <li
                      key={index}
                      className="bg-blue-100 rounded-lg px-4 py-3 shadow-md flex items-center justify-between"
                    >
                      <span className="text-blue-600">
                        Upcoming task: {task.title}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="special-events-section mt-8 bg-gradient-to-br from-purple-200 to-purple-300 p-4 md:p-8 rounded-lg shadow-xl">
              <h2 className="section-title text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-indigo-800">
                Special Events
              </h2>
              {specialEvents.length > 0 ? (
                <ul className="event-list">
                  {specialEvents.map((event, index) => {
                    return (
                      <li
                        key={index}
                        className="event-item bg-white rounded-lg shadow-md mb-4"
                      >
                        <a
                          href="/special-events"
                          className="block hover:bg-purple-100 rounded-lg p-4 md:p-6 transition duration-300"
                        >
                          <h3 className="event-name text-lg md:text-2xl font-semibold text-indigo-900 mb-1 md:mb-2">
                            {event.title}
                          </h3>
                          <span className="event-date text-gray-700 text-sm md:text-base">
                            {new Date(event.due_date).toLocaleDateString()}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="no-events-message text-lg text-gray-600 mt-4">
                  No special events found.
                </p>
              )}
              <Link to="/special">
                <button
                  className="mt-6 md:mt-8 inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg shadow-md transition duration-300"
                  onClick={() => {
                    /* Add your onClick function here */
                  }}
                >
                  Create Task
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
