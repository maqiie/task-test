import React, { Component } from "react";
import axios from "axios";
import "./Task.css";

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      tasks: [],
      activeTask: null,
      isPopupOpen: false,
      editedTask: null,
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3001/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });
      this.setState({ tasks: response.data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value });
  };

  handleDateSearch = (event) => {
    const searchDate = new Date(event.target.value);
    const formattedSearchDate = searchDate.toDateString();
    this.setState({ search: formattedSearchDate });
  };

  handleTaskClick = (task) => {
    this.setState({
      activeTask: task,
      editedTask: { ...task },
      isPopupOpen: true,
    });
  };

  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  handleInputChange = (event, property) => {
    const { editedTask } = this.state;
    let value = event.target.value;

    if (property === "timestamp") {
      const selectedTime = new Date(value);
      const offset = selectedTime.getTimezoneOffset() * 60000;
      value = new Date(selectedTime.getTime() - offset);
    }

    this.setState({ editedTask: { ...editedTask, [property]: value } });
  };

  handleSaveChanges = async () => {
    const { editedTask } = this.state;
    const authToken = localStorage.getItem("authToken");
    const currentTime = new Date().toISOString().slice(0, 16);
    const updatedTask = { ...editedTask, timestamp: currentTime };

    try {
      await axios.put(
        `http://localhost:3001/reminders/${updatedTask.id}`,
        { reminder: updatedTask },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const updatedTasks = this.state.tasks.map((task) =>
        task.id === updatedTask.id ? { ...updatedTask } : task
      );

      this.setState({ tasks: updatedTasks, isPopupOpen: false });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessage = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join(", ")
          : error.response.data.errors;
        alert(`Error: ${errorMessage}`);
      } else {
        console.error("Error saving task:", error);
      }
    }
  };

  handleDeleteTask = async () => {
    const { tasks, editedTask } = this.state;
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3001/reminders/${editedTask.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const updatedTasks = tasks.filter((task) => task.id !== editedTask.id);
      this.setState({ tasks: updatedTasks, isPopupOpen: false });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  render() {
    const { search, tasks, isPopupOpen, editedTask } = this.state;
    const currentDateTime = new Date();
    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.priority.toLowerCase().includes(search.toLowerCase()) ||
        new Date(task.due_date).toDateString() === search
    );

    const incomingTasks = filteredTasks.filter(
      (task) => !task.completed && new Date(task.due_date) > currentDateTime
    );
    const completedTasks = filteredTasks.filter(
      (task) => task.completed || new Date(task.due_date) <= currentDateTime
    );
    const ongoingTasks = filteredTasks.filter(
      (task) => !task.completed && new Date(task.due_date) <= currentDateTime
    );

    return (
      <div className="max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-3xl font-bold bg-indigo-600 text-white py-4 text-center">
          Task
        </h2>
        
        <a href="/invitations">
  <h2 class="text-3xl font-bold bg-indigo-600 text-white py-4 text-center">
    Invitations
  </h2>
</a>

        
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search tasks by title or priority..."
            value={search}
            onChange={this.handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
          />
          <div className="flex items-center">
            <label className="block text-gray-700 mr-2">Search by date:</label>
            <input
              type="date"
              onChange={this.handleDateSearch}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="task-container px-4 py-2">
          <h3 className="incoming-header text-2xl font-semibold mb-4">
            Incoming Tasks
          </h3>
          {incomingTasks.length === 0 ? (
            <p className="text-gray-500">No incoming tasks.</p>
          ) : (
            incomingTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item bg-white rounded-md p-4 mb-4 cursor-pointer hover:shadow-md transition duration-300 border border-gray-200`}
                onClick={() => this.handleTaskClick(task)}
              >
                <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Due Date: {new Date(task.due_date).toLocaleDateString()}{" "}
                  {new Date(task.due_date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Location: {task.location}
                </p>
                <span
                  className={`priority-badge text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-600 text-white"
                      : task.priority === "medium"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  Incoming
                </span>
              </div>
            ))
          )}
        </div>
        <div className="task-container px-4 py-2">
          <h3 className="ongoing-header text-2xl font-semibold mb-4">
            Ongoing Tasks
          </h3>
          {ongoingTasks.length === 0 ? (
            <p className="text-gray-500">No ongoing tasks.</p>
          ) : (
            ongoingTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item bg-white rounded-md p-4 mb-4 cursor-pointer hover:shadow-md transition duration-300 border border-gray-200`}
                onClick={() => this.handleTaskClick(task)}
              >
                <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Due Date: {new Date(task.due_date).toLocaleDateString()}{" "}
                  {new Date(task.due_date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Location: {task.location}
                </p>
                <span
                  className={`priority-badge text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-600 text-white"
                      : task.priority === "medium"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
                <span className="ml-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                  Ongoing
                </span>
              </div>
            ))
          )}
        </div>

        <div className="task-container px-4 py-2">
          <h3 className="completed-header text-2xl font-semibold mb-4">
            Completed Tasks
          </h3>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks.</p>
          ) : (
            completedTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item bg-white rounded-md p-4 mb-4 cursor-pointer hover:shadow-md transition duration-300 border ${
                  task.completed ? "border-green-500" : "border-gray-200"
                }`}
                onClick={() => this.handleTaskClick(task)}
              >
                <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Due Date: {new Date(task.due_date).toLocaleDateString()}{" "}
                  {new Date(task.due_date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Location: {task.location}
                </p>
                <span
                  className={`priority-badge text-xs font-semibold inline-block px-2 py-1 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-600 text-white"
                      : task.priority === "medium"
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
                {task.completed && (
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Completed
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {isPopupOpen && editedTask && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-md bg-gray-100 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-4">
                Edit Task
              </h2>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => this.handleInputChange(e, "title")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
                placeholder="Task title..."
              />
              <textarea
                value={editedTask.details}
                onChange={(e) => this.handleInputChange(e, "details")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
                rows="4"
                placeholder="Task details..."
              ></textarea>
              <input
                type="datetime-local"
                value={
                  editedTask.timestamp
                    ? new Date(editedTask.timestamp).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => this.handleInputChange(e, "timestamp")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
              />
              <select
                value={editedTask.priority}
                onChange={(e) => this.handleInputChange(e, "priority")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="text"
                value={editedTask.location}
                onChange={(e) => this.handleInputChange(e, "location")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
                placeholder="Task location..."
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={this.handleSaveChanges}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={this.handleClosePopup}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={this.handleDeleteTask}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Task;
