import express from "express"
const router=express.Router()
import {message,upload,getListFiles,download,welcome,fileshare} from "../controller/index.js"
let routes=(app)=>{
    router.post("/message/:room",message)
    router.post("/upload",upload)
    router.get("/files",getListFiles)
    router.get("/files/:name",download)
    router.post("/fileshare/:room",fileshare)
    router.get("/",welcome)
    app.use(router)
}

export{routes}

