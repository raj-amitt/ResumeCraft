import "../style/home.scss";
const Home = () => {
  return (
    <main className="home">
      <div className="interview-input-group">
        <div className="left">
          <textarea
            name="jobDescription"
            id="jobDescription"
            placeholder='"Enter job description here'
          ></textarea>
        </div>
        <div className="right">
          <div className="input-group">
            <label htmlFor="resume">Upload resume</label>
            <input type="file" name="resume" id="resume" accept=".pdf" />
          </div>
          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              name="selfDescription"
              id="selfDescription"
              placeholder="Describe yourself briefly"
            ></textarea>
          </div>
          <button className="generate-btn">Generate Interview Report</button>
        </div>
      </div>
    </main>
  );
};

export default Home;
