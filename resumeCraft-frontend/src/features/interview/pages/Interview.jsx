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
import {useAuth} from "../../auth/hooks/useAuth"



const sections = [
  { id: "technical", label: "Technical questions", Icon: Code2 },
  { id: "behavioral", label: "Behavioral questions", Icon: MessageSquare },
  { id: "roadmap", label: "Road Map", Icon: Milestone },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [questionIndex, setQuestionIndex] = useState(0);
  const {interviewId} = useParams()
  const navigate = useNavigate()
  const {handleLogout} = useAuth();

  const {report,loading,getResumePdf}=useInterview();
 if(loading || !report){
    return(
      <main>
        <h1>Loading your interview plan</h1>
      </main>
    )
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
          <button className="button primary-button"
          onClick={()=>{
             handleLogout()
            navigate('/')
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
            <button
              onClick={()=>{getResumePdf(interviewId)}}
            className="button primary-button">
              <svg height={"0.8rem"} style={{marginRight:"0.3rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
              Download Resume
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Interview;
