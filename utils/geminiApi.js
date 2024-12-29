import axios from "axios";
import { GEMINI_API_KEY } from "@env";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";

export const analyzeJournal = async (journalText, selectedOption) => {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        prompt: `Analyze this journal entry for ${selectedOption}: ${journalText}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
      }
    );

    return response.data; // Return the result to the caller
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error; // Rethrow the error for the UI to handle
  }
};
