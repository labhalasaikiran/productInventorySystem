const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./config/db");

app.use(cors());
app.use(express.json());
app.get("/", (req,res) =>{
    res.json({
        message: "Hello from server!"
    });
})
const port =  5000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})