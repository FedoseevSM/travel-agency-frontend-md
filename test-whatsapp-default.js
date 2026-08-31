import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const WA_API_TOKEN = process.env.VITE_WA_API_TOKEN;
const WA_PHONE_NUMBER = process.env.VITE_TEST_WA_PHONE_NUMBER;

async function testWhatsAppMessage() {
  if (!WA_API_TOKEN || !WA_PHONE_NUMBER) {
    console.error('Missing required environment variables');
    return;
  }

  try {
    console.log('Sending message to:', WA_PHONE_NUMBER);

    const response = await axios({
      method: 'POST',
      url: 'https://graph.facebook.com/v21.0/562755193586295/messages',
      headers: {
        'Authorization': `Bearer ${WA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        messaging_product: 'whatsapp',
        to: WA_PHONE_NUMBER,
        type: 'template',
        template: { 
          name: "hello_world",
          language: { "code": "en_US" }
        }
      }
    });

    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testWhatsAppMessage().catch(console.error);