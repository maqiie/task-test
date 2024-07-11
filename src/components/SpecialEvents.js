
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
  const [occasion, setOccasion] = useState("");
  const [reminder, setReminder] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [specialEvents, setSpecialEventsState] = useState([]);
  const [duration, setDuration] = useState("");
  const [notification, setNotification] = useState("");

  const fetchPublicHolidays = async () => {
    try {
      const apiKey = "s2BdzSlFREJFPCjXWWFKMBRWBZXDbfJo"; // Replace with your Calendarific API key
      const year = new Date().getFullYear();
      const countries = ["KE", "TZ"];
      const holidayRequests = countries.map((country) =>
        axios.get(`https://calendarific.com/api/v2/holidays`, {
          params: {
            api_key: apiKey,
            country,
            year,
            type: "national",
          },
        })
      );
      const responses = await Promise.all(holidayRequests);
      const holidays = responses.flatMap(
        (response) => response.data.response.holidays
      );
      const currentMonth = new Date().getMonth() + 1;
      const filteredHolidays = holidays.filter((holiday) => {
        const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
        return holidayMonth === currentMonth;
      });
      setPublicHolidays(filteredHolidays);
    } catch (error) {
      console.error("Error fetching public holidays:", error);
    }
  };

  const fetchSpecialEvents = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get("http://localhost:3001/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      // Filter special events from the response data
      const specialEventsData = response.data.filter(
        (event) => event.is_special_event
      );

      // Set the filtered special events in state
      setSpecialEventsState(specialEventsData);
    } catch (error) {
      console.error("Error fetching special events:", error);
    }
  };

  useEffect(() => {
    fetchPublicHolidays();
    fetchSpecialEvents();
  }, []);

  const handleAddSpecialEvent = async () => {
    const authToken = localStorage.getItem("authToken");

    if (occasion && reminder && duration) {
      // Make sure duration is not blank
      try {
        const response = await axios.post(
          "http://localhost:3001/reminders",
          {
            reminder: {
              title: occasion,
              description: reminder,
              due_date: selectedDate,
              is_special_event: true,
              occasion,
              duration: duration, // Include duration in the request payload
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
          }
        );
        addSpecialEvent(response.data);
        setSpecialEventsState([...specialEvents, response.data]);
        setOccasion("");
        setReminder("");
        setDuration(""); // Clear duration after successful addition
        setNotification("Special event added successfully!");
        setTimeout(() => {
          setNotification("");
        }, 3000); // Hide the notification after 3 seconds
      } catch (error) {
        console.error("Error adding special event:", error);
        setNotification("Error adding special event. Please try again.");
        setTimeout(() => {
          setNotification("");
        }, 3000); // Hide the notification after 3 seconds
      }
    } else {
      console.error("Duration is required");
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Function to calculate countdown in days
  const calculateCountdown = (date) => {
    const now = new Date();
    const differenceInTime = date.getTime() - now.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? `${differenceInDays} days` : "Today";
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row">
      {/* Calendar */}
      <div className="w-full md:w-1/2 mr-0 md:mr-4 mb-4 md:mb-0 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Special Events Calendar Personal work
        </h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="border border-gray-300 rounded-md shadow-md"
        />
      </div>

      {/* Special Occasions and Public Holidays */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Special Occasions
        </h2>
        {/* Notification */}
        {notification && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{notification}</span>
          </div>
        )}
        {/* Special Events List */}
        <ul className="space-y-4">
          {specialEvents.map((event, index) => (
            <li key={index} className="bg-gray-100 rounded-md p-4 shadow-md">
              <div>
                <span className="text-lg font-semibold text-purple-600">
                  {event.occasion}
                </span>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-gray-700">
                  Date: {formatDate(new Date(event.due_date))}
                </p>
                <p className="text-gray-700">
                  Countdown: {calculateCountdown(new Date(event.due_date))}
                </p>
              </div>
            </li>
          ))}
          {/* Public Holidays List */}
          {publicHolidays.map((holiday, index) => (
            <li key={index} className="bg-red-100 rounded-md p-4 shadow-md">
              <div>
                <span className="text-lg font-semibold text-red-600">
                  {holiday.name}
                </span>
                <p className="text-gray-700">{holiday.description}</p>
                <p className="text-gray-700">
                  Date: {formatDate(new Date(holiday.date.iso))}
                </p>
                <p className="text-gray-700">Country: {holiday.country.name}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Form to add special occasion */}
        <div
          className="mt-4 flex flex
flex-col items-center w-full"
        >
          <input
            type="text"
            placeholder="Occasion"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reminder"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-
  2 focus:ring-2 focus:ring-purple-600 w-full mb-2"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (in minutes)"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 w-full"
            onClick={handleAddSpecialEvent}
          >
            Add Special Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialEvents;
