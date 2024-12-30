import axios from "axios";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeJournal = async (journalText, selectedOption) => {
  try {
    var prompt;
    switch (selectedOption) {
      case "Analyze Mood":
        prompt = `Read this journal entry and analyze its mood. Remember to not write any extra descriptive lines in the response, write the mood as a heading and explain each mood in 1-2 lines. The journal is: \n${journalText}`;
        break;

      case "Generate Reflection":
        prompt = `Read this journal entry and generate reflections on it. Use second person pronouns. Remember to not write any extra descriptive lines in the response, and use separate lines for each point with space between each point. At max write 8 points if required, otherwise just write as many as sufficient (below 8). The journal is: \n${journalText}`;
        break;

      case "Give Writing Advice":
        prompt = `Read this journal entry and give writing advice based on it. Use second person pronouns. Remember to not write any introduction or conclusion lines in the response, only write the advice and use separate paragraphs with a short heading for each paragraph. Keep it within 100-120 words. The journal is: \n${journalText}`;
    }

    const response = await axios({
      url: GEMINI_API_URL,
      method: "post",
      data: {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    });

    return response["data"]["candidates"][0]["content"]["parts"][0]["text"]; // Return the result to the caller
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error; // Rethrow the error for the UI to handle
  }
};
