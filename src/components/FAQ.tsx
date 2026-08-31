import React, { useState } from 'react';
import { ChevronDown, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});

  const faqItems = [
    {
      question: t('home.faq.questions.booking.question'),
      answer: t('home.faq.questions.booking.answer')
    },
    {
      question: t('home.faq.questions.payment.question'),
      answer: t('home.faq.questions.payment.answer')
    },
    {
      question: t('home.faq.questions.cancellation.question'),
      answer: t('home.faq.questions.cancellation.answer')
    },
    {
      question: t('home.faq.questions.transfer.question'),
      answer: t('home.faq.questions.transfer.answer')
    },
    {
      question: t('home.faq.questions.weather.question'),
      answer: t('home.faq.questions.weather.answer')
    }
  ];

  const handleFeedback = (index: number, isHelpful: boolean) => {
    setFeedback(prev => ({
      ...prev,
      [index]: isHelpful
    }));
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.faq.title')}
          </h2>
          <p className="text-xl text-ocean-light max-w-3xl mx-auto">
            {t('home.faq.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-ocean-light transition-transform ${
                    openItem === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openItem === index && (
                <div className="px-6 pb-4">
                  <p className="text-ocean-light mb-4">{item.answer}</p>
                  
                  {feedback[index] === undefined && (
                    <div className="flex items-center justify-end space-x-4">
                      <span className="text-sm text-ocean-light">Был ли ответ полезным?</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(index, true);
                        }}
                        className="p-2 text-ocean-light hover:text-white transition-colors"
                        aria-label="Да, ответ был полезным"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(index, false);
                        }}
                        className="p-2 text-ocean-light hover:text-white transition-colors"
                        aria-label="Нет, ответ не был полезным"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {feedback[index] !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-ocean-light">
                        Спасибо за ваш отзыв!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};