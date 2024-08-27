/* eslint-disable */

// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import axios from "axios";
// import apiClient from "../services/apiService"; // Import your apiClient

// const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
//   const [occasion, setOccasion] = useState("");
//   const [reminder, setReminder] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [publicHolidays, setPublicHolidays] = useState([]);
//   const [specialEvents, setSpecialEventsState] = useState([]);
//   const [duration, setDuration] = useState("");
//   const [notification, setNotification] = useState("");

//   const fetchPublicHolidays = async () => {
//     try {
//       const apiKey = "s2BdzSlFREJFPCjXWWFKMBRWBZXDbfJo"; // Replace with your Calendarific API key
//       const year = new Date().getFullYear();
//       const countries = ["KE", "TZ"];
//       const holidayRequests = countries.map((country) =>
//         axios.get(`https://calendarific.com/api/v2/holidays`, {
//           params: {
//             api_key: apiKey,
//             country,
//             year,
//             type: "national",
//           },
//         })
//       );
//       const responses = await Promise.all(holidayRequests);
//       const holidays = responses.flatMap(
//         (response) => response.data.response.holidays
//       );
//       const currentMonth = new Date().getMonth() + 1;
//       const filteredHolidays = holidays.filter((holiday) => {
//         const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
//         return holidayMonth === currentMonth;
//       });
//       setPublicHolidays(filteredHolidays);
//     } catch (error) {
//       console.error("Error fetching public holidays:", error);
//     }
//   };

//   const fetchSpecialEvents = async () => {
//     const authToken = localStorage.getItem("authToken");

//     try {
//       const response = await apiClient.get("/reminders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           Accept: "application/json",
//         },
//       });

//       // Filter special events from the response data
//       const specialEventsData = response.data.filter(
//         (event) => event.is_special_event
//       );

//       // Set the filtered special events in state
//       setSpecialEventsState(specialEventsData);
//     } catch (error) {
//       console.error("Error fetching special events:", error);
//     }
//   };

//   const handleAddSpecialEvent = async () => {
//     const authToken = localStorage.getItem("authToken");

//     if (occasion && reminder && duration) {
//       try {
//         const response = await apiClient.post(
//           "/reminders",
//           {
//             reminder: {
//               title: occasion,
//               description: reminder,
//               due_date: selectedDate,
//               is_special_event: true,
//               occasion,
//               duration: duration, // Include duration in the request payload
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         addSpecialEvent(response.data);
//         setSpecialEventsState([...specialEvents, response.data]);
//         setOccasion("");
//         setReminder("");
//         setDuration(""); // Clear duration after successful addition
//         setNotification("Special event added successfully!");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000); // Hide the notification after 3 seconds
//       } catch (error) {
//         console.error("Error adding special event:", error);
//         setNotification("Error adding special event. Please try again.");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000); // Hide the notification after 3 seconds
//       }
//     } else {
//       console.error("Duration is required");
//     }
//   };
//   const formatDate = (date) => {
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };

//   // Function to calculate countdown in days
//   const calculateCountdown = (date) => {
//     const now = new Date();
//     const differenceInTime = date.getTime() - now.getTime();
//     const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
//     return differenceInDays > 0 ? `${differenceInDays} days` : "Today";
//   };

//   return (
//     <div className="mt-8 flex flex-col md:flex-row">
//       {/* Calendar */}
//       <div className="w-full md:w-1/2 mr-0 md:mr-4 mb-4 md:mb-0 bg-white rounded-lg shadow-md p-4">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Events Calendar Personal work
//         </h2>
//         <Calendar
//           onChange={setSelectedDate}
//           value={selectedDate}
//           className="border border-gray-300 rounded-md shadow-md"
//         />
//       </div>

