function App() {
  return (
    <div className="app">
      <span className="logo">YourTune</span>

      <section className="content">
        <h1 className="content-title">YouTube to MP3, Simple!</h1>
        <p className="content-description">
          Transform YouTube videos into MP3 files in just a few clicks.
        </p>

        <form className="form">
          <input
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
