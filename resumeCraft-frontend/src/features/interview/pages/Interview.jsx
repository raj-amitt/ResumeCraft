import { useState } from "react";
import {
  BriefcaseBusiness,
  Code2,
  Focus,
  MessageSquare,
  Milestone,
} from "lucide-react";
import "../style/interview.scss";

const interviewReport = {
  matchScore: 94,
  technicalQuestions: [
    {
      question:
        "How do you implement Role-Based Access Control (RBAC) middleware in an Express.js application using JWT?",
      intention:
        "To verify your practical understanding of security, middleware architecture, and authorization logic.",
      answer:
        "Explain extracting the JWT from the request header, verifying it with a secret key, and checking the decoded role against permitted roles. Mention a reusable checkRole higher-order middleware function.",
    },
    {
      question:
        "When designing MongoDB schemas, how do you decide between embedding documents versus using references?",
      intention:
        "To test your knowledge of data modeling and optimization for read and write performance.",
      answer:
        "Embedding works well for one-to-few relationships and fast reads. References are better for one-to-many or many-to-many relationships where duplication and document size are concerns.",
    },
    {
      question:
        "Describe your process for deploying a MERN application on a Linux VPS. Why use Nginx and PM2?",
      intention:
        "To validate your end-to-end deployment experience and production environment knowledge.",
      answer:
        "Cover environment setup, PM2 process management and auto-restarts, and Nginx as a reverse proxy for SSL termination, port forwarding, and static file serving.",
    },
    {
      question:
        "How do you optimize React performance and prevent unnecessary re-renders in a large-scale application?",
      intention:
        "To assess depth in frontend development beyond basic component creation.",
      answer:
        "Discuss React.memo, useMemo, useCallback, and code-splitting with React.lazy and Suspense, while profiling first to target the work that matters.",
    },
  ],
  behavioralQuestions: [
    {
      question:
        "Tell me about a challenging bug you encountered in production and how you resolved it.",
      intention:
        "To evaluate problem-solving skills, composure under pressure, and debugging methodology.",
      answer:
        "Use the STAR method. Highlight the debugging tools, the logical steps used to isolate the root cause, and the permanent fix that followed.",
    },
    {
      question:
        "How do you prioritize tasks when feature requests and bug fixes compete for your attention?",
      intention:
        "To assess time management and your ability to align work with business priorities.",
      answer:
        "Evaluate impact and urgency, communicate with stakeholders about business value, and break larger work into manageable milestones.",
    },
  ],
  skillGaps: [
    { skill: "Automated Testing (Unit/Integration)", severity: "medium" },
    { skill: "Advanced DevOps/CI-CD Pipelines", severity: "low" },
    { skill: "State Management Libraries (Redux/Zustand)", severity: "medium" },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Advanced Backend & Security",
      tasks: [
        "Review JWT refresh token strategies.",
        "Practice complex Mongoose aggregation pipelines.",
      ],
    },
    {
      day: 2,
      focus: "Frontend Optimization & State Management",
      tasks: [
        "Study React performance profiling.",
        "Build a small Redux Toolkit or Zustand project.",
      ],
    },
    {
      day: 3,
      focus: "DevOps and Deployment",
      tasks: [
        "Deep dive into Nginx configuration.",
        "Practice a basic GitHub Actions pipeline.",
      ],
    },
    {
      day: 4,
      focus: "Testing & Quality Assurance",
      tasks: [
        "Learn Jest and Supertest basics.",
        "Practice unit, integration, and E2E test cases.",
      ],
    },
    {
      day: 5,
      focus: "Soft Skills & Portfolio Review",
      tasks: [
        "Prepare STAR format project answers.",
        "Conduct a mock architecture interview.",
      ],
    },
  ],
};

const sections = [
  { id: "technical", label: "Technical questions", Icon: Code2 },
  { id: "behavioral", label: "Behavioral questions", Icon: MessageSquare },
  { id: "roadmap", label: "Road Map", Icon: Milestone },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [questionIndex, setQuestionIndex] = useState(0);
  const questions =
    activeSection === "behavioral"
      ? interviewReport.behavioralQuestions
      : interviewReport.technicalQuestions;
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
          <span className="status-dot" /> Strategy generated{" "}
          
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
                  {interviewReport.preparationPlan.length} days
                </span>
              </div>
              <div className="roadmap-list">
                {interviewReport.preparationPlan.map((day) => (
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
          <strong>{interviewReport.matchScore}%</strong>
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
            {interviewReport.skillGaps.map((gap) => (
              <div className="skill-item" key={gap.skill}>
                <span>{gap.skill}</span>
                <small className={`severity ${gap.severity}`}>
                  {gap.severity}
                </small>
              </div>
            ))}
          </div>
          <div className="score-note">
            <strong>Strong foundation</strong>
            <span>
              Your profile aligns well with the role. A little focused practice
              will make the difference.
            </span>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Interview;
