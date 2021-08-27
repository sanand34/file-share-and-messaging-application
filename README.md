# File-Share-And-Messaging

This is a website for sharing media,files and messages in groups or to individuals using pusher-js and rest api (without the support of any database).
Demo Link : https://pusher-message.web.app/

# Video Demo(click the image below 👇👇👇to see the video demo)

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/cdR-3XJroJ0/0.jpg)](https://www.youtube.com/watch?v=cdR-3XJroJ0)

# Frontend setup

Use the package manager npm

```
cd frontend && npm install

```
# Backend setup

Use the package manager npm

```
cd backend && npm install

```
# Frontend usage

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

![Alt text](demo1.png?raw=true "Title")

* Enter your name
* Press the generate or check ID button to create an ID
 
![Alt text](demo2.png?raw=true "Title")

* Share this id to people with whom you want to communicate and send media files

# Backend usage

Use the package manager npm

```
node index.js
```





### UUID

A universally unique identifier ( **UUID** ) is a 128-bit number used to identify information in computer systems.We are using uuid to make unique groups with multiple members who can exchange data among themselves

**************************


### Frontend Architecture

The frontend is completely made in react and is hosted on firebase hostings.

Extra Libraries we used:

*Axios: **Axios** is a popular, promise-based HTTP client that sports an easy-to-use API and can be used in both the browser and Node. js. Making HTTP requests to fetch or save data

*FS:js **File System**. **Node**. js includes **fs** module to access physical **file system**. The **fs** module is responsible for all the asynchronous or synchronous file I/O operations.


### Working of Frontend

Like as shown in the diagram we communicate with other servers running the same frontend using pusher.Pusher Connections are made active on all the browsers when the site is opened we send information to pusher and pusher sends the data to these connections demanding for that call.


### Pusher Connection
```
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
```

We return unbind_all() and unsubscribe() function as a cleanup function to avoid multiple connections in the same channel.

-->Channel1 is for to listen to new messages

-->Channel2 is for to listen to new files uploaded


### Frontend file upload
```
upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
```

File is being uploaded on the backend Server In the /uploads directory in the Backend using Rest api.


### Frontend file download
```
 UploadService.upload(curFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.message);
        return UploadService.getFiles();
      })
      .then(() => {
        axios
          .post(`http://localhost:8080/fileshare/${id}`, {
            name: curFile.name,
          })
          .then(() => console.log(`Sent`))
          .catch(function (error) {
            console.log(error);
          });
      })
```

This is a javascript promise where when the file is uploaded ,we do a post request on the api to send name of the file and group Uuid to pusher so that all the pusher connections get to know if the file from the required uuid is to be taken into their group with same uuid and their link to be uploaded for download.


### Frontend Messaging system
```
axios.post(`http://localhost:8080/message/${id}`, {
         name: name,
         message: typed,
         date: getDate(),
})
```

The message service is similar to the file upload system.Here User name,message and current time along with the group’s uuid is sent to the pusher and made available for the connections with same group uuid to get the data


### Backend Architecture

The backend is developed in NodeJS and the rest api is created using ExpressJS .PusherJS is used for sending data to the active pusher connections.


### API Endpoints
```
router.post("/message/:room",message)
    router.post("/upload",upload)
    router.get("/files",getListFiles)
    router.get("/files/:name",download)
    router.post("/fileshare/:room",fileshare)
    router.get("/",welcome)
```
Various endpoints are created for the Api to perform get and post requests The names suggest their Functionalities and their code Can be seen in the git repository


### File storage in the backend
```
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});
```

For storing file we use multer middleware Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency. All the incoming files are getting Stored in the /uploads directory


### Picture


# THANK YOU




