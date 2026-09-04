export const ENV_CONFIG = {
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  WHATSAPP: {
    API_TOKEN: import.meta.env.VITE_WA_API_TOKEN || '',
    PHONE_NUMBER: import.meta.env.VITE_WA_PHONE_NUMBER || '',
    TEST_PHONE_NUMBER: import.meta.env.VITE_TEST_WA_PHONE_NUMBER || '',
  },
  TELEGRAM: {
    ENDPOINT: import.meta.env.VITE_TG_ENDPOINT || '',
  },
  COHERE: {
    API_KEY: import.meta.env.VITE_COHERE_API_KEY || '',
    API_URL: 'https://api.cohere.ai/v1/generate',
  },
  GITHUB: {
    TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
    OWNER: 'galardopozzobon743-png', // Defaulting to the repository owner
    REPO: 'travel-agency-frontend',
    DATA_FOLDER: 'data',
  },
  AIRTABLE: {
    API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || '',
    BASE_ID: 'appCBRu5ZvOcekHCn', // Extracted from Airtable URL
    TABLE_ID: 'pbdHsbfH5pf3k6Ayb',
  }
};
