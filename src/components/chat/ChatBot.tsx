import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Временные локальные ответы, пока Edge Function не готова
const COMMON_RESPONSES = {
  greeting: [
    'Я виртуальный помощник THAI GURU. Вы можете связаться с нами:\n\n' +
    '📱 Telegram: @thai_guru\n' +
    '📱 WhatsApp: +66 81 669 0960\n' +
    '📸 Instagram: @thaiguru_phuket\n\n' +
    'Чем могу помочь?',
    'Добрый день! Я помогу вам с информацией об экскурсиях и отдыхе на Пхукете.\n\n' +
    'Наши контакты для связи:\n' +
    '📱 Telegram: @thai_guru\n' +
    '📱 WhatsApp: +66 81 669 0960\n' +
    '📸 Instagram: @thaiguru_phuket'
  ],
  booking: [
    'Забронировать экскурсию очень просто! Выберите интересующую вас экскурсию, нажмите кнопку "Забронировать" и заполните форму. Наш менеджер свяжется с вами в ближайшее время.\n\n' +
    'Также вы можете написать нам напрямую:\n' +
    '📱 Telegram: @thai_guru\n' +
    '📱 WhatsApp: +66 81 669 0960',
    'Для бронирования выберите экскурсию из каталога, укажите дату и количество участников. После оформления заявки мы свяжемся с вами для подтверждения.\n\n' +
    'Или напишите нам:\n' +
    '📱 Telegram: @thai_guru\n' +
    '📱 WhatsApp: +66 81 669 0960'
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
};

const findBestResponse = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('привет') || message.includes('здравств')) {
    return COMMON_RESPONSES.greeting[Math.floor(Math.random() * COMMON_RESPONSES.greeting.length)];
  }
  
  if (message.includes('бронирован') || message.includes('заказать') || message.includes('забронировать') || message.includes('свободн') || message.includes('купи') || message.includes('дат')) {
    return COMMON_RESPONSES.booking[Math.floor(Math.random() * COMMON_RESPONSES.booking.length)];
  }
  
  if (message.includes('плат') || message.includes('платеж') || message.includes('деньги')) {
    return COMMON_RESPONSES.payment[Math.floor(Math.random() * COMMON_RESPONSES.payment.length)];
  }
  
  if (message.includes('отмен') || message.includes('отменить')) {
    return COMMON_RESPONSES.cancellation[Math.floor(Math.random() * COMMON_RESPONSES.cancellation.length)];
  }
  
  if (message.includes('погод') || message.includes('климат') || message.includes('сезон')) {
    return COMMON_RESPONSES.weather[Math.floor(Math.random() * COMMON_RESPONSES.weather.length)];
  }
  
  if (message.includes('трансфер') || message.includes('транспорт') || message.includes('добраться')) {
    return COMMON_RESPONSES.transport[Math.floor(Math.random() * COMMON_RESPONSES.transport.length)];
  }
  
  return 'Извините, я не совсем понял ваш вопрос. Пожалуйста, переформулируйте его или свяжитесь с нашим менеджером:\n\n' +
         '📱 Telegram: @thai_guru\n' +
         '📱 WhatsApp: +66 81 669 0960\n' +
         '📸 Instagram: @thaiguru_phuket';
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttentionAnimation, setShowAttentionAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add continuous attention animation effect
  useEffect(() => {
    const startAnimation = () => {
      if (!isOpen) {
        setShowAttentionAnimation(true);
        // Reset animation after it completes
        animationTimeoutRef.current = setTimeout(() => {
          setShowAttentionAnimation(false);
          // Start next animation cycle after a short pause
          setTimeout(startAnimation, 1000);
        }, 2000); // Animation duration
      }
    };

    // Initial delay before starting animation cycle
    const initialTimeout = setTimeout(startAnimation, 5000);

    return () => {
      clearTimeout(initialTimeout);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Имитация задержки ответа
    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: findBestResponse(userMessage.content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 bg-ocean-deep text-white p-4 rounded-full shadow-lg 
                   hover:bg-ocean-medium transition-all duration-300 group
                   ${showAttentionAnimation ? 'animate-attention' : ''}`}
        aria-label="Открыть чат"
      >
        <MessageSquare className="h-6 w-6" />
        {/* Ripple effect */}
        <span className={`absolute inset-0 rounded-full bg-white/30 scale-0 
                         group-hover:scale-150 group-hover:opacity-0 
                         transition-all duration-500 ease-out`} />
        {/* Attention animation rings */}
        <span className={`absolute inset-0 rounded-full border-4 border-ocean-light/30
                         ${showAttentionAnimation ? 'animate-ping' : 'opacity-0'}`} />
        <span className={`absolute inset-0 rounded-full border-4 border-ocean-light/20
                         ${showAttentionAnimation ? 'animate-ping animation-delay-200' : 'opacity-0'}`} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-full max-w-sm bg-ocean-darkest rounded-lg shadow-xl transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-ocean-darker">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-ocean-light mr-2" />
          <h3 className="text-white font-medium">Помощник THAI GURU</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-ocean-light hover:text-white transition-colors"
            aria-label={isMinimized ? 'Развернуть' : 'Свернуть'}
          >
            {isMinimized ? (
              <Maximize2 className="h-5 w-5" />
            ) : (
              <Minimize2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-ocean-light hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-ocean-light py-8">
                <p className="mb-4">Я виртуальный помощник THAI GURU.</p>
                <p className="mb-4">Наши контакты для связи:</p>
                <p className="mb-2">📱 Telegram: @thai_guru</p>
                <p className="mb-2">📱 WhatsApp: +66 81 669 0960</p>
                <p className="mb-4">📸 Instagram: @thaiguru_phuket</p>
                <p>Задайте мне вопрос об экскурсиях, бронировании или отдыхе на Пхукете.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-ocean-deep text-white'
                          : 'bg-white/10 text-ocean-light'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg px-4 py-2 text-ocean-light">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-ocean-light rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
                        <div className="w-2 h-2 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-ocean-darker">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                         text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                         focus:ring-ocean-deep focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="bg-ocean-deep text-white p-2 rounded-lg hover:bg-ocean-medium 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Отправить"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};