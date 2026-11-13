/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * [LOCKED MODULE: БЛОК 1 — ГЛАВНАЯ СТРАНИЦА]
 * Забетонированный блок главного экрана. Не изменять при правках внутренних разделов услуг.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Maximize2, X } from 'lucide-react';
import type { ActiveTab } from '../App.tsx';
import {
  buildTelegramMasterUrl,
  buildWhatsAppMasterUrl,
  openTelegramMasterChat,
  openExternalUrl,
  hapticImpact,
  MASTER_PHONE_DISPLAY,
  MASTER_PHONE_TEL
} from '../utils/telegram.ts';

import heroAtelierBlondeImg from '../assets/images/hero_atelier_blonde_1794346479355.jpg';
import pillarColoringImg from '../assets/images/pillar_coloring_airtouch_1794346481129.jpg';
import pillarHaircutImg from '../assets/images/pillar_precision_haircut_1794346482853.jpg';
import pillarCareImg from '../assets/images/pillar_spa_reconstruction_1794346484806.jpg';
import pillarHairstylesImg from '../assets/images/pillar_evening_waves_1794346485158.jpg';

interface LightboxMedia {
  src: string;
  title: string;
  subtitle: string;
  meta: string;
  tabTarget: ActiveTab;
}

const STUDIO_PILLARS: {
  index: string;
  tab: ActiveTab;
  title: string;
  meta: string;
  description: string;
  cta: string;
  image: string;
}[] = [
  {
    index: '01',
    tab: 'coloring',
    title: 'Окрашивание / тонирование',
    meta: '26 техник · Носка 5–9 месяцев',
    description:
      'Многомерный AirTouch, скандинавская платина, кашемировый блонд и рельефный шатуш с защитой кортекса на молекулярном уровне.',
    cta: 'Открыть атлас оттенков',
    image: pillarColoringImg
  },
  {
    index: '02',
    tab: 'haircuts',
    title: 'Стрижки',
    meta: '20 форм · Укладка за 3–5 минут',
    description:
      'Точный геометрический срез по природному распаду прядей: плотный боб, воздушные слои «Бабочка» и каскадный контуринг у лица.',
    cta: 'Подобрать форму стрижки',
    image: pillarHaircutImg
  },
  {
    index: '03',
    tab: 'care',
    title: 'Уход',
    meta: '12 протоколов · SPA Master pH 4.5',
    description:
      'Белковое протезирование Merquat 280, аргановые липидные ванны, 5D-глянцевание и персональный электронный Паспорт волос.',
    cta: 'Диагностика и спа-меню',
    image: pillarCareImg
  },
  {
    index: '04',
    tab: 'hairstyles',
    title: 'Укладки / прически',
    meta: '25 образов · Стойкость до 36 часов',
    description:
      'Синхронная голливудская волна, европейские текстурные пучки, зеркальные хвосты и подвижная фиксация без эффекта склеивания.',
    cta: 'Смотреть коллекцию укладок',
    image: pillarHairstylesImg
  }
];

const HERO_IMAGE = heroAtelierBlondeImg;

interface HomeOverviewBlockProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenGeneralBooking: () => void;
}