//       {/* Special Occasions and Public Holidays */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Occasions
//         </h2>
//         {/* Notification */}
//         {notification && (
//           <div
//             className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <span className="block sm:inline">{notification}</span>
//           </div>
//         )}
//         {/* Special Events List */}
//         <ul className="space-y-4">
//           {specialEvents.map((event, index) => (
//             <li key={index} className="bg-gray-100 rounded-md p-4 shadow-md">
//               <div>
//                 <span className="text-lg font-semibold text-purple-600">
//                   {event.occasion}
//                 </span>
//                 <p className="text-gray-700">{event.description}</p>
//                 <p className="text-gray-700">
//                   Date: {formatDate(new Date(event.due_date))}
//                 </p>
//                 <p className="text-gray-700">
//                   Countdown: {calculateCountdown(new Date(event.due_date))}
//                 </p>
//               </div>
//             </li>
//           ))}
//           {/* Public Holidays List */}
//           {publicHolidays.map((holiday, index) => (
//             <li key={index} className="bg-red-100 rounded-md p-4 shadow-md">
//               <div>
//                 <span className="text-lg font-semibold text-red-600">
//                   {holiday.name}
//                 </span>
//                 <p className="text-gray-700">{holiday.description}</p>
//                 <p className="text-gray-700">
//                   Date: {formatDate(new Date(holiday.date.iso))}
//                 </p>
//                 <p className="text-gray-700">Country: {holiday.country.name}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {/* Form to add special occasion */}
//         <div
//           className="mt-4 flex flex
// flex-col items-center w-full"
//         >
//           <input
//             type="text"
//             placeholder="Occasion"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={occasion}
//             onChange={(e) => setOccasion(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Reminder"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-
//   2 focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={reminder}
//             onChange={(e) => setReminder(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Duration (in minutes)"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//           />
//           <input
//             type="date"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={selectedDate.toISOString().split("T")[0]}
//             onChange={(e) => setSelectedDate(new Date(e.target.value))}
//           />
//           <button
//             className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 w-full"
//             onClick={handleAddSpecialEvent}
//           >
//             Add Special Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialEvents;
  


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import apiClient from "../services/apiService"; // Import your apiClient

// const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
//   const [occasion, setOccasion] = useState("");
//   const [reminder, setReminder] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [publicHolidays, setPublicHolidays] = useState([]);
//   const [specialEvents, setSpecialEventsState] = useState([]);
//   const [duration, setDuration] = useState("");
//   const [notification, setNotification] = useState("");

//   useEffect(() => {
//     fetchPublicHolidays();
//     fetchSpecialEvents();
//   }, []);

//   const fetchPublicHolidays = async () => {
//     try {
//       const apiKey = "s2BdzSlFREJFPCjXWWFKMBRWBZXDbfJo"; // Replace with your Calendarific API key
//       const year = new Date().getFullYear();
//       const countries = ["KE", "TZ"];
//       const holidayRequests = countries.map((country) =>
//         axios.get(`https://calendarific.com/api/v2/holidays`, {
//           params: {
//             api_key: apiKey,
//             country,
//             year,
//             type: "national",
//           },
//         })
//       );
//       const responses = await Promise.all(holidayRequests);
//       const holidays = responses.flatMap(
//         (response) => response.data.response.holidays
//       );
//       const currentMonth = new Date().getMonth() + 1;
//       const filteredHolidays = holidays.filter((holiday) => {
//         const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
//         return holidayMonth === currentMonth;
//       });
//       setPublicHolidays(filteredHolidays);
//     } catch (error) {
//       console.error("Error fetching public holidays:", error);
//     }
//   };

//   const fetchSpecialEvents = async () => {
//     const authToken = localStorage.getItem("authToken");

//     try {
//       const response = await apiClient.get("/reminders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           Accept: "application/json",
//         },
//       });

//       // Filter special events from the response data
//       const specialEventsData = response.data.filter(
//         (event) => event.is_special_event
//       );

//       // Set the filtered special events in state
//       setSpecialEventsState(specialEventsData);
//     } catch (error) {
//       console.error("Error fetching special events:", error);
//     }
//   };

