import "../style/home.scss";

const Home = () => {
  return (
    <main className="home">
      <header className="home-header">
        <p className="eyebrow">ResumeCraft</p>
        <h1>
          Create Your <span>Interview Plan</span>
        </h1>
        <p className="home-intro">
          Let our AI analyze the job requirements and your profile to
          build a winning strategy.
        </p>
      </header>

      <form className="interview-input-group">
        <section className="form-panel job-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M3 12h18M10 12v2h4v-2" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
            </div>
            <span className="required-badge">Required</span>
          </div>
          <label className="sr-only" htmlFor="jobDescription">
            Target Job Description
          </label>
          <textarea
            name="jobDescription"
            id="jobDescription"
            placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
            maxLength="5000"
          />
          <div className="character-count">0 / 5000 chars</div>
        </section>

        <section className="form-panel profile-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>
          </div>

          <div className="input-group resume-group">
            <div className="field-label">
              <label htmlFor="resume">Upload Resume</label>
              <small className="highlight">(Upload both the resume and the self description to get best results)</small>
            </div>
            <label className="file-label" htmlFor="resume">
              <span className="upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7 18a4 4 0 0 1-.4-7.98A5.5 5.5 0 0 1 17.3 8.5 3.5 3.5 0 0 1 18 15h-2" />
                  <path d="m12 11-3 3m3-3 3 3m-3-3v8" />
                </svg>
              </span>
              <strong>Click to upload or drag &amp; drop</strong>
              <small>PDF (Max 3MB)</small>
            </label>
            <input type="file" hidden name="resume" id="resume" accept=".pdf,.docx" />
          </div>

          <div className="divider"><span>AND/OR</span></div>

          <div className="input-group self-description-group">
            <label htmlFor="selfDescription">Quick Self-Description</label>
            <textarea
              name="selfDescription"
              id="selfDescription"
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
            />
          </div>

          <p className="form-note">
            <span aria-hidden="true">i</span>
            Either a Resume or a Self Description is required to generate a
            personalized plan.
          </p>

          <button className="button primary-button" type="submit">
            <span aria-hidden="true">+</span> Generate My Interview Strategy
          </button>
        </section>
      </form>

      <footer className="home-footer">
        <span>AI-Powered Strategy Generation - Approx 30s</span>
      
      </footer>
    </main>
  );
};

export default Home;
