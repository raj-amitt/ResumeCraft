const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score between the candidate and the job description, on a scale of 0 to 100, indicating how well the candidate's skills and experience align with the requirements of the job",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc",
          ),
      }),
    )
    .describe(
      "A list of technical questions that can be asked in the interview, along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc",
          ),
      }),
    )
    .describe(
      "A list of behavioral questions that can be asked in the interview, along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking or needs to improve upon",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, i.e. how important it is for the candidate to improve this skill",
          ),
      }),
    )
    .describe(
      "A list of skills that the candidate is lacking or needs to improve upon, along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number of the preparation plan starting from 1"),
        focus: z
          .string()
          .describe(
            "The focus of the preparation plan for this day, i.e. what the candidate should focus on learning or practicing",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "A list of tasks that the candidate should complete on this day to prepare for the interview",
          ),
      }),
    )
    .describe(
      "A preparation plan for the candidate to follow in order to improve their skills and prepare for the interview, broken down by day",
    ),
  title: z
    .string()
    .describe(
      "The title of the job role for which interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate based on the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });
  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  console.log("HTML CONTENT:");
  console.log(htmlContent);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4"});

  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  try {
    const resumePdfSchema = z.object({
      html: z
        .string()
        .describe(
          "The HTML content of the resume which can be converted into a pdf using any library like puppeteer",
        ),
    });

    const prompt = `You are an expert professional resume writer and resume designer specializing in creating ATS-friendly, human-written resumes tailored to specific job descriptions.

Your task is to generate a polished, professional resume for the candidate using the information provided below.

Candidate Information
Existing Resume

${resume}

Self Description

${selfDescription}

Target Job Description

${jobDescription}

Objective

Create a resume that is specifically tailored to the target job description while remaining completely truthful to the candidate's provided information.

The resume should:

Highlight the candidate's strongest and most relevant skills, experience, achievements, and qualifications.
Prioritize experience, skills, and projects that are most relevant to the target job.
Use terminology and keywords from the job description naturally where they accurately match the candidate's background.
Present the candidate in the strongest possible way without inventing, exaggerating, or fabricating information.
Convert relevant experience and responsibilities into concise, impact-oriented resume statements wherever the provided information supports doing so.
Remove or de-emphasize information that is irrelevant to the target role.
Maintain a natural, professional tone that closely resembles a resume written by an experienced human professional.
Writing Requirements

Write the resume content as if it were written by a highly experienced professional resume writer.

The content must:

Sound natural and human-written.
Avoid generic, repetitive, exaggerated, or overly polished language.
Avoid phrases that make the resume sound AI-generated.
Be concise and easy to scan.
Use strong action-oriented language where appropriate.
Avoid unnecessary buzzwords and meaningless claims.
Never fabricate employment history, skills, technologies, achievements, metrics, education, certifications, or other qualifications that are not supported by the provided information.
Preserve factual accuracy while optimizing the presentation of the candidate's experience.
Resume Structure

Use an appropriate professional resume structure based on the candidate's background and the target role.

Where applicable, include sections such as:

Professional Summary
Technical Skills / Core Skills
Professional Experience
Projects
Education
Certifications
Additional relevant sections

Only include sections that contain meaningful information.

Arrange sections in an order that best presents the candidate for the target role.

HTML Requirements

Return the resume as a complete, self-contained HTML document that can be rendered directly by Puppeteer and converted into a PDF.

The HTML must:

Be valid and well-structured.
Include all required HTML elements such as <!DOCTYPE html>, <html>, <head>, and <body>.
Use embedded CSS so the document is completely self-contained.
Be optimized for A4 PDF output.
Have clean spacing, alignment, typography, and visual hierarchy.
Be easy to read and scan.
Use a simple, modern, professional design.
Use color sparingly and professionally.
Use font weights, sizes, spacing, borders, and subtle visual elements to create hierarchy.
Avoid excessive graphics, decorative elements, icons, tables, or complex layouts that could negatively affect ATS readability or PDF rendering.
Ensure the layout remains professional when rendered as an A4 PDF.
Avoid unnecessary blank space.
Avoid content overflowing outside the printable page.
Ensure page breaks occur naturally and do not split important sections awkwardly.
ATS Compatibility

The resume should remain highly readable by Applicant Tracking Systems.

Therefore:

Prefer semantic HTML and standard text.
Avoid embedding important information inside images.
Avoid overly complex multi-column layouts unless they clearly improve readability.
Keep section headings clear and recognizable.
Use standard resume terminology where appropriate.
Include relevant job-description keywords naturally and accurately.
Output Requirements

Return ONLY a valid JSON object with exactly one field:

{
"html": "<complete HTML resume>"
}

The value of html must contain the complete HTML document.

Do not include:

Markdown code fences
Explanations
Comments outside the HTML
Additional JSON fields
Any text before or after the JSON object

The final HTML must be ready to pass directly to Puppeteer's page.setContent() method.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(resumePdfSchema),
      },
    });
    const jsonContent = JSON.parse(response.text);
    console.log("JSON CONTENT:", jsonContent);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
  } catch (error) {
    console.error("Resume pdf generation failed", error);
    throw error;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