//   const handleAddSpecialEvent = async () => {
//     const authToken = localStorage.getItem("authToken");

//     if (occasion && reminder && duration) {
//       try {
//         const response = await apiClient.post(
//           "/reminders",
//           {
//             reminder: {
//               title: occasion,
//               description: reminder,
//               due_date: selectedDate,
//               is_special_event: true,
//               occasion,
//               duration: duration, // Include duration in the request payload
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         addSpecialEvent(response.data);
//         setSpecialEventsState([...specialEvents, response.data]);
//         setOccasion("");
//         setReminder("");
//         setDuration(""); // Clear duration after successful addition
//         setNotification("Special event added successfully!");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000); // Hide the notification after 3 seconds
//       } catch (error) {
//         console.error("Error adding special event:", error);
//         setNotification("Error adding special event. Please try again.");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000); // Hide the notification after 3 seconds
//       }
//     } else {
//       console.error("Duration is required");
//     }
//   };

//   const formatDate = (date) => {
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };

//   // Function to calculate countdown in days
//   const calculateCountdown = (date) => {
//     const now = new Date();
//     const differenceInTime = date.getTime() - now.getTime();
//     const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
//     return differenceInDays > 0 ? `${differenceInDays} days` : "Today";
//   };

//   // Format events and holidays for FullCalendar
//   const events = [
//     ...specialEvents.map((event) => ({
//       title: `${event.occasion} - ${event.description}`,
//       date: event.due_date,
//     })),
//     ...publicHolidays.map((holiday) => ({
//       title: `${holiday.name} (${holiday.country.name})`,
//       date: holiday.date.iso,
//       color: "red", // Style public holidays differently
//     })),
//   ];

//   return (
//     <div className="mt-8 flex flex-col md:flex-row">
//       {/* Calendar */}
//       <div className="w-full md:w-1/2 mb-4 md:mb-0 bg-white rounded-lg shadow-md p-4">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Events Calendar
//         </h2>
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           selectable={true}
//           dateClick={(info) => setSelectedDate(info.date)}
//         />
//       </div>

//       {/* Special Occasions */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Occasions
//         </h2>
//         {/* Notification */}
//         {notification && (
//           <div
//             className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <span className="block sm:inline">{notification}</span>
//           </div>
//         )}
//         {/* Special Events List */}
//         <ul className="space-y-4">
//           {specialEvents.map((event, index) => (
//             <li key={index} className="bg-gray-100 rounded-md p-4 shadow-md">
//               <div>
//                 <span className="text-lg font-semibold text-purple-600">
//                   {event.occasion}
//                 </span>
//                 <p className="text-gray-700">{event.description}</p>
//                 <p className="text-gray-700">
//                   Date: {formatDate(new Date(event.due_date))}
//                 </p>
//                 <p className="text-gray-700">
//                   Countdown: {calculateCountdown(new Date(event.due_date))}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {/* Form to add special occasion */}
//         <div className="mt-4 flex flex-col items-center w-full">
//           <input
//             type="text"
//             placeholder="Occasion"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={occasion}
//             onChange={(e) => setOccasion(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Reminder"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={reminder}
//             onChange={(e) => setReminder(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Duration (in minutes)"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//           />
//           <input
//             type="date"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={selectedDate.toISOString().split("T")[0]}
//             onChange={(e) => setSelectedDate(new Date(e.target.value))}
//           />
//           <button
//             className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 w-full"
//             onClick={handleAddSpecialEvent}
//           >
//             Add Special Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialEvents;


// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import apiClient from "../services/apiService"; // Import your apiClient
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
//   const [occasion, setOccasion] = useState("");
//   const [reminder, setReminder] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [publicHolidays, setPublicHolidays] = useState([]);
//   const [specialEvents, setSpecialEventsState] = useState([]);
//   const [duration, setDuration] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [notification, setNotification] = useState("");

