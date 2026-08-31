import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { Testimonial } from '@/types/service';
import { TestimonialFormModal } from '@/components/modals/TestimonialFormModal';

interface ServiceTestimonialsProps {
  testimonials: Testimonial[];
  serviceId: string;
  onTestimonialSubmit: (testimonial: {
    rating: number;
    comment: string;
    author: string;
  }) => Promise<void>;
}

export const ServiceTestimonials: React.FC<ServiceTestimonialsProps> = ({ 
  testimonials,
  serviceId,
  onTestimonialSubmit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async (testimonial: {
    rating: number;
    comment: string;
    author: string;
  }) => {
    // await onTestimonialSubmit(testimonial);
    setIsModalOpen(false);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-white mb-6">
        <div className="flex items-center">
          <Star className="h-6 w-6 mr-3 text-yellow-400" />
          <h2 className="text-2xl font-bold">Отзывы наших клиентов</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-ocean-deep/80 hover:bg-ocean-deep 
                   text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Оставить отзыв
        </button>
      </div>

      {showFeedback && (
        <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-lg text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Спасибо за ваш отзыв!</h3>
          <p>Мы рассмотрим его в ближайшее время.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-4">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-ocean-deep flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {testimonial.author[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{testimonial.author}</h3>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-ocean-light">{testimonial.date}</p>
              </div>
            </div>
            <p className="text-ocean-lighter">{testimonial.comment}</p>
          </div>
        ))}
      </div>

      <TestimonialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceId={serviceId}
        onSubmit={handleSubmit}
      />
    </div>
  );
};