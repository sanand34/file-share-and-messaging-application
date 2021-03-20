import axios from "axios";

export default axios.create({
  baseURL: "https://radiant-cove-97073.herokuapp.com/",
  headers: {
    "Content-type": "application/json",
  },
});
