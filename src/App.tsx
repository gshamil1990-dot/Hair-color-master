/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Send,
  X,
  Calendar,
  ArrowUpRight,
  Home,
  Palette,
  Scissors,
  Sparkles,
  Layers
} from 'lucide-react';
import { HomeOverviewBlock } from './components/HomeOverviewBlock.tsx';
import { LookbookView, LookbookItem } from './components/LookbookView.tsx';
import { ClientHaircutGuide, ClientHaircut } from './components/ClientHaircutGuide.tsx';
import { CareSectionView, CareTreatment } from './components/CareSectionView.tsx';
import { HairstylesView, HairstyleItem } from './components/HairstylesView.tsx';
import { FooterConciergeBlock } from './components/FooterConciergeBlock.tsx';
import {
  initTelegramMiniApp,
  getTelegramWebApp,
  getTelegramGuestName,
  hapticSelection,
  hapticImpact,
  buildTelegramMasterUrl,
  buildWhatsAppMasterUrl,
  openTelegramMasterChat,
  openExternalUrl,
  MASTER_PHONE_DISPLAY,
  MASTER_PHONE_TEL
} from './utils/telegram.ts';
import { useAuth } from './context/AuthContext.tsx';

export type ActiveTab = 'overview' | 'coloring' | 'haircuts' | 'care' | 'hairstyles';

export interface BookingSelection {
  title: string;
  price?: string;
  wearTime?: string;
  category?: string;
}

const TAB_ORDER: ActiveTab[] = ['overview', 'coloring', 'haircuts', 'care', 'hairstyles'];

