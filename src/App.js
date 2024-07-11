
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import CreateTask from "./components/CreateTask";
// import Calendar from "./components/Calendar";
// import Login from "./components/Login";
// import Task from "./components/Task";
// import SpecialEvents from "./components/SpecialEvents";
// import UserProfile from "./components/UserProfile";
// import Notification from "./components/Notification"; // Import the Notification component
// import Footer from "./components/Footer";
// import FriendSearch from "./components/Friend";
// import Invitations from "./components/Invitations";
// import Loader from "./components/Loader";
// import { ActionCableProvider } from '@thrash-industries/react-actioncable-provider';


// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [invitations, setInvitations] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const timezone = "Africa/Nairobi"; // Example timezone - replace with your desired timezone

//   // Set the timezone for all Date objects
//   Date.prototype.toLocaleString = function () {
//     return new Intl.DateTimeFormat(undefined, {
//       timeZone: timezone,
//       /* other options */
//     }).format(this);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const storedToken = localStorage.getItem("authToken");
//       const isLoggedIn = !!storedToken;
      
//       if (isLoggedIn) {
//         try {
//           console.log("Fetching user data...");
//           const response = await axios.get(
//             "http://localhost:3001/auth/validate_token",
//             {
//               headers: {
//                 Authorization: `Bearer ${storedToken}`
//               }
//             }
//           );
//           console.log("User data fetched successfully:", response.data);
//           const userData = response.data.data;
//           setCurrentUser(userData);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);
//   useEffect(() => {
//     const fetchInvitations = async () => {
//       try {
//         const authToken = localStorage.getItem("authToken");
//         const response = await axios.get("http://localhost:3001/invitations", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setInvitations(response.data);
//       } catch (error) {
//         console.error("Error fetching invitations:", error);
//       }
//     };

//     fetchInvitations();
//   }, []);
//   const invitationsCount = invitations.length;


//   const handleLogout = () => {
//     // Clear user data and token from localStorage
//     localStorage.removeItem("authToken");
//     setCurrentUser(null);
//   };

//   return (
//     <ActionCableProvider url="ws://localhost:3001/cable">

//     <Router>
//       <Navbar currentUser={currentUser} onLogout={handleLogout} invitationsCount={invitationsCount} />
//       <Notification currentUser={currentUser} /> {/* Pass currentUser here */}

//       <Routes>
//         <Route  path="/" element={<Home currentUser={currentUser} />} />
//         <Route path="/create/*" element={currentUser ? <CreateTask /> : <Navigate to="/login" />} />
//         <Route path="/calendar/*" element={<Calendar />} />
//         <Route path="/login/*" element={<Login />} />
//         <Route path="/tasks" element={currentUser ? <Task /> : <Navigate to="/login" />} />
//         <Route path="/special" element={<SpecialEvents />} />
//         <Route path="/profile" element={<UserProfile userData={currentUser} onLogout={handleLogout} />} />
//         <Route path="/friend" element={<FriendSearch userData={currentUser}/>} />
//         <Route path="/invitations" element={<Invitations userData={currentUser}  currentUser={currentUser} />}/>
//         <Route path="/loader" element={<Loader/> }/>
//       </Routes>
//       <Footer/>
//     </Router>
//     </ActionCableProvider>

//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import CreateTask from "./components/CreateTask";
// import Calendar from "./components/Calendar";
// import Login from "./components/Login";
// import Task from "./components/Task";
// import SpecialEvents from "./components/SpecialEvents";
// import UserProfile from "./components/UserProfile";
// import Notification from "./components/Notification";
// import Footer from "./components/Footer";
// import FriendSearch from "./components/Friend";
// import Invitations from "./components/Invitations";
// import Loader from "./components/Loader";
// import NotificationsChannel from './components/NotificationsChannel';
// import { ActionCableProvider } from '@thrash-industries/react-actioncable-provider';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [invitations, setInvitations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const timezone = "Africa/Nairobi";

