import React from "react";
import "./App.css";
function Chat({ message, name }) {
  return (
    <div
    className={message?.name!==name?"chat__message":"chat__receiver"
    }
    >
      <div>
        {message?.message}
      </div>
      <div className="chat__name">{message?.name}</div>
      <div className="chat__timespace">{message?.date}</div>
    </div>
  );
}

export default Chat;
