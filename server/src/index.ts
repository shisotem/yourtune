import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

function scheduleFileDeletion(filePath: string, delay: number) {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    });
  }, delay);
}

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));

let fileMap = new Map();
let originalFileMap = new Map(); // Add this line to create a map for original files

app.post("/upload", upload.single("mp3"), (req, res) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
    return;
  }

  const id = uuidv4();
  fileMap.set(id, req.file.path);
  originalFileMap.set(id, req.file.path); // Add this line to save the original file path
  console.log(`id: ${id}, path: ${req.file.path}`);
  res.send({ id });
});

app.post("/change/:id", (req, res) => {
  const { pitch, tempo } = req.body;
  const originalFilePath = originalFileMap.get(req.params.id); // Get the original file path
  if (!originalFilePath) {
    res.status(404).send({ error: "File not found" });
    return;
  }
  const newFilePath = `${originalFilePath}_changed.mp3`;
  exec(
    `sox ${originalFilePath} ${newFilePath} pitch ${pitch} tempo ${tempo}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      fileMap.set(req.params.id, newFilePath); // Set the new file path to the map
      res.send({ id: req.params.id });

      scheduleFileDeletion(newFilePath, 60 * 30 * 1000); // Delete the changed file after 30 minutes
    }
  );
});

app.get("/stream/:id", (req, res) => {
  const filePath = fileMap.get(req.params.id);
  if (!filePath) {
    res.status(404).send({ error: "File not found" });
    return;
  }
  const absolutePath = path.resolve(filePath);
  const readStream = fs.createReadStream(absolutePath);
  readStream.pipe(res);
});

app.get("/download/:id", (req, res) => {
  const filePath = fileMap.get(req.params.id);
  if (!filePath) {
    res.status(404).send({ error: "File not found" });
    return;
  }
  const absolutePath = path.resolve(filePath);
  const fileName = "yourtune.mp3";
  res.download(absolutePath, fileName);
});
