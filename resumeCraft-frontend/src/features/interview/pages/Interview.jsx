import { useState } from "react";
import {
  BriefcaseBusiness,
  Code2,
  Focus,
  MessageSquare,
  Milestone,
} from "lucide-react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const sections = [
  { id: "technical", label: "Technical questions", Icon: Code2 },
  { id: "behavioral", label: "Behavioral questions", Icon: MessageSquare },
  { id: "roadmap", label: "Road Map", Icon: Milestone },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [questionIndex, setQuestionIndex] = useState(0);
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const { report, loading, getResumePdf, error,resumeLoading } = useInterview();
  if (loading || !report) {
    return (
      <main>
        <h1>Loading your interview plan</h1>
      </main>
    );
  }
  const questions =
    activeSection === "behavioral"
      ? report.behavioralQuestions
      : report.technicalQuestions;
  const activeQuestion = questions[questionIndex] ?? questions[0];

  const selectSection = (section) => {
    setActiveSection(section);
    setQuestionIndex(0);
  };

  return (
    <main className="interview-page">
      <header className="interview-header">
        <div className="brand-lockup">
          <span className="brand-mark">
            <BriefcaseBusiness aria-hidden="true" focusable="false" />
          </span>
          <span>ResumeCraft</span>
        </div>
        <div className="header-actions">
          <button
            className="button primary-button"
            onClick={() => {
              handleLogout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="interview-summary">
        <div className="interview-wrapper">
          <p className="interview-eyebrow">
            Your personalized interview strategy
          </p>
          <h1>Interview preparation plan</h1>
          <p>
            Focus your preparation on the questions and skills most relevant to
            this role.
          </p>
        </div>
      </section>

      <section className="interview-workspace">
        <aside className="interview-sidebar">
          <p className="sidebar-label">Explore strategy</p>
          <nav aria-label="Interview strategy sections">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  activeSection === section.id
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
                onClick={() => selectSection(section.id)}
              >
                <span className="sidebar-icon">
                  <section.Icon aria-hidden="true" focusable="false" />
                </span>
                {section.label}
                {activeSection === section.id && (
                  <span className="active-indicator" />
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-tip">
            <span>i</span>
            <p>Review each answer aloud to make it your own.</p>
          </div>
        </aside>

        <section className="interview-content">
          {activeSection === "roadmap" ? (
            <div className="roadmap-view">
              <div className="content-heading">
                <div>
                  <p className="section-kicker">5-day roadmap</p>
                  <h2>Your preparation plan</h2>
                </div>
                <span className="count-badge">
                  {report.preparationPlan.length} days
                </span>
              </div>
              <div className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <article className="roadmap-item" key={day.day}>
                    <span className="day-number">
                      {String(day.day).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{day.focus}</h3>
                      <ul>
                        {day.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="question-view">
              <div className="content-heading">
                <div>
                  <p className="section-kicker">
                    {activeSection === "technical"
                      ? "Technical questions"
                      : "Behavioral questions"}
                  </p>
                  <h2>Questions to prepare</h2>
                </div>
                <span className="count-badge">
                  {questionIndex + 1} / {questions.length}
                </span>
              </div>
              <article className="question-card">
                <div className="question-card-top">
                  <span>Question {questionIndex + 1}</span>
                  <span className="sparkle">✦</span>
                </div>
                <h3>{activeQuestion.question}</h3>
                <div className="answer-block">
                  <p className="answer-label">What they are looking for</p>
                  <p>{activeQuestion.intention}</p>
                </div>
                <div className="answer-block suggested-answer">
                  <p className="answer-label">Suggested direction</p>
                  <p>{activeQuestion.answer}</p>
                </div>
              </article>
              <div className="question-controls">
                <button
                  type="button"
                  disabled={questionIndex === 0}
                  onClick={() => setQuestionIndex((index) => index - 1)}
                >
                  Previous
                </button>
                <div className="question-dots">
                  {questions.map((item, index) => (
                    <button
                      type="button"
                      aria-label={`Go to question ${index + 1}`}
                      className={
                        index === questionIndex
                          ? "question-dot active"
                          : "question-dot"
                      }
                      key={item.question}
                      onClick={() => setQuestionIndex(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={questionIndex === questions.length - 1}
                  onClick={() => setQuestionIndex((index) => index + 1)}
                >
                  Next question <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="skill-panel">
          <div className="match-score">
            <span>Match score</span>
            <strong>{report.matchScore}%</strong>
          </div>
          <div className="skill-heading">
            <div>
              <p className="section-kicker">Development focus</p>

              <h2>Skill gaps</h2>
            </div>
            <span className="skill-icon">
              <Focus aria-hidden="true" focusable="false" />
            </span>
          </div>
          <p className="skill-intro">
            Topics worth strengthening before your interview.
          </p>
          <div className="skill-list">
            {report.skillGaps.map((gap) => (
              <div className="skill-item" key={gap.skill}>
                <span>{gap.skill}</span>
                <small className={`severity ${gap.severity}`}>
                  {gap.severity}
                </small>
              </div>
            ))}
          </div>
          <div className="download-btn">

  {error && (
    <div className="resume-error">
      {error}
    </div>
  )}

  <button
    onClick={() => getResumePdf(interviewId)}
    className="button primary-button"
    disabled={resumeLoading}
  >
    {resumeLoading
      ? "Generating Resume..."
      : "Download Resume"}
  </button>

</div>
        </aside>
      </section>
    </main>
  );
};

export default Interview;
