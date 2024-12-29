import axios from "axios";
import Constants from "expo-constants";

const GEMINI_API_KEY = Constants.manifest2.extra.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeJournal = async (journalText, selectedOption) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: `Read this journal entry, based on it I want you to - ${selectedOption}. The journal is: \n${journalText}`,
            },
          ],
        },
      ],
    });

    return response.data; // Return the result to the caller
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error; // Rethrow the error for the UI to handle
  }
};
