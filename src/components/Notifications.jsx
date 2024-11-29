import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  // fake notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, user: "Alice", message: "wants to join your group" },
    { id: 2, user: "Bob", message: "wants to join your group" },
    { id: 3, user: "Charlie", message: "wants to join your group" },
  ]);

  // handle action on notification
  const handleAction = (id, action) => {
    alert(`${action} request from user with ID: ${id}`);
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <div className="notifications-app-container">
      <h1>Notifications</h1>
      <div className="notifications-card-container">
        {notifications.map((notif) => (
          <div className="notifications-card" key={notif.id}>
            <p>
              <strong>{notif.user}</strong> {notif.message}
            </p>
            <div className="notifications-button-group">
              <button onClick={() => handleAction(notif.id, "Accepted")}>
                Accept
              </button>
              <button onClick={() => handleAction(notif.id, "Rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