//   useEffect(() => {
//     fetchPublicHolidays();
//     fetchSpecialEvents();
//   }, []);

//   const fetchPublicHolidays = async () => {
//     try {
//       const apiKey = "s2BdzSlFREJFPCjXWWFKMBRWBZXDbfJo"; // Replace with your Calendarific API key
//       const year = new Date().getFullYear();
//       const countries = ["KE", "TZ"];
//       const holidayRequests = countries.map((country) =>
//         axios.get(`https://calendarific.com/api/v2/holidays`, {
//           params: {
//             api_key: apiKey,
//             country,
//             year,
//             type: "national",
//           },
//         })
//       );
//       const responses = await Promise.all(holidayRequests);
//       const holidays = responses.flatMap(
//         (response) => response.data.response.holidays
//       );
//       const currentMonth = new Date().getMonth() + 1;
//       const filteredHolidays = holidays.filter((holiday) => {
//         const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
//         return holidayMonth === currentMonth;
//       });
//       setPublicHolidays(filteredHolidays);
//     } catch (error) {
//       console.error("Error fetching public holidays:", error);
//     }
//   };

//   const fetchSpecialEvents = async () => {
//     const authToken = localStorage.getItem("authToken");

//     try {
//       const response = await apiClient.get("/reminders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           Accept: "application/json",
//         },
//       });

//       const specialEventsData = response.data.filter(
//         (event) => event.is_special_event
//       );

//       setSpecialEventsState(specialEventsData);
//     } catch (error) {
//       console.error("Error fetching special events:", error);
//     }
//   };

//   const handleAddSpecialEvent = async () => {
//     const authToken = localStorage.getItem("authToken");

//     if (occasion && reminder && selectedDate && duration && priority) {
//       try {
//         const response = await apiClient.post(
//           "/reminders",
//           {
//             reminder: {
//               title: occasion,
//               description: reminder,
//               due_date: selectedDate.toISOString(), // Format date to ISO string
//               is_special_event: true,
//               occasion,
//               duration: duration,
//               priority: priority,
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         addSpecialEvent(response.data);
//         setSpecialEventsState([...specialEvents, response.data]);
//         setOccasion("");
//         setReminder("");
//         setSelectedDate(new Date()); // Reset date picker
//         setDuration("");
//         setPriority("Medium");
//         setNotification("Special event added successfully!");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000);
//       } catch (error) {
//         console.error("Error adding special event:", error);
//         setNotification("Error adding special event. Please try again.");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000);
//       }
//     } else {
//       console.error("All fields including date are required");
//     }
//   };

//   const handleEventDrop = async (info) => {
//     const authToken = localStorage.getItem("authToken");
//     const eventId = info.event.id;
//     const newDate = info.event.startStr;

//     try {
//       await apiClient.put(
//         `/reminders/${eventId}`,
//         {
//           reminder: {
//             due_date: newDate,
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             Accept: "application/json",
//           },
//         }
//       );
//       fetchSpecialEvents(); // Refresh events after update
//       setNotification("Event date updated successfully!");
//       setTimeout(() => {
//         setNotification("");
//       }, 3000);
//     } catch (error) {
//       console.error("Error updating event date:", error);
//       setNotification("Error updating event date. Please try again.");
//       setTimeout(() => {
//         setNotification("");
//       }, 3000);
//     }
//   };

//   const formatDate = (date) => {
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };

//   const calculateCountdown = (date) => {
//     const now = new Date();
//     const differenceInTime = date.getTime() - now.getTime();
//     const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
//     return differenceInDays > 0 ? `${differenceInDays} days` : "Today";
//   };

