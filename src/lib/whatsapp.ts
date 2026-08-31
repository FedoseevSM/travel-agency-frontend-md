import axios from 'axios';

const WA_API_TOKEN = import.meta.env.VITE_WA_API_TOKEN;
const WA_PHONE_NUMBER = import.meta.env.VITE_WA_PHONE_NUMBER;

function formatPhoneNumber(phone) {
  return String(phone).replace(/\D/g, '');
}

export const sendWhatsAppNotification = async (data: {
  name: string;
  contact: string;
  contactMethod: string;
  service: string;
  location: string;
  status: string;
  message?: string;
  date?: string;
  adults?: number;
  children?: number;
  totalPrice?: number;
  currency?: string;
}) => {
  try {
    await axios({
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
          name: "utility_booking_ru",
          language: { "code": "ru" },
          components: [
              {
                  type: "body",
                  parameters: [
                      {
                          type: "text",
                          text: data?.name ? data.name : 'Не заполнено' // {{1}}
                      },
                      {
                          type: "text",
                          text: data?.contact ? data.contact : 'Не заполнено' // {{2}}
                      },
                      {
                          type: "text",
                          text: data?.contactMethod ? data.contactMethod : 'Не заполнено' // {{3}}
                      },
                      {
                          type: "text",
                          text: data?.service ? data.service : 'Не заполнено' // {{4}}
                      },
                      {
                          type: "text",
                          text: data?.date ? data.date : 'Не заполнено' // {{5}}
                      },
                      {
                          type: "text",
                          text: data?.location ? data.location : 'Не заполнено' // {{6}}
                      },
                      {
                          type: "text",
                          text: data?.adults ? data.adults : 'Не заполнено' // {{7}}
                      },
                      {
                          type: "text",
                          text: data?.children ? data.children : 'Не заполнено' // {{8}}
                      },
                      {
                          type: "text",
                          text: data?.totalPrice ? data.totalPrice : 'Не заполнено' // {{9}}
                      },
                      {
                          type: "text",
                          text: data?.message ? data.message : 'Не заполнено' // {{10}}
                      },
                      {
                          type: "text",
                          text: data?.status ? data.status : 'Не заполнено' // {{11}}
                      },
                      {
                          type: "text",
                          text: data?.currency ? data.currency : 'Не заполнено' // {{12}}
                      }
                  ]
              }
          ]
        }
      }
    });
    await axios({
      method: 'POST',
      url: 'https://graph.facebook.com/v21.0/562755193586295/messages',
      headers: {
        'Authorization': `Bearer ${WA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        messaging_product: 'whatsapp',
        to: formatPhoneNumber(data.contact),
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
                          text: data?.name ? data.name : 'Не заполнено' // {{1}}
                      },
                      {
                          type: "text",
                          text: data?.service ? data.service : 'Не заполнено' // {{2}}
                      },
                      {
                          type: "text",
                          text: data?.date ? data.date : 'Не заполнено' // {{3}}
                      },
                      {
                          type: "text",
                          text: data?.location ? data.location : 'Не заполнено' // {{4}}
                      },
                      {
                          type: "text",
                          text: data?.adults ? data.adults : 'Не заполнено' // {{5}}
                      },
                      {
                          type: "text",
                          text: data?.children ? data.children : 'Не заполнено' // {{6}}
                      },
                      {
                          type: "text",
                          text: data?.totalPrice ? data.totalPrice : 'Не заполнено' // {{7}}
                      },
                      {
                          type: "text",
                          text: data?.message ? data.message : 'Не заполнено' // {{8}}
                      },
                      {
                          type: "text",
                          text: data?.currency ? data.currency : 'Не заполнено' // {{9}}
                      }
                  ]
              }
          ]
        }
      }
    });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    // Don't throw the error to prevent form submission failure
  }
};