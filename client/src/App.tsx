import axios from "axios";
import { useRef, useState } from "react";
import { youtubeParser } from "./utils";

function App() {
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const [urlResult, setUrlResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputUrlRef.current) {
      const youtubeID = youtubeParser(inputUrlRef.current.value);
      const options = {
        method: "GET",
        url: "https://youtube-mp3-download1.p.rapidapi.com/dl",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
          "X-RapidAPI-Host": "youtube-mp3-download1.p.rapidapi.com",
        },
        params: {
          id: youtubeID,
        },
      };

      try {
        const res = await axios.request(options);
        setUrlResult(res.data.link);
      } catch (err) {
        console.error(err);
      }
      inputUrlRef.current.value = "";
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState(null);
  const [pitch, setPitch] = useState(0);
  const [speed, setSpeed] = useState(0);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("mp3", file, file.name);
      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setId(response.data.id);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("No file selected for upload");
    }
  };

  const onChangePitchAndSpeed = async () => {
    await axios.post(`http://localhost:3000/change/${id}`, { pitch, speed });
  };

  const onDownload = () => {
    window.location.href = `http://localhost:3000/download/${id}`;
  };

  return (
    <div className="app">
      <span className="logo">YourTune</span>

      <section className="content">
        <h1 className="content-title">YouTube to MP3, Simple!</h1>
        <p className="content-description">
          Transform YouTube videos into MP3 files in just a few clicks.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            ref={inputUrlRef}
            placeholder="Paste a YouTube video URL link..."
            className="form-input"
            type="text"
          />
          <button type="submit" className="form-button">
            Search
          </button>
        </form>

        {urlResult ? (
          <a
            target="_blank"
            rel="noreferrer"
            href={urlResult}
            className="download-btn"
          >
            Download MP3
          </a>
        ) : (
          ""
        )}
      </section>

      <section>
        <div>
          <input type="file" onChange={onFileChange} />
          <button onClick={onUpload}>Upload</button>
          <input
            type="number"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            placeholder="Pitch"
          />
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            placeholder="Speed"
          />
          <button onClick={onChangePitchAndSpeed}>
            Change Pitch and Speed
          </button>
          <audio controls src={`http://localhost:3000/stream/${id}`} />
          <button onClick={onDownload}>Download</button>
        </div>
      </section>
    </div>
  );
}

export default App;