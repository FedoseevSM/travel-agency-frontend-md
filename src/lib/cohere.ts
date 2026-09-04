import axios from 'axios';
import { ENV_CONFIG } from '../config/env';

const COHERE_API_KEY = ENV_CONFIG.COHERE.API_KEY;
const COHERE_API_URL = ENV_CONFIG.COHERE.API_URL;

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