//   // Set the timezone for all Date objects
//   Date.prototype.toLocaleString = function () {
//     return new Intl.DateTimeFormat(undefined, {
//       timeZone: timezone,
//       /* other options */
//     }).format(this);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const storedToken = localStorage.getItem("authToken");
//       const isLoggedIn = !!storedToken;

//       if (isLoggedIn) {
//         try {
//           const response = await axios.get(
//             "http://localhost:3001/auth/validate_token",
//             {
//               headers: {
//                 Authorization: `Bearer ${storedToken}`
//               }
//             }
//           );
//           const userData = response.data.data;
//           setCurrentUser(userData);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchInvitations = async () => {
//       try {
//         const authToken = localStorage.getItem("authToken");
//         const response = await axios.get("http://localhost:3001/invitations", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setInvitations(response.data);
//       } catch (error) {
//         console.error("Error fetching invitations:", error);
//       }
//     };

//     fetchInvitations();
//   }, []);

//   const invitationsCount = invitations.length;

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     setCurrentUser(null);
//   };

//   const handleNotificationReceived = (message) => {
//     console.log('Notification received:', message);
//     // Optionally update UI or trigger notification here
//   };

//   return (
//     <ActionCableProvider url="ws://localhost:3001/cable">
//       <Router>
//         <Navbar currentUser={currentUser} onLogout={handleLogout} invitationsCount={invitationsCount} />
//         <Notification currentUser={currentUser} />
//         <NotificationsChannel currentUser={currentUser} onNotificationReceived={handleNotificationReceived} />
//         <Routes>
//           <Route path="/" element={<Home currentUser={currentUser} />} />
//           <Route path="/create/*" element={currentUser ? <CreateTask /> : <Navigate to="/login" />} />
//           <Route path="/calendar/*" element={<Calendar />} />
//           <Route path="/login/*" element={<Login />} />
//           <Route path="/tasks" element={currentUser ? <Task /> : <Navigate to="/login" />} />
//           <Route path="/special" element={<SpecialEvents />} />
//           <Route path="/profile" element={<UserProfile userData={currentUser} onLogout={handleLogout} />} />
//           <Route path="/friend" element={<FriendSearch userData={currentUser} />} />
//           <Route path="/invitations" element={<Invitations userData={currentUser} currentUser={currentUser} />} />
//           <Route path="/loader" element={<Loader />} />
//         </Routes>
//         <Footer />
//       </Router>
//     </ActionCableProvider>
//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import CreateTask from "./components/CreateTask";
// import Calendar from "./components/Calendar";
// import Login from "./components/Login";
// import Task from "./components/Task";
// import SpecialEvents from "./components/SpecialEvents";
// import UserProfile from "./components/UserProfile";
// import Notification from "./components/Notification";
// import Footer from "./components/Footer";
// import FriendSearch from "./components/Friend";
// import Invitations from "./components/Invitations";
// import Loader from "./components/Loader";
// import { ActionCableProvider } from '@thrash-industries/react-actioncable-provider';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [invitations, setInvitations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [authToken, setAuthToken] = useState(null);
//   const timezone = "Africa/Nairobi";

//   // Set the timezone for all Date objects
//   Date.prototype.toLocaleString = function () {
//     return new Intl.DateTimeFormat(undefined, {
//       timeZone: timezone,
//       /* other options */
//     }).format(this);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const storedToken = localStorage.getItem("authToken");
//       const isLoggedIn = !!storedToken;

//       if (isLoggedIn) {
//         try {
//           const response = await axios.get(
//             "http://localhost:3001/auth/validate_token",
//             {
//               headers: {
//                 Authorization: `Bearer ${storedToken}`
//               }
//             }
//           );
//           const userData = response.data.data;
//           setCurrentUser(userData);
//           setAuthToken(storedToken);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchInvitations = async () => {
//       try {
//         const authToken = localStorage.getItem("authToken");
//         const response = await axios.get("http://localhost:3001/invitations", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setInvitations(response.data);
//       } catch (error) {
//         console.error("Error fetching invitations:", error);
//       }
//     };

