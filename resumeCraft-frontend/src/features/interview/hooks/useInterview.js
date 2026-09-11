import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  if (!context) {
    throw new Error("UseInterview must be used within an InterviewProvider");
  }
  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    error,
    setError,
    resumeLoading,
    setResumeLoading,
  } = context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response.interviewReports;
  };
  const getResumePdf = async (interviewReportId) => {
      setResumeLoading(true);

    setError("");

    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Resume generation failed:", error);

      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();

        try {
          const data = JSON.parse(text);

          if (data.code === "AI_SERVICE_BUSY") {
            setError(data.message);
            return;
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
      }

      setError("Something went wrong while generating your resume.");
    } finally {
        setResumeLoading(false);

    }
  };
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);
  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    error,
    resumeLoading
  };
};
