import React, { useState } from "react";
import UploadService from "../services/upload-files";
import axios from "axios";
function UploadFiles({ files, id }) {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  const upload = () => {
    let curFile = selectedFiles[0];
    setCurrentFile(curFile);
    setProgress(0);
    UploadService.upload(curFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.message);
        return UploadService.getFiles();
      })
      .then(() => {
        axios
          .post(`https://radiant-cove-97073.herokuapp.com/fileshare/${id}`, {
            name: curFile.name,
          })
          .then(() => console.log(`Sent`))
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(() => {
        setProgress(0);
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });
    setSelectedFiles(undefined);
  };

  return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <label className="btn btn-default">
        <input type="file" onChange={(e) => selectFile(e)} />
      </label>

      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={() => upload()}
      >
        Upload
      </button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      <div className="card"style={{height:"67vh",overflow: "scroll"}}>
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {files &&
            files.map((file) => (
              <li className="list-group-item">
                <a
                  href={
                    "https://radiant-cove-97073.herokuapp.com/files/" +
                    file.name
                  }
                >
                  {file.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default UploadFiles;