//   const events = [
//     ...specialEvents.map((event) => ({
//       id: event.id,
//       title: `${event.occasion} - ${event.description}`,
//       date: event.due_date.split("T")[0], // Format date to YYYY-MM-DD
//       color:
//         event.priority === "High"
//           ? "red"
//           : event.priority === "Medium"
//           ? "orange"
//           : "green",
//     })),
//     ...publicHolidays.map((holiday) => ({
//       title: `${holiday.name} (${holiday.country.name})`,
//       date: holiday.date.iso.split("T")[0], // Format date to YYYY-MM-DD
//       color: "blue",
//     })),
//   ];

//   return (
//     <div className="mt-8 flex flex-col md:flex-row gap-4">
//       {/* Calendar */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 overflow-hidden">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Events Calendar
//         </h2>
//         <div className="relative w-full">
//           <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events}
//             selectable={true}
//             dateClick={(info) => setSelectedDate(info.dateStr)}
//             eventDrop={handleEventDrop} // Handle event drop
//             className="w-full"
//           />
//         </div>
//       </div>

//       {/* Special Occasions */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 overflow-hidden">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Occasions
//         </h2>
//         {/* Notification */}
//         {notification && (
//           <div
//             className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <span className="block sm:inline">{notification}</span>
//           </div>
//         )}
//         {/* Special Events List */}
//         <ul className="space-y-4">
//           {specialEvents.length === 0 && (
//             <li className="text-gray-500 text-center">No special occasions found.</li>
//           )}
//           {specialEvents.map((event, index) => (
//             <li
//               key={index}
//               className="bg-gray-100 rounded-md p-4 shadow-md border-l-4"
//               style={{
//                 borderColor:
//                   event.priority === "High"
//                     ? "red"
//                     : event.priority === "Medium"
//                     ? "orange"
//                     : "green",
//               }}
//             >
//               <div>
//                 <span className="text-lg font-semibold text-purple-600">
//                   {event.occasion}
//                 </span>
//                 <p className="text-gray-700">{event.description}</p>
//                 <p className="text-gray-700">
//                   Date: {formatDate(new Date(event.due_date))}
//                 </p>
//                 <p className="text-gray-700">
//                   Countdown: {calculateCountdown(new Date(event.due_date))}
//                 </p>
//                 <p
//                   className={`text-xs px-2 py-1 rounded-md ${
//                     event.priority === "High"
//                       ? "bg-red-100 text-red-800"
//                       : event.priority === "Medium"
//                       ? "bg-orange-100 text-orange-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   Priority: {event.priority}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {/* Form to Add Special Events */}
//         <div className="mt-4">
//           <h3 className="text-xl font-semibold mb-2">Add Special Event</h3>
//           <input
//             type="text"
//             placeholder="Occasion"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={occasion}
//             onChange={(e) => setOccasion(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Reminder"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={reminder}
//             onChange={(e) => setReminder(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Duration"
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//           />
//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//             value={priority}
//             onChange={(e) => setPriority(e.target.value)}
//           >
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </select>
//           {/* Date Picker */}
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full mb-2"
//           />
//           <button
//             className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
//             onClick={handleAddSpecialEvent}
//           >
//             Add Special Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialEvents;



// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import apiClient from "../services/apiService"; // Import your apiClient
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import PropTypes from 'prop-types';

// const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
//   const [occasion, setOccasion] = useState("");
//   const [reminder, setReminder] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [publicHolidays, setPublicHolidays] = useState([]);
//   const [specialEvents, setSpecialEventsState] = useState([]);
//   const [duration, setDuration] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [notification, setNotification] = useState("");

//   useEffect(() => {
//     fetchPublicHolidays();
//     fetchSpecialEvents();
//   }, []);

//   const fetchSpecialEvents = async () => {
//     const authToken = localStorage.getItem("authToken");
  
//     try {
//       const response = await apiClient.get("/reminders", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           Accept: "application/json",
//         },
//       });
  
//       const specialEventsData = response.data.filter(
//         (event) => event.is_special_event
//       );
  
//       console.log("Special Events Data:", specialEventsData); // Log data
  
