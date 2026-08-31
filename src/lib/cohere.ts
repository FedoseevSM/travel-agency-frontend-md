import axios from 'axios';

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

export async function translateText(text: string, targetLanguage: 'en' | 'ru'): Promise<string> {
  try {
    const prompt = `Translate the following text to ${targetLanguage === 'en' ? 'English' : 'Russian'}. 
    Maintain a natural, conversational tone while preserving the meaning:
    
    "${text}"`;

    const response = await axios.post(
      COHERE_API_URL,
      {
        model: 'command',
        prompt,
        max_tokens: 500,
        temperature: 0.3,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.generations[0].text.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
}