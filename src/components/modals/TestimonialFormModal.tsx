import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star } from 'lucide-react';

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  onSubmit: (testimonial: {
    rating: number;
    comment: string;
    author: string;
  }) => Promise<void>;
}

export const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  onSubmit
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        rating,
        comment,
        author
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg bg-ocean-darkest rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ocean-light hover:text-white transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Оставить отзыв
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-ocean-light mb-2">
                  Оценка
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          (hoveredRating !== null ? value <= hoveredRating : value <= rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-ocean-light'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-ocean-light mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                           text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                           focus:ring-ocean-deep focus:border-transparent"
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-ocean-light mb-2">
                  Ваш отзыв *
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                           text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                           focus:ring-ocean-deep focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !author.trim() || !comment.trim()}
                className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                         hover:bg-ocean-medium transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};