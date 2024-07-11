
import React, { useEffect } from "react";
import consumer from "../actionCableConsumer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = ({ currentUser }) => {
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const subscription = consumer.subscriptions.create(
        { channel: "NotificationsChannel", user_id: currentUser.id },
        {
          received(data) {
            console.log("Received notification:", data);
            if (data.message) {
              toast.info(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser]);

  return <ToastContainer />;
};

export default Notifications;
