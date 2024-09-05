/* eslint-disable */


import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import actionCableConsumer from "../actionCableConsumer";
import "./createTask.css";
import Loader from "./Loader";
import LocationPicker from "./Location";

const CreateTask = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [duration, setDuration] = useState("");
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(""); // Updated state for recurrence frequency
  const [recurrenceInterval, setRecurrenceInterval] = useState(""); // Updated state for recurrence interval
  const [recurrenceUnit, setRecurrenceUnit] = useState(""); // Updated state for recurrence unit
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [conflict, setConflict] = useState(null);
  const [alternativeTime, setAlternativeTime] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestAddFriend, setSuggestAddFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [acceptedFriends, setAcceptedFriends] = useState([]);

  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:3001/reminders?date=${dueDate}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (dueDate) {
      fetchTasks();
    }
  }, [dueDate]);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:3001/friend_requests/${userId}/accepted`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setAcceptedFriends(response.data);
      } catch (error) {
        console.error("Error fetching accepted friends:", error);
      }
    };

    fetchAcceptedFriends();
  }, [userId]);

  const handleSearch = debounce(async (searchTerm) => {
    try {
      setSearchTerm(searchTerm.trim().toLowerCase());
      setLoading(true);

      if (!searchTerm || acceptedFriends.length === 0) {
        setFilteredUsers([]);
        setLoading(false);
        return;
      }

      const filtered = acceptedFriends.filter((friend) => {
        const friendName = friend.name.toLowerCase();
        const friendEmail = friend.email.toLowerCase();

        return (
          friendName.includes(searchTerm) || friendEmail.includes(searchTerm)
        );
      });

      setFilteredUsers(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error filtering users:", error);
      setLoading(false);
    }
  }, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Setting loading state to true");

    try {
      const authToken = localStorage.getItem("authToken");
      const dueDateTime = `${dueDate}T${dueTime}:00`;
      const dueDateTimeISO = new Date(dueDateTime).toISOString();
      const taskDurationMinutes = getTaskDurationMinutes(duration);

      const taskPayload = {
        reminder: {
          title: taskName,
          due_date: dueDateTimeISO,
          priority: priority,
          location: location,
          description: details,
          duration: taskDurationMinutes,
          user_ids: selectedUsers.map((user) => user.id),
          recurrence_frequency: recurrenceFrequency, // Updated
          recurrence_interval: recurrenceInterval, // Updated
        },
      };

      const response = await axios.post(
        "http://localhost:3001/reminders",
        taskPayload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("API response:", response.data);

      setTaskName("");
      setDueDate("");
      setDueTime("");
      setPriority("");
      setLocation("");
      setDetails("");
      setDuration("");
      setRecurrenceFrequency(""); // Reset state
      setRecurrenceInterval(""); // Reset state
      setRecurrenceUnit(""); // Reset state
      setError(null);
      setConflict(null);
      setAlternativeTime(null);
      setTasks([...tasks, response.data.reminder]);
      setSuccessMessage("Task created successfully!");
      setSelectedUsers([]);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error submitting task:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      setError("Error submitting task. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("Setting loading state to false");
    }
  };
 

  const getTaskDurationMinutes = (duration) => {
    return (
      {
        "0-30 minutes": 30,
        "1 hour": 60,
        "2 hours": 120,
        "3 hours": 180,
        "4 hours and above": 240,
      }[duration] || 0
    );
  };

  const checkForConflicts = () => {
    if (!dueDate || !dueTime || !duration) return null;

    const dueDateTime = new Date(`${dueDate}T${dueTime}:00`);
    const taskDurationMinutes = getTaskDurationMinutes(duration);
    const dueEndTime = new Date(
      dueDateTime.getTime() + taskDurationMinutes * 60000
    );

    for (let task of tasks) {
      const taskStartTime = new Date(task.due_date);
      const taskEndTime = new Date(
        taskStartTime.getTime() + task.duration * 60000
      );
      if (
        (dueDateTime >= taskStartTime && dueDateTime < taskEndTime) ||
        (dueEndTime > taskStartTime && dueEndTime <= taskEndTime) ||
        (taskStartTime >= dueDateTime && taskStartTime < dueEndTime)
      ) {
        return task;
      }
    }

    return null;
  };

  const handleChange = (e) => {
    const { value } = e.target;
    handleSearch(value);
  };
  const suggestAlternativeTime = async () => {
    if (!conflict || !dueDate || !dueTime || !duration || !taggedUserId) return null;
  
    const taskDurationMinutes = getTaskDurationMinutes(duration);
    const conflictingTaskEndTime = new Date(conflict.due_date).getTime() + conflict.duration * 60000;
    let alternativeStartTime = new Date(conflictingTaskEndTime + 60000);
  
    // Fetch schedules of both users
    const [userTasks, taggedUserTasks] = await Promise.all([
      fetchUserTasks(), // Function to fetch the current user's tasks
      fetchTaggedUserTasks(taggedUserId) // Function to fetch the tagged user's tasks
    ]);
  
    const sortedUserTasks = userTasks
      .map(task => ({
        start: new Date(task.due_date),
        end: new Date(task.due_date).getTime() + task.duration * 60000
      }))
      .sort((a, b) => a.start - b.start);
  
    const sortedTaggedUserTasks = taggedUserTasks
      .map(task => ({
        start: new Date(task.due_date),
        end: new Date(task.due_date).getTime() + task.duration * 60000
      }))
      .sort((a, b) => a.start - b.start);
  
    // Check for gaps in both users' schedules
    for (let i = 0; i < sortedUserTasks.length - 1; i++) {
      const currentTaskEnd = sortedUserTasks[i].end;
      const nextTaskStart = sortedUserTasks[i + 1].start;
  
      if (currentTaskEnd + taskDurationMinutes * 60000 <= nextTaskStart) {
        alternativeStartTime = new Date(currentTaskEnd + 60000);
        break;
      }
    }
  
    // Ensure that the suggested time does not conflict with the tagged user's schedule
    while (alternativeStartTime) {
      const alternativeEndTime = new Date(
        alternativeStartTime.getTime() + taskDurationMinutes * 60000
      );
  
      const isUserConflicting = userTasks.some(task => {
        const taskStartTime = new Date(task.due_date);
        const taskEndTime = new Date(task.due_date).getTime() + task.duration * 60000;
        return (
          (alternativeStartTime >= taskStartTime && alternativeStartTime < taskEndTime) ||
          (alternativeEndTime > taskStartTime && alternativeEndTime <= taskEndTime) ||
          (taskStartTime >= alternativeStartTime && taskStartTime < alternativeEndTime)
        );
      });
  
      const isTaggedUserConflicting = taggedUserTasks.some(task => {
        const taskStartTime = new Date(task.due_date);
        const taskEndTime = new Date(task.due_date).getTime() + task.duration * 60000;
        return (
          (alternativeStartTime >= taskStartTime && alternativeStartTime < taskEndTime) ||
          (alternativeEndTime > taskStartTime && alternativeEndTime <= taskEndTime) ||
          (taskStartTime >= alternativeStartTime && taskStartTime < alternativeEndTime)
        );
      });
  
      if (!isUserConflicting && !isTaggedUserConflicting) {
        if (alternativeStartTime instanceof Date && !isNaN(alternativeStartTime.getTime())) {
          return alternativeStartTime;
        } else {
          console.error('Invalid alternative start time:', alternativeStartTime);
          return null;
        }
      }
  
      // Move to the next potential slot
      alternativeStartTime = new Date(alternativeStartTime.getTime() + 60000);
    }
  
    return null;
  };
  
  const displayAlternativeTime = (alternativeTime) => {
    if (alternativeTime && alternativeTime instanceof Date && !isNaN(alternativeTime.getTime())) {
      return alternativeTime.toLocaleTimeString();
    }
    return 'No valid alternative time available';
  };
  
  // Usage in your component
  

  const handleUserSelect = (user) => {
    console.log("User selected:", user);
    setSelectedUsers((prevSelectedUsers) => {
      const isAlreadySelected = prevSelectedUsers.some(
        (selectedUser) => selectedUser.id === user.id
      );
  
      if (isAlreadySelected) {
        return prevSelectedUsers.filter(
          (selectedUser) => selectedUser.id !== user.id
        );
      } else {
        const updatedUser = {
          id: user.id,
          sender: {
            name: user.name,
            email: user.email,
          },
        };
  
        return [...prevSelectedUsers, updatedUser];
      }
    });
  };
  

  const renderSelectedUsers = () => {
    return (
      <ul className="selected-users-list">
        {selectedUsers.map((user) => (
          <li key={user.id} className="selected-user-item">
            {user.sender?.name} ({user.sender?.email})
            <button onClick={() => handleUserSelect(user)}>Remove</button>
          </li>
        ))}
      </ul>
    );
  };

  const renderFilteredUsers = () => {
    return (
      <ul className="filtered-users-list">
        {filteredUsers.map((friend) => (
          <li key={friend.id} onClick={() => handleUserSelect(friend)}>
            {friend.name} ({friend.email})
          </li>
        ))}
      </ul>
    );
  };
  useEffect(() => {
    console.log("Filtered users:", filteredUsers);
  }, [filteredUsers]);
  


  return (
    <div className={`create-task-container ${isBlurred ? "blurred" : ""}`}>
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="task-form">
        <h2 className="form-title">Create Task</h2>
        <div className="form-group">
          <label htmlFor="taskName">Task Name:</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueTime">Due Time:</label>
          <input
            type="time"
            id="dueTime"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value.toLowerCase())} // Ensure lowercase
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <LocationPicker location={location} setLocation={setLocation} />
        </div>
        <div className="form-group">
          <label htmlFor="details">Details:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration:</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Select duration</option>
            <option value="0-30 minutes">0-30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="3 hours">3 hours</option>
            <option value="4 hours and above">4 hours and above</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recurrenceFrequency">Recurrence Frequency:</label>
          <select
            id="recurrenceFrequency"
            value={recurrenceFrequency}
            onChange={(e) => setRecurrenceFrequency(e.target.value)}
          >
            <option value="">Select frequency</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label htmlFor="search">Invite Users:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleChange}
          />
          {loading && <div>Loading...</div>}
          {renderFilteredUsers()}
        </div>
        {renderSelectedUsers()}
        <button type="submit" disabled={loading}>
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
      {conflict && (
        <div className="conflict">
          <strong>Conflict with existing task:</strong> {conflict.title}{" "}
          (Duration: {conflict.duration} minutes)
          {alternativeTime && (
            <div>
              <strong>Suggested Alternative Time:</strong>{" "}
              {alternativeTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default CreateTask;