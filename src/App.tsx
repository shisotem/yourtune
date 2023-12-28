import axios from "axios";
import { useRef, useState } from "react";
import { youtubeParser } from "./utils";

function App() {
  const inputUrlRef = useRef();
  const [urlResult, setUrlResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const youtubeID = youtubeParser(inputUrlRef.current.value);

    const options = {
      method: "GET",
      url: "https://youtube-mp3-download1.p.rapidapi.com/dl",
      headers: {
        "X-RapidAPI-Key": "37b9899413msh169dd9d49b4a5abp17c66ajsn3f0aa791fb09",
        "X-RapidAPI-Host": "youtube-mp3-download1.p.rapidapi.com",
      },
      params: {
        id: youtubeID,
      },
    };
    // axios
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

        <a href="" className="download-btn">
          Download MP3
        </a>
      </section>
    </div>
  );
}

export default App;
