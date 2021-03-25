/*eslint-disable*/
import React, { useEffect, useState, useRef } from "react";
import { v4 } from "uuid";
import axios from "axios";
import "./App.css";
import Pusher from "pusher-js";
import Chat from "./Chat.js";
import UploadFiles from "./components/upload-files";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const messagesEndRef = useRef(null);
  const [message1, setMessage1] = useState([]);
  const [message2, setMessage2] = useState([]);
  const [fullMessage, setFullMessage] = useState([]);
  const [fullFile, setFullFile] = useState([]);

  const [typed, setTyped] = useState();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //initialising pusher listeners
  useEffect(() => {
    const pusher = new Pusher("Get ID", {
      cluster: "ap2",
    });
    const channel1 = pusher.subscribe("messages");
    const channel2 = pusher.subscribe("fileshare");
    channel1.bind(id, (data) => {
      setMessage1([data]);
    });
    channel2.bind(id, (data) => {
      console.log(data);
      setMessage2([data]);
    });

    return () => {
      channel1.unbind_all();
      channel1.unsubscribe();
      channel2.unbind_all();
      channel2.unsubscribe();
    };
  }, [id]);

  //merging new message with old message
  useEffect(() => {
    setFullMessage([...fullMessage, ...message1]);
    scrollToBottom();
  }, [message1]);

  //merging new file links with old file links
  useEffect(() => {
    setFullFile([...fullFile, ...message2]);
  }, [message2]);

  //function to check id syntax
  const checkID = (id) => {
    let check = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(
      id
    );

    return check;
  };

  //function to get present date
  const getDate = () => {
    let d = new Date();
    let ank = d.toLocaleString();
    let currentDate = /[0-9]*:[0-9]*:[0-9]*/g.exec(JSON.stringify(ank));
    return `${currentDate}`;
  };

  return (
    <div className="app">
      <div className="app_body">
        <div className="sidebar">
          <UploadFiles files={fullFile} id={id} />
        </div>
        <div className="main">
          <div className="app_input">
            <div className="app_input_message">
              <form>
                <input
                  className="input"
                  type="text"
                  id={"message"}
                  placeholder="Message"
                  value={typed}
                  onChange={(e) => {
                    setTyped(e.target.value);
                  }}
                />
                <button
                  style={{ display: "none" }}
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(id);

                    if (id == "") {
                      setId("Set Id first");
                    } else {
                      if (!checkID(id)) {
                        setId("Invalid");
                        console.log("Not Sent");
                      } else {
                        axios
                          .post(`http://localhost:8080/message/${id}`, {
                            name: name,
                            message: typed,
                            date: getDate(),
                          })
                          .then(() => console.log(`Sent`))
                          .catch(function (error) {
                            console.log(error);
                          });
                      }
                    }

                    setTyped("");
                  }}
                >
                  Send
                </button>
              </form>
            </div>
            <div className="app_info">
              <input
                className="input"
                id="name"
                placeholder={"Name"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                className="input"
                id="id"
                placeholder={"Id"}
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>

            <button
              className="btn btn-success"
              style={{
                padding: "20px",
                backgroundColor: "rgb(79,168,70)",
                color: "white",
              }}
              onClick={() => {
                if (id == "" || id == "Invalid") {
                  setId(v4());
                  console.log(id);
                } else {
                  if (!checkID(id)) {
                    setId("Invalid");
                  }
                }

                setFullFile([]);
              }}
            >
              Generate or check ID
            </button>
          </div>
          <div className="display">
            {fullMessage.map((message) => (
              <Chat key={message.date} message={message} name={name} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