//       setSpecialEventsState(specialEventsData);
//     } catch (error) {
//       console.error("Error fetching special events:", error);
//     }
//   };
  
//   const fetchPublicHolidays = async () => {
//     try {
//       const apiKey = "s2BdzSlFREJFPCjXWWFKMBRWBZXDbfJo"; // Replace with your Calendarific API key
//       const year = new Date().getFullYear();
//       const countries = ["KE", "TZ"];
//       const holidayRequests = countries.map((country) =>
//         axios.get(`https://calendarific.com/api/v2/holidays`, {
//           params: {
//             api_key: apiKey,
//             country,
//             year,
//             type: "national",
//           },
//         })
//       );
//       const responses = await Promise.all(holidayRequests);
//       const holidays = responses.flatMap(
//         (response) => response.data.response.holidays
//       );
  
//       console.log("Public Holidays Data:", holidays); // Log data
  
//       const currentMonth = new Date().getMonth() + 1;
//       const filteredHolidays = holidays.filter((holiday) => {
//         const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
//         return holidayMonth === currentMonth;
//       });
//       setPublicHolidays(filteredHolidays);
//     } catch (error) {
//       console.error("Error fetching public holidays:", error);
//     }
//   };
  

//   const handleAddSpecialEvent = async () => {
//     const authToken = localStorage.getItem("authToken");

//     if (occasion && reminder && selectedDate && duration && priority) {
//       try {
//         const response = await apiClient.post(
//           "/reminders",
//           {
//             reminder: {
//               title: occasion,
//               description: reminder,
//               due_date: selectedDate.toISOString(), // Format date to ISO string
//               is_special_event: true,
//               occasion,
//               duration: duration,
//               priority: priority,
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         if (typeof addSpecialEvent === 'function') {
//           addSpecialEvent(response.data);
//         } else {
//           console.error("addSpecialEvent is not a function");
//         }
//         setSpecialEventsState([...specialEvents, response.data]);
//         setOccasion("");
//         setReminder("");
//         setSelectedDate(new Date()); // Reset date picker
//         setDuration("");
//         setPriority("Medium");
//         setNotification("Special event added successfully!");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000);
//       } catch (error) {
//         console.error("Error adding special event:", error);
//         setNotification("Error adding special event. Please try again.");
//         setTimeout(() => {
//           setNotification("");
//         }, 3000);
//       }
//     } else {
//       console.error("All fields including date are required");
//     }
//   };

//   const handleEventDrop = async (info) => {
//     const authToken = localStorage.getItem("authToken");
//     const eventId = info.event.id;
//     const newDate = info.event.startStr;

//     try {
//       await apiClient.put(
//         `/reminders/${eventId}`,
//         {
//           reminder: {
//             due_date: newDate,
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             Accept: "application/json",
//           },
//         }
//       );
//       fetchSpecialEvents(); // Refresh events after update
//       setNotification("Event date updated successfully!");
//       setTimeout(() => {
//         setNotification("");
//       }, 3000);
//     } catch (error) {
//       console.error("Error updating event date:", error);
//       setNotification("Error updating event date. Please try again.");
//       setTimeout(() => {
//         setNotification("");
//       }, 3000);
//     }
//   };

//   const formatDate = (date) => {
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };

//   const calculateCountdown = (date) => {
//     const now = new Date();
//     const differenceInTime = date.getTime() - now.getTime();
//     const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
//     return differenceInDays > 0 ? `${differenceInDays} days` : "Today";
//   };

//   const events = [
//     ...specialEvents.map((event) => ({
//       id: event.id,
//       title: `${event.occasion} - ${event.description}`,
//       date: event.due_date.split("T")[0], // Format date to YYYY-MM-DD
//       color:
//         event.priority === "High"
//           ? "red"
//           : event.priority === "Medium"
//           ? "orange"
//           : "green",
//     })),
//     ...publicHolidays.map((holiday) => ({
//       title: `${holiday.name} (${holiday.country.name})`,
//       date: holiday.date.iso.split("T")[0], // Format date to YYYY-MM-DD
//       color: "blue",
//     })),
//   ];

