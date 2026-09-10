const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Generate interview report based on user resume, self description and job description
 * @route POST /api/interview/
 * @access private
 */
async function generateInterviewReportController(req, res) {
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

  const pdfBuffer = await generateResumePdf({resume,selfDescription,jobDescription})

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
  })

  res.send(pdfBuffer)
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};
