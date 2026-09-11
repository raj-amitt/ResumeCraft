const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate interview report based on user resume, self description and job description
 * @route POST /api/interview/
 * @access private
 */
async function generateInterviewReportController(req, res) {
try {
    const pdfParse = require("pdf-parse");
   console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

        if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });
  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });
  res
    .status(201)
    .json({
      message: "Interview Report Generated Successfully",
      interviewReport,
    });
} catch (error) {
   console.error("GENERATE INTERVIEW REPORT ERROR:");
    console.error(error);

    return res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
}
}

/**
 * @description Get interview report by id
 * @route GET /api/interview/:interviewId
 * @access private
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview Report not found" });
  }
  return res
    .status(200)
    .json({
      message: "Interview Report fetched successfully",
      interviewReport,
    });
}

/**
 * @description Get all interview reports of the logged in user
 * @route GET /api/interview/
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
    res.status(200).json({message:"Interview Reports fetched successfully", interviewReports})
}

/**
 * @description Generate resume pdf based on user resume, self description and job description
 */
async function generateResumePdfController(req,res) {
  const {interviewReportId} = req.params
  
  const interviewReport = await interviewReportModel.findById(interviewReportId)
  if(!interviewReport){
    return res.status(404).json({
      message:"Interview Report Not Found."
    })
  }
  const{resume,selfDescription,jobDescription} = interviewReport

  try {
    const pdfBuffer = await generateResumePdf({resume,selfDescription,jobDescription})

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
  })

  res.send(pdfBuffer)
  } catch (error) {
    console.error("Resume generation error:", error);

  if (error.code === "AI_SERVICE_BUSY") {

    return res.status(503).json({
      success: false,
      code: "AI_SERVICE_BUSY",
      message:
        "We couldn't generate your resume right now because our AI services are temporarily busy. Please try again in a few minutes."
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong while generating your resume."
  });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};
