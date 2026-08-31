import axios from 'axios';

const TG_ENDPOINT = import.meta.env.VITE_TG_ENDPOINT;

interface NotificationData {
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
}

export const sendTelegramNotification = async (data: NotificationData) => {
  try {
    await axios.post(TG_ENDPOINT, {
      email: 'Email не указан',
      name: data.name,
      contact: data.contact,
      contactMethod: data.contactMethod,
      service: data.service,
      location: data.location,
      status: data.status,
      message: data.message || 'Нет комментария',
      date: data.date,
      adults: data.adults,
      children: data.children,
      totalPrice: data.totalPrice,
      currency: data.currency
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
    // Don't throw the error to prevent form submission failure
  }
};