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
  const [id, setId] = useState<string | null>(null);
  const [pitch, setPitch] = useState(0);
  const [tempo, setTempo] = useState(1);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // const baseURL = "https://api-yourtune.onrender.com";
  const baseURL = "http://localhost:3000";

  const onUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("mp3", file, file.name);
      try {
        const response = await axios.post(`${baseURL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setId(response.data.id);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("No file selected for upload");
    }
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangePitchAndTempo = async () => {
    setIsLoading(true);
    const response = await axios.post(`${baseURL}/change/${id}`, {
      pitch,
      tempo,
    });
    if (response.data && response.data.id) {
      console.log(`Changed pitch and tempo for ${response.data.id}`);
      setId(response.data.id);

      if (response.status === 200) {
        if (audioRef.current) {
          audioRef.current.load();
        }
      }
      setIsLoading(false);
    }
  };

  const onDownload = () => {
    window.location.href = `${baseURL}/download/${id}`;
  };

  return (
    <div>
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
            <button type="submit" className="btn">
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
            <div>
              {/* <input type="file" onChange={onFileChange} />
              <button onClick={onUpload}>Upload</button> */}
              <div className="font-[sans-serif] max-w-md mx-auto mt-16 flex justify-center items-center flex-col">
                <input
                  type="file"
                  onChange={onFileChange}
                  className="w-full text-gray-400 text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                />
                <button onClick={onUpload} className="btn mt-4 items-center">
                  Upload
                </button>
              </div>
            </div>

            <div className="flex justify-center text-black">
              {/* <input
                type="text"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                placeholder="Pitch"
                step={100}
                min={-2400}
                max={2400}
              /> */}

              {/* <input
                type="number"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                placeholder="Tempo"
                step={0.05}
                min={0.05}
                max={4}
              /> */}
            </div>

            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <button onClick={onChangePitchAndTempo}>
                  Change Pitch and Tempo
                </button>
                <div>
                  <audio
                    ref={audioRef}
                    controls
                    src={`${baseURL}/stream/${id}`}
                  />
                  <button onClick={onDownload}>Download</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
