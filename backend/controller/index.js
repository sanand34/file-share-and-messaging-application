import pusher from "./pusher.js"
import uploadFile from "./middleware/upload.js"
import fs from "fs"
const port = process.env.PORT || 8000;
const baseUrl = `${port}/files/`;

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 10MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.map((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};



let message=(req, res) => {
    pusher.trigger("messages", req.params.room, {
      name: req.body.name,
      message: req.body.message,
      date: req.body.date,
    })}
let fileshare=(req, res) => {
    pusher.trigger("fileshare", req.params.room, {
      name: req.body.name,
    })}    


const welcome=(req,res)=>{
  res.send("Welcome,backend is developed by Sanchit Anand");
}    
export {message,upload,getListFiles,download,welcome,fileshare}    