//   return (
//     <div className="mt-8 flex flex-col md:flex-row gap-4">
//       {/* Calendar */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 overflow-hidden">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Events Calendar
//         </h2>
//         <div className="relative w-full">
//           <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events}
//             selectable={true}
//             dateClick={(info) => setSelectedDate(info.dateStr)}
//             eventDrop={handleEventDrop} // Handle event drop
//             className="w-full"
//           />
//         </div>
//       </div>

//       {/* Special Occasions */}
//       <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 overflow-hidden">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Special Occasions
//         </h2>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Occasion
//           </label>
//           <input
//             type="text"
//             value={occasion}
//             onChange={(e) => setOccasion(e.target.value)}
//             className="border rounded-lg py-2 px-3 w-full"
//             placeholder="Enter occasion"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Reminder
//           </label>
//           <input
//             type="text"
//             value={reminder}
//             onChange={(e) => setReminder(e.target.value)}
//             className="border rounded-lg py-2 px-3 w-full"
//             placeholder="Enter reminder"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Date
//           </label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             className="border rounded-lg py-2 px-3 w-full"
//             dateFormat="MM/dd/yyyy"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Duration
//           </label>
//           <input
//             type="text"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             className="border rounded-lg py-2 px-3 w-full"
//             placeholder="Enter duration"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Priority
//           </label>
//           <select
//             value={priority}
//             onChange={(e) => setPriority(e.target.value)}
//             className="border rounded-lg py-2 px-3 w-full"
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//         <button
//           onClick={handleAddSpecialEvent}
//           className="bg-blue-500 text-white py-2 px-4 rounded-lg"
//         >
//           Add Special Event
//         </button>
//         {notification && (
//           <p className="mt-4 text-center text-red-500">{notification}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// SpecialEvents.propTypes = {
//   addSpecialEvent: PropTypes.func.isRequired,
//   setSpecialEvents: PropTypes.func.isRequired,
// };

// export default SpecialEvents;

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import apiClient from "../services/apiService"; // Import your apiClient
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';

