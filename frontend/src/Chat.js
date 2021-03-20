import React from "react";
import "./App.css";
function Chat({ message, name }) {
  return (
    <div
      style={{
        marginLeft: `${name === message?.name ? "55vw" : "10px"}`,
      }}
      className="displayMessage"
    >
      <div
        style={{
          backgroundColor: `${
            name === message?.name ? "rgb(98, 142, 98)" : "rgb(75, 144, 174)"
          }`,
        }}
        className="displayMessage_message"
      >
        {message?.message}
      </div>
      <div className="displayMessage_name">---{message?.name}</div>
      <div className="displayMessage_date">---{message?.date}</div>
    </div>
  );
}

export default Chat;
