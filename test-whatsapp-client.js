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
          name: "utulity_booking_client_en",
          language: { "code": "en_US" },
          components: [
              {
                  type: "body",
                  parameters: [
                      {
                          type: "text",
                          text: 'Иван Петров' // {{1}}
                      },
                      {
                          type: "text",
                          text: 'Као Сок + Чео Лан (стандарт, 2д/1н)' // {{2}}
                      },
                      {
                          type: "text",
                          text: '01.01.2025' // {{3}}
                      },
                      {
                          type: "text",
                          text: 'Пхукет' // {{4}}
                      },
                      {
                          type: "text",
                          text: '1' // {{5}}
                      },
                      {
                          type: "text",
                          text: '0' // {{6}}
                      },
                      {
                          type: "text",
                          text: '2300' // {{7}}
                      },
                      {
                          type: "text",
                          text: 'Комментарий к заказу' // {{8}}
                      },
                      {
                          type: "text",
                          text: '฿' // {{9}}
                      }
                  ]
              }
          ]
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