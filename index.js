const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./connection");
const { userRouter } = require("./Controller/User.Routes");

app.use(express.json());
app.use("/user", userRouter);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Finance App backend");
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(
      `Connected to Database Successfully, server is running at port ${process.env.PORT}`
    );
  } catch (error) {
    console.log("Cannot Connect to Datatbase");
  }
});