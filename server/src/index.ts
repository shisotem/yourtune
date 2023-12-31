import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

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
app.post("/upload", upload.single("mp3"), (req, res) => {
  if (!req.file) {
    res.status(400).send({ error: "No file uploaded" });
    return;
  }

  const id = uuidv4();
  fileMap.set(id, req.file.path);
  console.log(`id: ${id}, path: ${req.file.path}`);
  res.send({ id });
});

app.post("/change/:id", (req, res) => {
  const { pitch, speed } = req.body;
  const filePath = fileMap.get(req.params.id);
  const newFilePath = `${filePath}_changed.mp3`;
  exec(
    `sox ${filePath} ${newFilePath} pitch ${pitch} speed ${speed}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      fileMap.set(req.params.id, newFilePath);
      res.send({ id: req.params.id });

      scheduleFileDeletion(filePath, 60 * 30 * 1000);
    }
  );
});

app.get("/stream/:id", (req, res) => {
  const filePath = fileMap.get(req.params.id);
  const absolutePath = path.resolve(filePath);
  const readStream = fs.createReadStream(absolutePath);
  readStream.pipe(res);
});

app.get("/download/:id", (req, res) => {
  const filePath = fileMap.get(req.params.id);
  const absolutePath = path.resolve(filePath);
  const fileName = "yourtune.mp3";
  res.download(absolutePath, fileName);
});
