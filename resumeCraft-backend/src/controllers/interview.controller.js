const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
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
 * @route GET /api/interview/report/:interviewId
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
  const interviewReports = (
    await interviewReportModel.find({ user: req.user.id })
  )
    .toSorted({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
    res.status(200).json({message:"Interview Reports fetched successfully", interviewReports})
}
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
