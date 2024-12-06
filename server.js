const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

//connection
mongoose
  .connect(
    "mongodb+srv://officePc:Ewsl7PZcOLC4zFyT@cluster0.wn4j5.mongodb.net/Student"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const port = 4000;

const dataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  group: String,
});

const Data = mongoose.model("Data", dataSchema);

app.post("/data", async (req, res) => {
  try {
    const { name, age, group } = req.body;
    const myData = new Data({ name, age, group });
    await myData.save();
    res.status(201).json({ message: "my data saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving myData", error: err });
  }
});

app.get("/aggregate", async (req, res) => {
  try {
    const groupbyGroup = await Data.aggregate([
      { $group: { _id: "$group", count: { $sum: 1 } } },
    ]);

    const averageAge = await Data.aggregate([
      { $group: { _id: null, avgAge: { $avg: "$age" } } },
    ]);

    const sortedData = await Data.aggregate([{ $sort: { name: 1 } }]);
    console.log(sortedData);
    
    res.send({ groupbyGroup, averageAge, sortedData });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