//     fetchInvitations();
//   }, []);

//   const invitationsCount = invitations.length;

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     setCurrentUser(null);
//   };

//   const handleNotificationReceived = (message) => {
//     console.log('Notification received:', message);
//     // Optionally update UI or trigger notification here
//   };

//   return (
//     <ActionCableProvider url="ws://localhost:3001/cable">
//       <Router>
//         <Navbar currentUser={currentUser} onLogout={handleLogout} invitationsCount={invitationsCount} />
//         <Notification currentUser={currentUser} authToken={authToken} />
//         {loading ? (
//           <Loader />
//         ) : (
//           <Routes>
//             <Route path="/" element={<Home currentUser={currentUser} />} />
//             <Route path="/create/*" element={currentUser ? <CreateTask /> : <Navigate to="/login" />} />
//             <Route path="/calendar/*" element={<Calendar />} />
//             <Route path="/login/*" element={<Login />} />
//             <Route path="/tasks" element={currentUser ? <Task /> : <Navigate to="/login" />} />
//             <Route path="/special" element={<SpecialEvents />} />
//             <Route path="/profile" element={<UserProfile userData={currentUser} onLogout={handleLogout} />} />
//             <Route path="/friend" element={<FriendSearch userData={currentUser} />} />
//             <Route path="/invitations" element={<Invitations userData={currentUser} currentUser={currentUser} />} />
//             <Route path="/loader" element={<Loader />} />
//           </Routes>
//         )}
//         <Footer />
//       </Router>
//     </ActionCableProvider>
//   );
// }

// export default App;
// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CreateTask from "./components/CreateTask";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import Task from "./components/Task";
import SpecialEvents from "./components/SpecialEvents";
import UserProfile from "./components/UserProfile";
import Notifications from "./components/Notification";
import Footer from "./components/Footer";
import FriendSearch from "./components/Friend";
import Invitations from "./components/Invitations";
import Loader from "./components/Loader";
import { ActionCableProvider } from '@thrash-industries/react-actioncable-provider';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const timezone = "Africa/Nairobi";

  // Set the timezone for all Date objects
  Date.prototype.toLocaleString = function () {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      /* other options */
    }).format(this);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");
      const isLoggedIn = !!storedToken;

      if (isLoggedIn) {
        try {
          const response = await axios.get(
            "http://localhost:3001/auth/validate_token",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            }
          );
          const userData = response.data.data;
          setCurrentUser(userData);
          setAuthToken(storedToken);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3001/invitations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setInvitations(response.data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };

    fetchInvitations();
  }, []);

  const invitationsCount = invitations.length;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
  };

  return (
    <ActionCableProvider url="ws://localhost:3001/cable">
      <Router>
        <Navbar currentUser={currentUser} onLogout={handleLogout} invitationsCount={invitationsCount} />
        <Notifications currentUser={currentUser} /> {/* Updated */}
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/create/*" element={currentUser ? <CreateTask /> : <Navigate to="/login" />} />
            <Route path="/calendar/*" element={<Calendar />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/tasks" element={currentUser ? <Task /> : <Navigate to="/login" />} />
            <Route path="/special" element={<SpecialEvents />} />
            <Route path="/profile" element={<UserProfile userData={currentUser} onLogout={handleLogout} />} />
            <Route path="/friend" element={<FriendSearch userData={currentUser} />} />
            <Route path="/invitations" element={<Invitations userData={currentUser} currentUser={currentUser} />} />
            <Route path="/loader" element={<Loader />} />
          </Routes>
        )}
        <Footer />
      </Router>
    </ActionCableProvider>
  );
}

export default App;
