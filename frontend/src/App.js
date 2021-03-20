/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import axios from "axios";
import "./App.css";
import "./app.scss";
import Pusher from "pusher-js";
import Chat from "./Chat.js";
import UploadFiles from "./components/upload-files";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const [message1, setMessage1] = useState([]);
  const [message2, setMessage2] = useState([]);
  const [fullMessage, setFullMessage] = useState([]);
  const [fullFile, setFullFile] = useState([]);

  const [typed, setTyped] = useState();

  useEffect(() => {
    const pusher = new Pusher("aa24dbbe8e22cfcef8a3", {
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
  useEffect(() => {
    setFullMessage([...fullMessage, ...message1]);
  }, [message1]);
  useEffect(() => {
    setFullFile([...fullFile, ...message2]);
  }, [message2]);
  const checkID = (id) => {
    let check = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(
      id
    );

    return check;
  };
  const getDate = () => {
    let d = new Date();
    let ank = d.toLocaleString();
    let currentDate = /[0-9]*:[0-9]*:[0-9]*/g.exec(JSON.stringify(ank));
    let day = /[A-za-z]+ [A-za-z]+ [0-9]+/g.exec(JSON.stringify(ank));
    let year = /[0-9][0-9][0-9][0-9]/g.exec(JSON.stringify(ank));
    return `${day} ${year} ${currentDate}`;
  };

  return (
    <div className="app">
      <UploadFiles files={fullFile} id={id} />
      <div className="app_input">
        <div className="app_input_message">
          <input
            className="input"
            id={"message"}
            placeholder="Message"
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
            }}
          />
          <button
            className="button"
            type="submit"
            onClick={() => {
              console.log(id);

              if (id == "") {
                setId("Set Id first");
              } else {
                if (!checkID(id)) {
                  setId("Invalid");
                  console.log("Not Sent");
                } else {
                  axios
                    .post(
                      `https://radiant-cove-97073.herokuapp.com/message/${id}`,
                      {
                        name: name,
                        message: typed,
                        date: getDate(),
                      }
                    )
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
          className="button"
          style={{ padding: "20px" }}
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
        <div>
          {fullMessage.map((message) => (
            <Chat key={message.date} message={message} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
