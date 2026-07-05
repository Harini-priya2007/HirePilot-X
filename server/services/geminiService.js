const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order (fallback chain)
const MODELS = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash-001', 'gemini-2.0-flash-lite'];

/**
 * Safely parse a JSON string, stripping markdown code fences if present.
 */
const parseJSON = (text) => {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
};

/**
 * Sleep helper for retry delays.
 */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Call Gemini with automatic model fallback and retry on 429.
 * Tries each model in MODELS array; retries once after 15s on rate limit.
 */
const callGemini = async (prompt) => {
  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        console.log(`✅ Gemini responded using model: ${modelName}`);
        return result.response.text();
      } catch (err) {
        const is429 = err.message?.includes('429') || err.message?.includes('quota');
        const is404 = err.message?.includes('404') || err.message?.includes('not found');

        if (is404) {
          console.warn(`⚠️  Model ${modelName} not available, trying next...`);
          break; // Try next model
        }

        if (is429 && attempt === 1) {
          console.warn(`⏳ Rate limited on ${modelName}, waiting 15s before retry...`);
          await sleep(15000);
          continue; // Retry same model
        }

        if (is429 && attempt === 2) {
          console.warn(`⚠️  Still rate limited on ${modelName}, trying next model...`);
          break; // Try next model
        }

        // Unknown error — throw it
        throw err;
      }
    }
  }
  throw new Error('All Gemini models failed or are rate-limited. Please try again in a moment.');
};

/**
 * Generate 5 interview questions for a given domain and difficulty.
 * @param {string} domain - e.g. "Frontend", "Backend"
 * @param {string} difficulty - "Easy" | "Medium" | "Hard"
 * @returns {Promise<string[]>} Array of 5 question strings
 */
const generateQuestions = async (domain, difficulty) => {
  const prompt = `You are a senior technical interviewer conducting a ${difficulty.toLowerCase()} level interview for a ${domain} role.

Generate exactly 5 interview questions. The questions must:
- Be appropriate for ${difficulty} difficulty level
- Be specific to ${domain} domain
- Mix conceptual understanding with practical problem-solving
- Be clear and unambiguous
- Progress naturally in a real interview flow

Return ONLY a valid JSON array of exactly 5 strings. No markdown, no explanations, no code blocks — just the raw JSON array.

Example output:
["Question one here?", "Question two here?", "Question three here?", "Question four here?", "Question five here?"]`;

  const text = await callGemini(prompt);
  const questions = parseJSON(text);

  if (!Array.isArray(questions) || questions.length !== 5) {
    throw new Error('Gemini returned an unexpected format for questions.');
  }

  return questions;
};

/**
 * Evaluate a candidate's interview answers using Gemini.
 * @param {string} domain
 * @param {string} difficulty
 * @param {string[]} questions
 * @param {string[]} answers
 * @returns {Promise<Object>} Evaluation with score, strengths, weaknesses, suggestions, feedback
 */
const evaluateAnswers = async (domain, difficulty, questions, answers) => {
  const qaBlock = questions
    .map(
      (q, i) =>
        `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i]?.trim() || '(No answer provided)'}`
    )
    .join('\n\n');

  const prompt = `You are an expert ${domain} interviewer evaluating a ${difficulty} level interview.

Here are the questions and the candidate's answers:

${qaBlock}

Evaluate the candidate's overall performance and provide structured feedback. Be honest, constructive, and specific.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "score": <integer 0-100 based on quality of all answers>,
  "strengths": [<2-4 specific strengths observed>],
  "weaknesses": [<2-3 specific areas needing improvement>],
  "suggestions": [<2-4 actionable improvement tips>],
  "feedback": [
    {"question": "<question 1 text>", "answer": "<answer 1 text>", "comment": "<specific feedback for this answer>"},
    {"question": "<question 2 text>", "answer": "<answer 2 text>", "comment": "<specific feedback for this answer>"},
    {"question": "<question 3 text>", "answer": "<answer 3 text>", "comment": "<specific feedback for this answer>"},
    {"question": "<question 4 text>", "answer": "<answer 4 text>", "comment": "<specific feedback for this answer>"},
    {"question": "<question 5 text>", "answer": "<answer 5 text>", "comment": "<specific feedback for this answer>"}
  ]
}`;

  const text = await callGemini(prompt);
  const evaluation = parseJSON(text);

  return evaluation;
};

module.exports = { generateQuestions, evaluateAnswers };
