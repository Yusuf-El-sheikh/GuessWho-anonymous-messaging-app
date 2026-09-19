import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, ()=>{
    console.log("server running on port 3000\n\nhttp://localhost:3000");
});