export const HomeOverviewBlock: React.FC<HomeOverviewBlockProps> = ({
  onNavigateTab,
  onOpenGeneralBooking
}) => {
  const [lightboxMedia, setLightboxMedia] = useState<LightboxMedia | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <div className="space-y-12 sm:space-y-16 w-full min-w-0">
      {/* SPLIT-SCREEN EDITORIAL HERO + FULL-WIDTH PROOF STRIP */}
      <section className="w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch min-w-0">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-[#2A231E] bg-[#181513] p-5 sm:p-10 lg:p-12 min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#D9A773] tracking-wide mb-4 sm:mb-5">
                <span>Hair &amp; color master</span>
                <span aria-hidden="true">·</span>
                <span>Топ-стилист Магдана Гаджиева</span>
              </div>

              <h1
                className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#FAF6F0] mb-5 sm:mb-6 leading-[1.14]"
                style={{ textWrap: 'balance' }}
              >
                Многомерный сияющий блонд, шелковая реконструкция и стрижки, которые держат форму сами
              </h1>

              <p className="text-sm sm:text-base text-[#B5ABA0] mb-6 sm:mb-8 leading-relaxed font-light max-w-2xl">
                Бережное осветление без повреждения структуры, белковое наполнение кортекса препаратами SPA Master и индивидуальная геометрия среза. Плавное отрастание цвета от 5 до 9 месяцев без резких границ.
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6 pt-4 border-t border-[#26201C] min-w-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={onOpenGeneralBooking}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 min-h-[46px] text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#D9A773] hover:bg-[#E5BE8D] text-[#141211] rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Записаться к Магдане</span>
                </button>

                <button
                  onClick={() => onNavigateTab('coloring')}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 min-h-[46px] text-xs sm:text-sm font-medium border border-[#3A3029] hover:border-[#D9A773] text-[#FAF6F0] hover:text-[#D9A773] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Атлас окрашиваний (26)</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#A89F91]">
                <a
                  href="tel:89281013204"
                  className="hover:text-[#D9A773] transition-colors font-mono tabular-nums"
                >
                  8 (928) 101-32-04
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://wa.me/79281013204"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  Консультация в WhatsApp
                </a>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => onNavigateTab('care')}
                  className="text-[#D9A773] hover:underline"
                >
                  Онлайн-диагностика «Паспорт волос»
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Showcase Visual */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#2A231E] bg-[#181513] min-h-[360px] sm:min-h-[420px] flex flex-col justify-end group">
            {!failedImages[HERO_IMAGE] ? (
              <img
                src={HERO_IMAGE}
                alt="Сияющий многомерный блонд AirTouch — Магдана Гаджиева, Hair & color master"
                referrerPolicy="no-referrer"
                onError={() => handleImageError(HERO_IMAGE)}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B211A] via-[#1C1613] to-[#120F0E]" />
            )}

            {/* Measured Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141211] via-[#141211]/45 to-transparent" />

            {/* Lightbox Trigger */}
            <button
              onClick={() =>
                setLightboxMedia({
                  src: HERO_IMAGE,
                  title: 'AirTouch Champagne & Шелковая реконструкция',
                  subtitle: 'Фирменная выдувная техника с плавным отрастанием до 9 месяцев',
                  meta: 'Окрашивание · 4.5–6 часов · Защита кортекса Merquat 280',
                  tabTarget: 'coloring'
                })
              }
              aria-label="Увеличить фотографию работы"
              className="absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-[#141211]/75 backdrop-blur-md border border-[#3A3029] text-[#EAE6DF] hover:text-[#D9A773] hover:border-[#D9A773] transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Caption Content Over Scrim */}
            <div className="relative z-10 p-6 sm:p-8">
              <div className="text-xs text-[#E5BE8D] mb-1.5">
                Фирменный почерк студии · AirTouch Champagne
              </div>
              <h2 className="font-serif text-2xl text-[#FAF6F0] font-normal mb-2">
                Эффект живого шелкового полотна без пересушенных кончиков
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs text-[#C8BFB2]">
                <span className="tabular-nums">Срок носки: 6–9 месяцев</span>
                <button
                  onClick={() => onNavigateTab('coloring')}
                  className="text-[#D9A773] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Подобрать свой тон</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Row Below Hero Split */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-[#26201C]">
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-[#FAF6F0] tabular-nums">
              26 техник
            </div>
            <div className="text-xs text-[#A89F91] mt-1">
              От вуального AirTouch и шитья седины до кислотного 5D-глянцевания
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl sm:text-3xl text-[#FAF6F0] tabular-nums">
              6–9 месяцев
            </div>
            <div className="text-xs text-[#A89F91] mt-1">
              Комфортное отрастание блонда без четкой полосы у корней
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl sm:text-3xl text-[#FAF6F0] tabular-nums">
              3–5 минут
            </div>
            <div className="text-xs text-[#A89F91] mt-1">
              Ежедневная сушка феном за счет анатомической геометрии среза
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl sm:text-3xl text-[#FAF6F0] tabular-nums">
              pH 4.5 · SPA Master
            </div>
            <div className="text-xs text-[#A89F91] mt-1">
              Белковая защита Merquat 280 и липидный уход на каждом этапе
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA-FIRST 4 PILLARS COLLECTION GRID */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#26201C]">
          <div>
            <div className="text-xs text-[#D9A773] mb-1.5">
              Направления работы студии
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FAF6F0]">
              Выберите раздел для подбора образа и протокола
            </h2>
          </div>
          <div className="text-xs text-[#A89F91] tabular-nums">
            83 авторские программы в 4 категориях
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STUDIO_PILLARS.map((pillar) => (
            <article
              key={pillar.tab}
              onClick={() => onNavigateTab(pillar.tab)}
              className="cursor-pointer group rounded-2xl border border-[#2A231E] bg-[#181513] overflow-hidden hover:border-[#D9A773]/60 transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Media Container (65% visual height weight) */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1D1815]">
                {!failedImages[pillar.image] ? (
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(pillar.image)}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2A211B] to-[#151210]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-transparent to-black/25" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxMedia({
                      src: pillar.image,
                      title: pillar.title,
                      subtitle: pillar.description,
                      meta: pillar.meta,
                      tabTarget: pillar.tab
                    });
                  }}
                  aria-label={`Увеличить изображение: ${pillar.title}`}
                  className="absolute top-3.5 right-3.5 p-2 rounded-lg bg-[#141211]/75 backdrop-blur-md border border-[#3A3029] text-[#EAE6DF] hover:text-[#D9A773] transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A89F91] tabular-nums mb-2">
                    <span className="font-mono text-[#D9A773]">{pillar.index}.</span>
                    <span>{pillar.meta}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-[#FAF6F0] group-hover:text-[#D9A773] transition-colors mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed font-light mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#241E1A] flex items-center justify-between text-xs font-medium text-[#D9A773]">
                  <span>{pillar.cta}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL FOR HOME EDITORIAL PHOTOGRAPHY */}
      {lightboxMedia && (
        <div
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl border border-[#3A3029] bg-[#181513] overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full bg-[#120F0E]">
              <img
                src={lightboxMedia.src}
                alt={lightboxMedia.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLightboxMedia(null)}
                aria-label="Закрыть просмотр"
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#141211]/80 text-[#FAF6F0] hover:text-[#D9A773] border border-[#3A3029] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#D9A773] mb-1">{lightboxMedia.meta}</div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#FAF6F0]">{lightboxMedia.title}</h3>
                <p className="text-xs text-[#A89F91] mt-1">{lightboxMedia.subtitle}</p>
              </div>
              <button
                onClick={() => {
                  const target = lightboxMedia.tabTarget;
                  setLightboxMedia(null);
                  onNavigateTab(target);
                }}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#D9A773] hover:bg-[#E5BE8D] text-[#141211] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Перейти в раздел
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