const SpecialEvents = ({ addSpecialEvent, setSpecialEvents }) => {
  const [occasion, setOccasion] = useState("");
  const [reminder, setReminder] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [specialEvents, setSpecialEventsState] = useState([]);
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchPublicHolidays();
    fetchSpecialEvents();
  }, []);

  const fetchSpecialEvents = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await apiClient.get("/reminders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const specialEventsData = response.data.filter(
        (event) => event.is_special_event
      );

      console.log("Special Events Data:", specialEventsData); // Log data

      setSpecialEventsState(specialEventsData);
    } catch (error) {
      console.error("Error fetching special events:", error);
    }
  };

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

      console.log("Public Holidays Data:", holidays); // Log data

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

  const handleAddSpecialEvent = async () => {
    const authToken = localStorage.getItem("authToken");

    if (occasion && reminder && selectedDate && duration && priority) {
      try {
        const response = await apiClient.post(
          "/reminders",
          {
            reminder: {
              title: occasion,
              description: reminder,
              due_date: selectedDate.toISOString(), // Format date to ISO string
              is_special_event: true,
              occasion,
              duration: duration,
              priority: priority,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
          }
        );
        if (typeof addSpecialEvent === 'function') {
          addSpecialEvent(response.data);
        } else {
          console.error("addSpecialEvent is not a function");
        }
        setSpecialEventsState([...specialEvents, response.data]);
        setOccasion("");
        setReminder("");
        setSelectedDate(new Date()); // Reset date picker
        setDuration("");
        setPriority("Medium");
        setNotification("Special event added successfully!");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      } catch (error) {
        console.error("Error adding special event:", error);
        setNotification("Error adding special event. Please try again.");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    } else {
      console.error("All fields including date are required");
    }
  };

  const handleEventDrop = async (info) => {
    const authToken = localStorage.getItem("authToken");
    const eventId = info.event.id;
    const newDate = info.event.startStr;

    try {
      await apiClient.put(
        `/reminders/${eventId}`,
        {
          reminder: {
            due_date: newDate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
      fetchSpecialEvents(); // Refresh events after update
      setNotification("Event date updated successfully!");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (error) {
      console.error("Error updating event date:", error);
      setNotification("Error updating event date. Please try again.");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  };

  const events = [
    ...specialEvents.map((event) => ({
      id: event.id,
      title: `${event.occasion} - ${event.description}`,
      date: event.due_date.split("T")[0], // Format date to YYYY-MM-DD
      color:
        event.priority === "High"
          ? "red"
          : event.priority === "Medium"
          ? "orange"
          : "green",
    })),
    ...publicHolidays.map((holiday) => ({
      title: `${holiday.name} (${holiday.country.name})`,
      date: holiday.date.iso.split("T")[0], // Format date to YYYY-MM-DD
      color: "blue",
    })),
  ];

  // Helper function to format date to a readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-4">
      {/* Calendar */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800 font-sans">
          Special Events Calendar
        </h2>
        <div className="relative w-full">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={true}
            dateClick={(info) => setSelectedDate(info.dateStr)}
            eventDrop={handleEventDrop} // Handle event drop
            editable={true} // Allow editing of events
            droppable={true} // Allow events to be dragged and dropped
            className="w-full"
            contentHeight="auto" // Ensure calendar fits its container
          />
        </div>
      </div>

      {/* Special Occasions */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800 font-sans">
          Add Special Occasions
        </h2>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 font-sans">
            Occasion
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="border rounded-lg py-3 px-4 w-full border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter occasion"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 font-sans">
            Reminder
          </label>
          <input
            type="text"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="border rounded-lg py-3 px-4 w-full border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter reminder"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 font-sans">
            Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded-lg py-3 px-4 w-full border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 font-sans">
            Duration
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border rounded-lg py-3 px-4 w-full border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter duration"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 font-sans">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-lg py-3 px-4 w-full border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="text-center">
          <button
            onClick={handleAddSpecialEvent}
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          >
            Add Event
          </button>
        </div>
        {notification && (
          <div
            className={`mt-4 p-4 rounded-lg text-white ${
              notification.includes("Error")
                ? "bg-red-600"
                : "bg-green-600"
            } font-sans`}
          >
            {notification}
          </div>
        )}
      </div>

      {/* Display Events and Holidays */}
      <div className="w-full mt-6 bg-light-purple-100 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800 font-sans">
          Special Events and Public Holidays
        </h2>
        <div className="bg-light-purple-200 p-4 rounded-lg mb-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 font-sans">Public Holidays</h3>
          <ul>
            {publicHolidays.length > 0 ? (
              publicHolidays.map((holiday) => (
                <li key={holiday.date.iso} className="mb-2 font-sans">
                  <span className="font-bold text-purple-700">
                    {holiday.name}:
                  </span>{" "}
                  {formatDate(holiday.date.iso)}
                </li>
              ))
            ) : (
              <p>No public holidays for this month.</p>
            )}
          </ul>
        </div>
        <div className="bg-light-purple-200 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 font-sans">Special Events</h3>
          <ul>
            {specialEvents.length > 0 ? (
              specialEvents.map((event) => (
                <li key={event.id} className="mb-2 font-sans">
                  <span className="font-bold text-purple-700">
                    {event.occasion}:
                  </span>{" "}
                  {formatDate(event.due_date)} - {event.description}
                </li>
              ))
            ) : (
              <p>No special events for this month.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

SpecialEvents.propTypes = {
  addSpecialEvent: PropTypes.func,
  setSpecialEvents: PropTypes.func,
};

export default SpecialEvents;