export default function App() {
  const { user, savedBookings, signInWithGoogle, saveBookingToCloud } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<BookingSelection | null>(null);
  const [telegramGuestName, setTelegramGuestName] = useState<string>('');

  // Инициализация Telegram Mini App SDK (авторазворот, цвета шапки #141211, имя гостьи)
  useEffect(() => {
    initTelegramMiniApp();
    const guest = getTelegramGuestName();
    if (guest) {
      setTelegramGuestName(guest);
    }
  }, []);

  // Системная кнопка «Назад» (BackButton) в шапке Telegram Mini App
  useEffect(() => {
    const tg = getTelegramWebApp();
    const backBtn = tg?.BackButton;
    if (!backBtn) return;

    const shouldShowBack = bookingModalOpen || activeTab !== 'overview';

    const handleTelegramBack = () => {
      hapticImpact('light');
      if (bookingModalOpen) {
        setBookingModalOpen(false);
        return;
      }
      if (activeTab !== 'overview') {
        setSlideDirection('left');
        setActiveTab('overview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    try {
      if (shouldShowBack) {
        backBtn.show();
        backBtn.onClick(handleTelegramBack);
      } else {
        backBtn.hide();
      }
    } catch {
      // Ignore on unsupported clients
    }

    return () => {
      try {
        backBtn.offClick(handleTelegramBack);
      } catch {
        // Ignore on unsupported clients
      }
    };
  }, [bookingModalOpen, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBookingModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateTab = (tab: ActiveTab) => {
    hapticSelection();
    if (tab !== activeTab) {
      const currentIdx = TAB_ORDER.indexOf(activeTab);
      const nextIdx = TAB_ORDER.indexOf(tab);
      setSlideDirection(nextIdx >= currentIdx ? 'right' : 'left');
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGeneralBooking = () => {
    hapticImpact('medium');
    setSelectedServiceForBooking(null);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithLook = (item: LookbookItem) => {
    hapticImpact('medium');
    setSelectedServiceForBooking({
      title: item.title,
      price: item.priceEstimate,
      wearTime: item.wearTime,
      category: 'Окрашивание / тонирование'
    });
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithHaircut = (haircut: ClientHaircut) => {
    hapticImpact('medium');
    setSelectedServiceForBooking({
      title: haircut.title,
      price: 'от 4 000 ₽',
      wearTime: haircut.wearPeriod,
      category: 'Стрижка «Умная форма»'
    });
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithCare = (care: CareTreatment) => {
    hapticImpact('medium');
    setSelectedServiceForBooking({
      title: care.title,
      price: care.price,
      wearTime: care.durability,
      category: 'Спа-реконструкция волос'
    });
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithHairstyle = (style: HairstyleItem) => {
    hapticImpact('medium');
    setSelectedServiceForBooking({
      title: style.title,
      price: style.price,
      wearTime: style.durability,
      category: 'Вечерняя укладка / прическа'
    });
    setBookingModalOpen(true);
  };

  const navItems: { key: ActiveTab; label: string }[] = [
    { key: 'overview', label: 'Главная' },
    { key: 'coloring', label: 'Окрашивание/тонирование' },
    { key: 'haircuts', label: 'Стрижки' },
    { key: 'care', label: 'Уход' },
    { key: 'hairstyles', label: 'Укладки/прически' }
  ];

  const tabAnimationClass =
    slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left';

  const guestGreetingPrefix = telegramGuestName ? `Здравствуйте, Магдана! Меня зовут ${telegramGuestName}. ` : 'Здравствуйте, Магдана! ';

  const bookingMessageText = selectedServiceForBooking
    ? `${guestGreetingPrefix}Хочу записаться на процедуру «${selectedServiceForBooking.title}»${
        selectedServiceForBooking.price ? ` (${selectedServiceForBooking.price})` : ''
      }. Подскажите, пожалуйста, доступные даты для визита.`
    : `${guestGreetingPrefix}Хочу записаться на консультацию и подбор процедуры (окрашивание / стрижка / реконструкция волос). Подскажите, пожалуйста, свободные окошки.`;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip flex flex-col bg-[#141211] text-[#EAE6DF] font-sans antialiased pb-24 lg:pb-0">
      {/* STRICT 3-ZONE TOP BAR CONTRACT (Mobile-First < 375px Safe) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#141211]/95 border-b border-[#26201C]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-8 min-w-0">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavigateTab('overview')}
            translate="no"
            className="notranslate font-serif text-sm sm:text-xl lg:text-2xl font-semibold tracking-wide sm:tracking-wider text-[#FAF6F0] hover:text-[#D9A773] transition-colors whitespace-nowrap truncate min-w-0 focus-visible:outline-none py-2"
          >
            MAGDANA GADZHIEVA
          </button>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav aria-label="Основная навигация" className="hidden lg:flex items-center gap-8 text-sm shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavigateTab(item.key)}
                  className={`py-2 transition-all duration-200 whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'border-[#D9A773] text-[#FAF6F0] font-medium'
                      : 'border-transparent text-[#A89F91] hover:text-[#FAF6F0] hover:border-[#4A3E36]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={handleOpenGeneralBooking}
              className="px-3 sm:px-5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[42px] text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-[#D9A773] hover:bg-[#E5BE8D] active:scale-[0.98] text-[#141211] rounded-lg transition-all whitespace-nowrap shrink-0"
            >
              Записаться
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT WORKSPACE — 5 STRICTLY ISOLATED BLOCKS WITH DIRECTIONAL SLIDE & GLOW TRANSITION */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-12 flex flex-col min-w-0 overflow-x-clip">
        <div
          key={`glow-${activeTab}`}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 h-[2px] bg-gradient-to-r from-transparent via-[#D9A773] to-transparent animate-tab-glow"
        />
        <div key={activeTab} className={`${tabAnimationClass} flex flex-col flex-1 w-full min-w-0`}>
          {activeTab === 'coloring' ? (
            <LookbookView onSelectLookForBooking={handleOpenBookingWithLook} />
          ) : activeTab === 'haircuts' ? (
            <ClientHaircutGuide onSelectHaircutForBooking={handleOpenBookingWithHaircut} />
          ) : activeTab === 'care' ? (
            <CareSectionView onSelectCareForBooking={handleOpenBookingWithCare} />
          ) : activeTab === 'hairstyles' ? (
            <HairstylesView onSelectHairstyleForBooking={handleOpenBookingWithHairstyle} />
          ) : (
            <HomeOverviewBlock
              onNavigateTab={handleNavigateTab}
              onOpenGeneralBooking={handleOpenGeneralBooking}
            />
          )}
        </div>
      </main>

      {/* LOCKED FOOTER & DIRECT CONCIERGE BLOCK */}
      <FooterConciergeBlock onNavigateTab={handleNavigateTab} />

      {/* MOBILE BOTTOM DOCK (<= 15% viewport height, safe-area aware) */}
      <nav
        aria-label="Мобильная навигация"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#141211]/95 backdrop-blur-xl border-t border-[#2C241F] px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={() => handleNavigateTab('overview')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 text-center ${
              activeTab === 'overview'
                ? 'text-[#D9A773] bg-[#221B17] font-medium -translate-y-0.5'
                : 'text-[#8C8276] hover:text-[#C8BFB2]'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] leading-[1.1]">Главная</span>
          </button>

          <button
            onClick={() => handleNavigateTab('coloring')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 text-center ${
              activeTab === 'coloring'
                ? 'text-[#D9A773] bg-[#221B17] font-medium -translate-y-0.5'
                : 'text-[#8C8276] hover:text-[#C8BFB2]'
            }`}
          >
            <Palette className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="text-[8.5px] sm:text-[10px] leading-[1.08]">
              Окрашивание/
              <br />
              тонирование
            </span>
          </button>

          <button
            onClick={() => handleNavigateTab('haircuts')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 text-center ${
              activeTab === 'haircuts'
                ? 'text-[#D9A773] bg-[#221B17] font-medium -translate-y-0.5'
                : 'text-[#8C8276] hover:text-[#C8BFB2]'
            }`}
          >
            <Scissors className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] leading-[1.1]">Стрижки</span>
          </button>

          <button
            onClick={() => handleNavigateTab('care')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 text-center ${
              activeTab === 'care'
                ? 'text-[#D9A773] bg-[#221B17] font-medium -translate-y-0.5'
                : 'text-[#8C8276] hover:text-[#C8BFB2]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] leading-[1.1]">Уход</span>
          </button>

          <button
            onClick={() => handleNavigateTab('hairstyles')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 text-center ${
              activeTab === 'hairstyles'
                ? 'text-[#D9A773] bg-[#221B17] font-medium -translate-y-0.5'
                : 'text-[#8C8276] hover:text-[#C8BFB2]'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5 shrink-0" />
            <span className="text-[8.5px] sm:text-[10px] leading-[1.08]">
              Укладки/
              <br />
              прически
            </span>
          </button>
        </div>
      </nav>

      {/* MODAL: Quick Concierge Booking (Mobile Bottom Sheet / Desktop Modal) */}
      {bookingModalOpen && (
        <div
          onClick={() => setBookingModalOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-[#1B1715] border-t sm:border border-[#3C322C] rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="w-10 h-1 rounded-full bg-[#3C322C] mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#D9A773]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {telegramGuestName ? `Индивидуальный визит · ${telegramGuestName}` : 'Индивидуальный визит'}
                </span>
              </div>
              <button
                onClick={() => {
                  hapticImpact('light');
                  setBookingModalOpen(false);
                }}
                aria-label="Закрыть окно записи"
                className="p-1.5 rounded-lg text-[#8C8276] hover:text-[#EAE6DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif text-2xl font-normal text-[#FAF6F0] mb-2">
              Запись к Магдане Гаджиевой
            </h3>
            <p className="text-xs text-[#A89F91] mb-5">
              Индивидуальная консультация, детальный анализ структуры волос и подбор формулы.
            </p>

            {selectedServiceForBooking && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#141110] border border-[#2E2620]">
                <div className="text-[11px] text-[#D9A773] mb-0.5">
                  {selectedServiceForBooking.category || 'Выбранная программа'}
                </div>
                <div className="font-serif text-base sm:text-lg text-[#FAF6F0]">
                  {selectedServiceForBooking.title}
                </div>
                <div className="text-xs text-[#A89F91] font-mono tabular-nums mt-0.5">
                  {selectedServiceForBooking.price}
                  {selectedServiceForBooking.wearTime ? ` · ${selectedServiceForBooking.wearTime}` : ''}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {/* Primary Telegram CTA with pre-filled service message */}
              <a
                href={buildTelegramMasterUrl(bookingMessageText)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (user) {
                    void saveBookingToCloud({
                      serviceTitle: selectedServiceForBooking?.title || 'Индивидуальная консультация',
                      serviceCategory: selectedServiceForBooking?.category || 'Запись к мастеру',
                      servicePrice: selectedServiceForBooking?.price || 'По запросу',
                      wearTime: selectedServiceForBooking?.wearTime,
                      contactChannel: 'telegram',
                    });
                  }
                  openTelegramMasterChat(bookingMessageText, e);
                }}
                className="flex items-center justify-between p-4 rounded-xl border border-[#2AABEE]/45 bg-[#2AABEE]/12 text-[#FAF6F0] hover:bg-[#2AABEE]/20 hover:border-[#2AABEE] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Send className="w-5 h-5 text-[#2AABEE] shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-sm font-semibold text-[#FAF6F0]">
                      Написать в Telegram (@Magdana_Stilist)
                    </div>
                    <div className="text-xs text-[#A89F91] truncate">
                      {selectedServiceForBooking
                        ? 'Откроется чат с уже готовым текстом выбранной услуги'
                        : 'Прямой чат с мастером в Telegram'}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#2AABEE] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Secondary WhatsApp CTA with pre-filled service message */}
              <a
                href={buildWhatsAppMasterUrl(bookingMessageText)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (user) {
                    void saveBookingToCloud({
                      serviceTitle: selectedServiceForBooking?.title || 'Индивидуальная консультация',
                      serviceCategory: selectedServiceForBooking?.category || 'Запись к мастеру',
                      servicePrice: selectedServiceForBooking?.price || 'По запросу',
                      wearTime: selectedServiceForBooking?.wearTime,
                      contactChannel: 'whatsapp',
                    });
                  }
                  openExternalUrl(buildWhatsAppMasterUrl(bookingMessageText), e);
                }}
                className="flex items-center justify-between p-4 rounded-xl border border-[#25D366]/35 bg-[#141110] text-[#25D366] hover:bg-[#25D366]/10 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-sm font-semibold">Написать в WhatsApp</div>
                    <div className="text-xs text-[#A89F91] truncate">
                      {selectedServiceForBooking
                        ? 'Отправить заявку с выбранной процедурой в WhatsApp'
                        : 'Быстрый ответ мастера и подбор удобного времени'}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Direct Phone Call */}
              <a
                href={MASTER_PHONE_TEL}
                onClick={() => hapticImpact('light')}
                className="flex items-center justify-between p-4 rounded-xl border border-[#3C322C] bg-[#141110] text-[#FAF6F0] hover:border-[#D9A773] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#D9A773] shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">Позвонить по телефону</div>
                    <div className="text-xs text-[#A89F91] font-mono tabular-nums">{MASTER_PHONE_DISPLAY}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#D9A773] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {user ? (
              savedBookings.length > 0 && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#141110] border border-[#2E2620]">
                  <div className="text-[11px] font-medium text-[#D9A773] mb-2">
                    История ваших обращений ({savedBookings.length})
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {savedBookings.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs text-[#C8BFB2] py-1 border-b border-[#241E1A] last:border-b-0"
                      >
                        <span className="truncate pr-2">{item.serviceTitle}</span>
                        <span className="text-[11px] text-[#8C8276] font-mono tabular-nums shrink-0">
                          {item.servicePrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="mb-5 flex items-center justify-between gap-3 p-3 rounded-xl bg-[#141110] border border-[#2E2620]">
                <span className="text-xs text-[#A89F91]">
                  Войдите, чтобы сохранять историю записей и Паспорт волос в профиле
                </span>
                <button
                  type="button"
                  onClick={() => {
                    hapticImpact('light');
                    void signInWithGoogle();
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-[#D9A773]/40 bg-[#D9A773]/10 text-[#FAF6F0] hover:bg-[#D9A773]/20 text-xs font-medium transition-colors"
                >
                  Войти
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-[#2E2620] text-xs text-[#A89F91] leading-relaxed">
              Прием в студии ведется по предварительной записи. Выберите удобный способ связи — Магдана поможет подобрать точную формулу под ваши волосы.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
