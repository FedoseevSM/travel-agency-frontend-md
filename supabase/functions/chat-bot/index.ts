import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const COMMON_RESPONSES = {
  greeting: [
    'Здравствуйте! Я виртуальный помощник Phuket Plus. Чем могу помочь?',
    'Добрый день! Я помогу вам с информацией об экскурсиях и отдыхе на Пхукете.',
  ],
  booking: [
    'Забронировать экскурсию очень просто! Выберите интересующую вас экскурсию, нажмите кнопку "Забронировать" и заполните форму. Наш менеджер свяжется с вами в ближайшее время.',
    'Для бронирования выберите экскурсию из каталога, укажите дату и количество участников. После оформления заявки мы свяжемся с вами для подтверждения.',
  ],
  payment: [
    'Мы принимаем оплату наличными при встрече, банковскими картами и электронными переводами. Предоплата не требуется.',
    'Вы можете оплатить экскурсию удобным для вас способом: наличными, картой или переводом. Оплата производится в день экскурсии.',
  ],
  cancellation: [
    'Вы можете отменить бронирование не позднее чем за 24 часа до начала экскурсии без штрафов.',
    'Отмена бронирования возможна за сутки до экскурсии. При более поздней отмене может взиматься штраф.',
  ],
  weather: [
    'Лучшее время для посещения Пхукета - с ноября по апрель, когда погода сухая и солнечная. С мая по октябрь возможны кратковременные дожди.',
    'На Пхукете тропический климат. Сухой сезон длится с ноября по апрель, влажный - с мая по октябрь. Температура воздуха круглый год 25-35°C.',
  ],
  transport: [
    'Мы предоставляем трансфер из любого отеля на Пхукете. Вас заберет комфортабельный автомобиль с кондиционером.',
    'Трансфер включен в стоимость большинства экскурсий. Мы забираем туристов из всех районов Пхукета.',
  ],
}

const findBestResponse = (message: string): string => {
  message = message.toLowerCase()
  
  if (message.includes('привет') || message.includes('здравств')) {
    return COMMON_RESPONSES.greeting[Math.floor(Math.random() * COMMON_RESPONSES.greeting.length)]
  }
  
  if (message.includes('бронирован') || message.includes('заказать') || message.includes('забронировать')) {
    return COMMON_RESPONSES.booking[Math.floor(Math.random() * COMMON_RESPONSES.booking.length)]
  }
  
  if (message.includes('оплат') || message.includes('платеж') || message.includes('деньги')) {
    return COMMON_RESPONSES.payment[Math.floor(Math.random() * COMMON_RESPONSES.payment.length)]
  }
  
  if (message.includes('отмен') || message.includes('отменить')) {
    return COMMON_RESPONSES.cancellation[Math.floor(Math.random() * COMMON_RESPONSES.cancellation.length)]
  }
  
  if (message.includes('погод') || message.includes('климат') || message.includes('сезон')) {
    return COMMON_RESPONSES.weather[Math.floor(Math.random() * COMMON_RESPONSES.weather.length)]
  }
  
  if (message.includes('трансфер') || message.includes('транспорт') || message.includes('добраться')) {
    return COMMON_RESPONSES.transport[Math.floor(Math.random() * COMMON_RESPONSES.transport.length)]
  }
  
  return 'Извините, я не совсем понял ваш вопрос. Пожалуйста, переформулируйте его или свяжитесь с нашим менеджером для получения более подробной информации.'
}

serve(async (req) => {
  try {
    const { message } = await req.json()
    const response = findBestResponse(message)
    
    return new Response(
      JSON.stringify({ response }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
})