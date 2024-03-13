const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());
mongoose
.connect(
    "mongodb+srv://dineshstdy1:Asdfg123@cluster0.gygcfrn.mongodb.net/image?retryWrites=true&w=majority&appName=Cluster0"
  ).then(() => {
    console.log("connected to the datatbase");
  });
  const schema = new mongoose.Schema({
    imgname: String,
  });
  const userimg = mongoose.model("Usersimg", schema);

  //testing the routes
// app.get("/", async (req, res) => {
//   res.send("<h1>this is the heading tag</h1>");
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});
const upload= multer({
  storage:storage
})
app.post('/upload',upload.single('file'),(req,res)=>{
  console.log(req.file.filename)
  userimg.create({ imgname: req.file.fieldname })
    .then((createdUserImg) => {
      console.log(createdUserImg);
      res.status(201).json(createdUserImg); 
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})






//testing the data base
// const user = mongoose.model("users", schema);
// app.post("/log", async (req, res) => {
//   try {
//     const data = new user({
//       name: req.body.name,
//     });
//     await data.save();
//     res.json({ message: "Data saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
app.listen("5000", () => {
  console.log("listining on the port 5k");
});
