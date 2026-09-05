const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

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
    title :z.string().describe("The title of the job role for which interview report is generated"),
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
  return JSON.parse(response.text)
}

module.exports = generateInterviewReport;
