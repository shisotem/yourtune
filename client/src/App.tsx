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
    <>
      <div className="app">
        <div className="flex justify-between items-center">
          <span className="logo">YourTune</span>
          <a
            href="https://github.com/shisotem/yourtune"
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            <img
              src="/github-mark-white.png"
              className="w-5 h-5 mt-4"
              alt="github mark"
            />
          </a>
        </div>

        <section className="content">
          <h1 className="content-title underline">YouTube to MP3, Simple!</h1>
          <p className="content-description">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-check inline-block w-6 h-6 mr-1 mb-1 text-green-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l5 5l10 -10" />
            </svg>
            Convert YouTube videos into Raw MP3s.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <input
              ref={inputUrlRef}
              placeholder="https://www.youtube.com/watch?v=..."
              className="form-input rounded-md border border-gray-300"
              type="text"
            />
            <button type="submit" className="btn mb-3">
              Search
            </button>
          </form>

          {urlResult ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={urlResult}
              className="download-btn underline"
            >
              Download Raw MP3
            </a>
          ) : (
            ""
          )}
        </section>

        <section>
          <div>
            <p className="content-description mt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-check inline-block w-6 h-6 mr-1 mb-1 text-green-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
              Tune Raw MP3s to your heart's content.
            </p>
            <div>
              {/* <input type="file" onChange={onFileChange} />
              <button onClick={onUpload}>Upload</button> */}
              <div className="mx-auto flex justify-center items-center flex-col">
                <input
                  type="file"
                  onChange={onFileChange}
                  className="overflow-hidden pr-2 text-gray-400 text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded-md"
                />
                <button onClick={onUpload} className="btn my-4 items-center">
                  Upload
                </button>
              </div>
            </div>

            <div className="flex justify-center text-black mt-1">
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

              <form className="max-w-xs mx-auto flex flex-col items-center">
                <label htmlFor="bedrooms-input" className="sr-only">
                  Choose bedrooms number:
                </label>
                <div className="relative flex items-center mb-2">
                  <button
                    onClick={() =>
                      setPitch((prevPitch) => Math.max(prevPitch - 100, -2400))
                    }
                    type="button"
                    id="decrement-button"
                    data-input-counter-decrement="bedrooms-input"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    placeholder="Pitch"
                    step={100}
                    min={-2400}
                    max={2400}
                    type="text"
                    id="bedrooms-input"
                    className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    readOnly
                    required
                  />
                  <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-music w-3 h-3 text-gray-400"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      <path d="M9 17v-13h10v13" />
                      <path d="M9 8h10" />
                    </svg>
                    <span className="font-mono">Pitch</span>
                  </div>
                  <button
                    onClick={() =>
                      setPitch((prevPitch) => Math.min(prevPitch + 100, 2400))
                    }
                    type="button"
                    id="increment-button"
                    data-input-counter-increment="bedrooms-input"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>

                <label htmlFor="nights-input" className="sr-only">
                  Choose number of nights:
                </label>
                <div className="relative flex items-center">
                  <button
                    onClick={() =>
                      setTempo((prevTempo) =>
                        Number(Math.max(prevTempo - 0.05, 0.05).toFixed(2))
                      )
                    }
                    type="button"
                    id="decrement-button"
                    data-input-counter-decrement="nights-input"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    id="nights-input"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    placeholder="Tempo"
                    step={0.05}
                    min={0.05}
                    max={4}
                    className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    readOnly
                    required
                  />
                  <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-brand-speedtest w-3 h-3 text-gray-400"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5.636 19.364a9 9 0 1 1 12.728 0" />
                      <path d="M16 9l-4 4" />
                    </svg>
                    <span className="font-mono">Tempo</span>
                  </div>
                  <button
                    onClick={() =>
                      setTempo((prevTempo) =>
                        Number(Math.min(prevTempo + 0.05, 4).toFixed(2))
                      )
                    }
                    type="button"
                    id="increment-button"
                    data-input-counter-increment="nights-input"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {isLoading ? (
              <div className="flex justify-center mt-5" aria-label="loading">
                <div className="animate-ping h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="animate-ping h-2 w-2 bg-blue-500 rounded-full mx-4"></div>
                <div className="animate-ping h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={onChangePitchAndTempo}
                  className="btn my-4 items-center"
                  disabled={!id}
                >
                  Change
                </button>
                <div className="flex flex-col items-center">
                  <audio
                    ref={audioRef}
                    controls
                    src={id ? `${baseURL}/stream/${id}` : undefined}
                    className="mt-1"
                  />
                  {id && (
                    <button
                      className="mt-3 underline hover:cursor-pointer"
                      onClick={onDownload}
                    >
                      Download Tuned MP3
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <footer className=" absolute bottom-0 w-full text-center py-2 px-4 text-white text-sm">
        <p>
          <span>&copy;</span> {new Date().getFullYear()} SHISOTEM{" "}
        </p>
      </footer>
    </>
  );
}

export default App;
