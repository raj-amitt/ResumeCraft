import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterViewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);


  return (
    <InterviewContext.Provider
      value={{
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        error,
        setError,
        resumeLoading,
        setResumeLoading
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
