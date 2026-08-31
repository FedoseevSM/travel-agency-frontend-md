import React, { useState } from 'react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { countryCodes } from "@/data/countryCodes";
import { useTranslation } from 'react-i18next';

const Contacts: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+7', // Default to Russia
    message: '',
    contact_method: 'telegram',
    service: '',
    location: '',
    status: 'already'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactError, setContactError] = useState<string>('');

  // Validate contact based on method
  const validateContact = (value: string, method: string) => {
    if (method === 'telegram') {
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
      contact_method: method,
      phone: '',
      countryCode: method === 'whatsapp' ? '+7' : ''
    }));
    setContactError('');
  };

  // Handle contact change
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const error = validateContact(value, formData.contact_method);
    setContactError(error);
    setFormData(prev => ({ ...prev, phone: value }));
  };

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
          service: formData.service,
          location: formData.location,
          status: formData.status
        }]);

      if (error) throw error;

      try {
        await axios.post('https://tgtg.koyeb.app/api/notify', {
          email: 'Email не указан',
          name: formData.name,
          contact: formattedContact,
          contactMethod: formData.contact_method,
          service: formData.service,
          location: formData.location,
          status: formData.status,
          message: formData.message || 'Нет комментария'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (notifyError: any) {
        console.error('Notification error:', notifyError);
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+7',
        message: '',
        contact_method: 'telegram',
        service: '',
        location: '',
        status: 'already'
      });

      setTimeout(() => {
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

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground height="30vh" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('contacts.title')}
            </h1>
            <p className="text-ocean-light text-lg mb-12">
              {t('contacts.subtitle')}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('contacts.sections.contacts.title')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center text-ocean-lighter">
                      <Phone className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.contacts.phone')}</span>
                    </div>
                    <div className="flex items-center text-ocean-lighter">
                      <MapPin className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.contacts.location')}</span>
                    </div>
                    <div className="flex items-center text-ocean-lighter">
                      <Clock className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.contacts.hours')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('contacts.sections.messengers.title')}</h2>
                  <div className="space-y-4">
                    <a 
                      href="https://t.me/thai_guru" 
                      className="flex items-center text-ocean-lighter hover:text-white transition-colors"
                    >
                      <FaTelegramPlane className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.messengers.telegram')}</span>
                    </a>
                    <a 
                      href="https://wa.me/66816690960" 
                      className="flex items-center text-ocean-lighter hover:text-white transition-colors"
                    >
                      <FaWhatsapp className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.messengers.whatsapp')}</span>
                    </a>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('contacts.sections.social.title')}</h2>
                  <div className="space-y-4">
                    <a 
                      href="https://facebook.com/phuket.thai.guru" 
                      className="hidden flex items-center text-ocean-lighter hover:text-white transition-colors"
                    >
                      <Facebook className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.social.facebook')}</span>
                    </a>
                    <a 
                      href="https://instagram.com/thaiguru_phuket" 
                      className="flex items-center text-ocean-lighter hover:text-white transition-colors"
                    >
                      <Instagram className="h-5 w-5 mr-3 text-ocean-light" />
                      <span>{t('contacts.sections.social.instagram')}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">{t('contacts.form.title')}</h2>
                {submitStatus === 'success' ? (
                  <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-2">{t('contacts.form.success.title')}</h3>
                    <p>{t('contacts.form.success.text')}</p>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-2">{t('contacts.form.error.title')}</h3>
                    <p>{t('contacts.form.error.text')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-ocean-light mb-1">
                        {t('contacts.form.name')}
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
                        {formData.contact_method === 'telegram' ? 'Логин Telegram *' : 'Номер WhatsApp *'}
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

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-ocean-light mb-1">
                        {t('contacts.form.service')}
                      </label>
                      <input
                        type="text"
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                                 text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                                 focus:ring-ocean-deep focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-ocean-light mb-1">
                        {t('contacts.form.location')}
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
                          {t('contacts.form.status.already')}
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
                          {t('contacts.form.status.planning')}
                        </div>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-ocean-light mb-1">
                        {t('contacts.form.message')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
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
                               hover:bg-ocean-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {isSubmitting ? t('contacts.form.sending') : t('contacts.form.submit')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;