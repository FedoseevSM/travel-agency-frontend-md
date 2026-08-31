import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Users, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { sendTelegramNotification } from '@/lib/telegram';
import { countryCodes } from "@/data/countryCodes";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
  date?: string;
  adults?: number;
  children?: number;
  totalPrice?: number;
  currency?: string;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  date,
  adults,
  children,
  totalPrice,
  currency
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+7', // Default to Russia
    email: '',
    message: '',
    contact_method: 'telegram',
    service: '',
    location: '',
    status: 'already'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactError, setContactError] = useState<string>('');

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

  const validateContact = (value: string, method: string) => {
    if (method === 'telegram') {
      if (!value.startsWith('@')) {
        return t('modals.contact.validation.telegram.startWith');
      }
      if (value.length < 5) {
        return t('modals.contact.validation.telegram.tooShort');
      }
      if (!/^@[a-zA-Z0-9_]{4,}$/.test(value)) {
        return t('modals.contact.validation.telegram.format');
      }
    } else {
      const phoneNumber = value.replace(/\D/g, '');
      if (phoneNumber.length < 9) {
        return t('modals.contact.validation.phone.tooShort');
      }
      if (!/^\d+$/.test(phoneNumber)) {
        return t('modals.contact.validation.phone.onlyDigits');
      }
    }
    return '';
  };

  const handleContactMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    setFormData(prev => ({
      ...prev,
      contact_method: method,
      phone: '',
      countryCode: method === 'whatsapp' ? '+7' : ''
    }));
    setContactError('');
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const error = validateContact(value, formData.contact_method);
    setContactError(error);
    setFormData(prev => ({ ...prev, phone: value }));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const contactError = validateContact(formData.phone, formData.contact_method);
    if (contactError) {
      setContactError(contactError);
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedContact = formData.contact_method === 'whatsapp' 
        ? `${formData.countryCode}${formData.phone.replace(/\D/g, '')}` 
        : formData.phone;

      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: '',
          phone: formattedContact,
          message: formData.message,
          contact_method: formData.contact_method,
          service: formData.service || serviceTitle,
          location: formData.location,
          status: formData.status,
          service_title: serviceTitle,
          date: date,
          adults: adults,
          children: children,
          total_price: totalPrice,
          currency: currency
        }]);

      if (error) throw error;

      try {
        await sendWhatsAppNotification({
          name: formData.name,
          contact: formattedContact,
          contactMethod: formData.contact_method,
          service: formData.service || serviceTitle || '',
          location: formData.location,
          status: formData.status,
          message: formData.message,
          date: date,
          adults: adults,
          children: children ,
          totalPrice: totalPrice,
          currency: currency
        });
        await sendTelegramNotification({
          name: formData.name,
          contact: formattedContact,
          contactMethod: formData.contact_method,
          service: formData.service || serviceTitle || '',
          location: formData.location,
          status: formData.status,
          message: formData.message,
          date: date,
          adults: adults,
          children: children,
          totalPrice: totalPrice,
          currency: currency
        });
      } catch (notifyError: any) {
        console.error('Notification error:', notifyError);
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        countryCode: '+7',
        email: '',
        message: '',
        contact_method: 'telegram',
        service: '',
        location: '',
        status: 'already'
      });
      
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm min-h-screen"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl bg-ocean-darkest rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
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
              {t('modals.contact.title')}
            </h2>

            {/* Booking Summary */}
            {serviceTitle && (
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">{serviceTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {date && (
                    <div className="flex items-center text-ocean-light">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{date}</span>
                    </div>
                  )}
                  {(adults !== undefined || children !== undefined) && (
                    <div className="flex items-center text-ocean-light">
                      <Users className="h-5 w-5 mr-2" />
                      <span>
                        {adults} взр.
                        {children ? ` + ${children} дет.` : ''}
                      </span>
                    </div>
                  )}
                  {totalPrice !== undefined && (
                    <div className="flex items-center text-ocean-light">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>{totalPrice.toLocaleString()} {currency}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {submitStatus === 'success' ? (
              <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{t('modals.contact.success.title')}</h3>
                <p>{t('modals.contact.success.message')}</p>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{t('modals.contact.error.title')}</h3>
                <p>{t('modals.contact.error.message')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ocean-light mb-1">
                    {t('modals.contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

                {/* Contact Method */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contact_method"
                      value="telegram"
                      checked={formData.contact_method === 'telegram'}
                      onChange={handleContactMethodChange}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-2 rounded-lg bg-white/10 peer-checked:bg-ocean-deep text-ocean-light 
                                peer-checked:text-white cursor-pointer transition-colors">
                      Telegram
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contact_method"
                      value="whatsapp"
                      checked={formData.contact_method === 'whatsapp'}
                      onChange={handleContactMethodChange}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-2 rounded-lg bg-white/10 peer-checked:bg-ocean-deep text-ocean-light 
                                peer-checked:text-white cursor-pointer transition-colors">
                      WhatsApp
                    </div>
                  </label>
                </div>

                {/* Contact Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-ocean-light mb-1">
                    {formData.contact_method === 'telegram' 
                      ? t('modals.contact.telegram')
                      : t('modals.contact.whatsapp')}
                  </label>
                  <div className="relative">
                    {formData.contact_method === 'whatsapp' && (
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                        className="absolute left-0 top-0 bottom-0 w-20 bg-white/10 border border-ocean-deep/20 
                                 rounded-l-lg px-2 text-white focus:outline-none focus:ring-2
                                 focus:ring-ocean-deep focus:border-transparent"
                      >
                        {countryCodes.map(({ code, country }) => (
                          <option key={code} value={code} className="bg-ocean-darkest">
                            {code}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type={formData.contact_method === 'whatsapp' ? 'tel' : 'text'}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleContactChange}
                      placeholder={formData.contact_method === 'telegram' ? '@username' : '123456789'}
                      required
                      className={`w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                              text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                              focus:ring-ocean-deep focus:border-transparent ${
                                formData.contact_method === 'whatsapp' ? 'pl-24' : ''
                              }`}
                    />
                  </div>
                  {contactError && (
                    <p className="mt-1 text-sm text-red-400">{contactError}</p>
                  )}
                </div>

                {!serviceTitle && (
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-ocean-light mb-1">
                      {t('modals.contact.service')}
                    </label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required={!serviceTitle}
                      className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                               text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                               focus:ring-ocean-deep focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-ocean-light mb-1">
                    {t('modals.contact.location')}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="already"
                      checked={formData.status === 'already'}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-2 rounded-lg bg-white/10 peer-checked:bg-ocean-deep text-ocean-light 
                                peer-checked:text-white cursor-pointer transition-colors">
                      {t('modals.contact.status.already')}
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="planning"
                      checked={formData.status === 'planning'}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-2 rounded-lg bg-white/10 peer-checked:bg-ocean-deep text-ocean-light 
                                peer-checked:text-white cursor-pointer transition-colors">
                      {t('modals.contact.status.planning')}
                    </div>
                  </label>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ocean-light mb-1">
                    {t('modals.contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !!contactError}
                  className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                           hover:bg-ocean-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('modals.contact.sending') : t('modals.contact.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};