import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Truck, CreditCard, Shield, Gift, Globe } from 'lucide-react';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { supabase } from '@/lib/supabase';
import axios from 'axios';

// Categories with their products
const categories = [
  {
    id: 'leather',
    name: 'Изделия из кожи',
    description: 'Посетите магазины эксклюзивных сумок, кошельков и аксессуаров из кожи крокодила и змеи'
  },
  {
    id: 'jewelry',
    name: 'Ювелирные изделия',
    description: 'Исследуйте ювелирные магазины с украшениями из золота и серебра, с драгоценными камнями'
  },
  {
    id: 'latex',
    name: 'Латексные изделия',
    description: 'Посетите магазины ортопедических подушек и матрасов из натурального тайского латекса'
  },
  {
    id: 'medicine',
    name: 'Медицинские товары',
    description: 'Изучите традиционные тайские лекарства, посетите аптеки и змеиные фермы для уникального опыта'
  }
];

const products = {
  leather: [
    {
      id: 'snake-bag',
      name: 'Кожа Змеи',
      description: 'Во время этой эксклюзивной шопинг экскурсии вы сможете посетить бутик, предлагающий сумки ручной работы из натуральной кожи питона',
      features: ['Ручная работа', 'Сертификат подлинности', 'Уникальный дизайн', 'Натуральная кожа питона'],
      priceRange: '15000-30000',
      gallery: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594422297652-5fd45a5f3b7d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'croc-wallet',
      name: 'Кожа Крокодила',
      description: 'Присоединяйтесь к нашей шопинг экскурсии и посетите бутик, где можно приобрести роскошные кошельки из натуральной кожи крокодила',
      features: ['Кожа крокодила', 'Ручная работа', 'Несколько отделений', 'Подарочная упаковка'],
      priceRange: '8000-15000',
      gallery: [
        'https://images.unsplash.com/photo-1594422297652-5fd45a5f3b7d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80'
      ]
    }
  ],
  jewelry: [
    {
      id: 'sapphire-ring',
      name: 'Кольцо с сапфиром',
      description: 'Элегантное кольцо из белого золота с натуральным тайским сапфиром',
      features: ['Белое золото 585', 'Натуральный сапфир', 'Сертификат подлинности', 'Ручная работа'],
      priceRange: '20000-40000',
      gallery: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586878341523-7503d575f8cf?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pearl-necklace',
      name: 'Ожерелье из жемчуга',
      description: 'Роскошное ожерелье из натурального жемчуга южных морей',
      features: ['Натуральный жемчуг', 'Застежка из белого золота', 'Регулируемая длина', 'Подарочный футляр'],
      priceRange: '30000-60000',
      gallery: [
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586878341523-7503d575f8cf?auto=format&fit=crop&q=80'
      ]
    }
  ],
  latex: [
    {
      id: 'latex-pillow',
      name: 'Ортопедическая подушка',
      description: 'Анатомическая подушка из натурального латекса с эффектом памяти',
      features: ['100% натуральный латекс', 'Ортопедический эффект', 'Антиаллергенная', 'Съемный чехол'],
      priceRange: '2000-4000',
      gallery: [
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'latex-mattress',
      name: 'Латексный матрас',
      description: 'Ортопедический матрас из натурального латекса высшего качества',
      features: ['100% натуральный латекс', 'Разные уровни жесткости', 'Антибактериальное покрытие', 'Гарантия 10 лет'],
      priceRange: '10000-20000',
      gallery: [
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80'
      ]
    }
  ],
  medicine: [
    {
      id: 'traditional-medicine',
      name: 'Традиционная медицина',
      description: 'Традиционные тайские лекарства и настойки, основанные на рецептах народной медицины',
      features: ['Натуральные ингредиенты', 'Древние рецепты', 'Для здоровья и укрепления иммунитета'],
      priceRange: '500-3000',
      gallery: [
        'https://images.unsplash.com/photo-1565575016599-f1c65ff7fdf4?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565575001942-20b78d9e2ef4?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'pharmacies',
      name: 'Аптеки',
      description: 'Современные аптеки с широким ассортиментом медицинских товаров и консультациями фармацевтов',
      features: ['Широкий ассортимент лекарств', 'Консультации специалистов', 'Удобное расположение'],
      priceRange: '100-2000',
      gallery: [
        'https://images.unsplash.com/photo-1591017577630-cdc07b1e9095?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591017577820-3d3ed3cf7b37?auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'crocodile-farms',
      name: 'Крокодиловые фермы',
      description: 'Посещение ферм, где выращивают крокодилов, с возможностью приобретения кожи и сувениров',
      features: ['Посещение фермы', 'Изделия из кожи крокодила', 'Уникальные сувениры'],
      priceRange: '2000-10000',
      gallery: [
        'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506748686201-5fd32cb04bfa?auto=format&fit=crop&q=80'
      ]
    }
  ]
};

const benefits = [
  {
    icon: ShoppingBag,
    title: 'Удобный шоппинг',
    description: 'Организуем комфортные экскурсии с посещением популярных торговых мест'
  },
  {
    icon: Globe,
    title: 'Туры по Таиланду',
    description: 'Предлагаем туры по лучшим шоппинг-местам'
  },
  {
    icon: Gift,
    title: 'Эксклюзивные предложения',
    description: 'Скидки и специальные предложения для наших клиентов на шоппинг'
  }
];

const ShoppingService = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<Record<string, number>>(
    Object.values(products).flat().reduce((acc, product) => ({ 
      ...acc, 
      [product.id]: 0 
    }), {})
  );

  // Set the first category as selected by default when component mounts
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, []);

  const handleImageNav = (productId: string, direction: 'prev' | 'next') => {
    const product = Object.values(products).flat().find(p => p.id === productId);
    if (!product) return;

    setCurrentImages(prev => ({
      ...prev,
      [productId]: direction === 'next'
        ? (prev[productId] + 1) % product.gallery.length
        : (prev[productId] - 1 + product.gallery.length) % product.gallery.length
    }));
  };

  const handleContactSubmit = async (formData: {
    name: string;
    phone: string;
    email: string;
    message: string;
    contact_method: string;
    service: string;
    location: string;
    status: string;
  }) => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            contact_method: formData.contact_method,
            service: formData.service,
            location: formData.location,
            status: formData.status,
            service_title: `Шопинг: ${selectedProduct.name}`,
            total_price: parseInt(selectedProduct.priceRange.split('-')[0]),
            currency: '฿'
          }
        ]);

      if (error) throw error;

      try {
        await axios.post('https://tgtg.koyeb.app/api/notify', {
          email: formData.email || 'Email не указан',
          name: formData.name,
          contact: formData.phone,
          contactMethod: formData.contact_method,
          service: `Шопинг: ${selectedProduct.name}`,
          location: formData.location,
          status: formData.status,
          message: formData.message || 'Нет комментария',
          totalPrice: parseInt(selectedProduct.priceRange.split('-')[0]),
          currency: '฿'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (notifyError: any) {
        console.error('Notification error:', notifyError);
      }

      setIsContactModalOpen(false);
      setSelectedProduct(null);
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className={`p-6 rounded-xl text-left transition-all ${
              selectedCategory?.id === category.id
                ? 'bg-ocean-deep text-white'
                : 'bg-white/10 text-ocean-light hover:bg-white/20'
            }`}
          >
            <ShoppingBag className={`h-8 w-8 mb-4 ${
              selectedCategory?.id === category.id ? 'text-white' : 'text-ocean-light'
            }`} />
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-sm opacity-80">{category.description}</p>
          </button>
        ))}
      </div>

      {/* Products */}
      {selectedCategory && products[selectedCategory.id as keyof typeof products]?.map((product) => (
        <div
          key={product.id}
          className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Gallery */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img
                src={product.gallery[currentImages[product.id]]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <button
                onClick={() => handleImageNav(product.id, 'prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleImageNav(product.id, 'next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImages(prev => ({ ...prev, [product.id]: index }))}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImages[product.id] === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
              <p className="text-ocean-light mb-6">{product.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-8">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white/10 rounded-lg text-ocean-light text-sm"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="bg-white/5 rounded-lg p-6 mb-8">
                <div className="text-sm text-ocean-light mb-2">Ценовой диапазон</div>
                <div className="text-2xl font-bold text-white">
                  {product.priceRange} ฿
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setIsContactModalOpen(true);
                }}
                className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                         hover:bg-ocean-medium transition-colors"
              >
                Узнать подробнее
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Benefits Section */}
      <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm">
        <div className="flex items-center mb-8">
          <Shield className="h-6 w-6 text-ocean-light mr-3" />
          <h2 className="text-2xl font-bold text-white">Наши преимущества</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-6"
            >
              <benefit.icon className="h-8 w-8 text-ocean-light mb-4" />
              <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
              <p className="text-ocean-light text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ContactFormModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          serviceTitle={`Шопинг: ${selectedProduct.name}`}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
};

export default ShoppingService;