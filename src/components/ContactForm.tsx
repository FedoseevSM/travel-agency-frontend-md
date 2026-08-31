import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { sendTelegramNotification } from '@/lib/telegram';
import { countryCodes } from "@/data/countryCodes";

export const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    countryCode: '+7', // Default to Russia
    service: '',
    location: '',
    contactMethod: 'telegram',
    status: 'already'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [contactError, setContactError] = useState<string>('');

  // Validate contact based on method
  const validateContact = (value: string, method: string) => {
    if (method === 'telegram') {
      // Telegram username validation
      if (!value.startsWith('@')) {
        return 'Логин Telegram должен начинаться с @';
      }
      if (value.length < 5) {
        return 'Логин Telegram слишком короткий';
      }
      if (!/^@[a-zA-Z0-9_]{4,}$/.test(value)) {
        return 'Неверный формат логина Telegram';
      }
    } else {
      // WhatsApp number validation
      const phoneNumber = value.replace(/\D/g, '');
      if (phoneNumber.length < 9) {
        return 'Номер телефона слишком короткий';
      }
      if (!/^\d+$/.test(phoneNumber)) {
        return 'Номер телефона должен содержать только цифры';
      }
    }
    return '';
  };

  // Handle contact method change
  const handleContactMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    setFormData(prev => ({
      ...prev,
      contactMethod: method,
      contact: '', // Reset contact field
      countryCode: method === 'whatsapp' ? '+7' : '' // Reset country code for WhatsApp
    }));
    setContactError('');
  };

  // Handle contact change
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const error = validateContact(value, formData.contactMethod);
    setContactError(error);
    setFormData(prev => ({ ...prev, contact: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Final validation
    const contactError = validateContact(formData.contact, formData.contactMethod);
    if (contactError) {
      setContactError(contactError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Format contact for submission
      const formattedContact = formData.contactMethod === 'whatsapp' 
        ? `${formData.countryCode}${formData.contact.replace(/\D/g, '')}` 
        : formData.contact;

      const { error: supabaseError } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: '',
            phone: formattedContact,
            contact_method: formData.contactMethod,
            service: formData.service,
            location: formData.location,
            status: formData.status,
            message: ''
          }
        ]);

      if (supabaseError) throw supabaseError;

      // Send notifications
      try {
        // Send WhatsApp notification
        await sendWhatsAppNotification({
          name: formData.name,
          contact: formattedContact,
          contactMethod: formData.contactMethod,
          service: formData.service,
          location: formData.location,
          status: formData.status,
          message: ''
        });
       // Send Telegram notification
        await sendTelegramNotification({
          name: formData.name,
          contact: formattedContact,
          contactMethod: formData.contactMethod,
          service: formData.service,
          location: formData.location,
          status: formData.status,
          message: ''
        });
      } catch (notifyError: any) {
        console.error('Notification error:', notifyError);
        // Don't fail the whole submission if notification fails
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        contact: '',
        countryCode: '+7',
        service: '',
        location: '',
        contactMethod: 'telegram',
        status: 'already'
      });

      // Reset form after success message
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || t('home.contact.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-darkest/95 to-ocean-darker/90" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('home.contact.title')}
            </h2>
            <p className="text-xl text-ocean-light mb-8">
              {t('home.contact.subtitle')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
            {submitStatus === 'success' ? (
              <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{t('home.contact.form.success')}</h3>
                <p>{t('home.contact.form.successMessage')}</p>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{t('home.contact.form.error')}</h3>
                <p>{errorMessage || t('home.contact.form.errorMessage')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('home.contact.form.name')}
                    required
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-3
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

                {/* Contact Method Selection */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="telegram"
                      checked={formData.contactMethod === 'telegram'}
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
                      name="contactMethod"
                      value="whatsapp"
                      checked={formData.contactMethod === 'whatsapp'}
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
                  <div className="relative">
                    {formData.contactMethod === 'whatsapp' && (
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
                      type={formData.contactMethod === 'whatsapp' ? 'tel' : 'text'}
                      name="contact"
                      value={formData.contact}
                      onChange={handleContactChange}
                      placeholder={formData.contactMethod === 'telegram' ? '@username' : '123456789'}
                      className={`w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-3
                              text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                              focus:ring-ocean-deep focus:border-transparent ${
                                formData.contactMethod === 'whatsapp' ? 'pl-24' : ''
                              }`}
                    />
                  </div>
                  {contactError && (
                    <p className="mt-1 text-sm text-red-400">{contactError}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    placeholder={t('home.contact.form.service')}
                    required
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-3
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={t('home.contact.form.location')}
                    required
                    className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-3
                             text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                             focus:ring-ocean-deep focus:border-transparent"
                  />
                </div>

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
                      {t('home.contact.form.status.already')}
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
                      {t('home.contact.form.status.planning')}
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !!contactError}
                  className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                           hover:bg-ocean-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Отправка...' : t('home.contact.form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};