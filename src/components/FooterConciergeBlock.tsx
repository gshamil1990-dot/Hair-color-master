/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * [LOCKED MODULE: БЛОК «ПРЯМАЯ СВЯЗЬ С МАСТЕРОМ» И ФУТЕР]
 * Чистая версия для Telegram Mini App без блоков скачивания внешних HTML-файлов.
 */

import React from 'react';
import { Phone, MessageCircle, Send, Instagram, ArrowUpRight } from 'lucide-react';
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

interface FooterConciergeBlockProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const FooterConciergeBlock: React.FC<FooterConciergeBlockProps> = ({ onNavigateTab }) => {
  const defaultGreeting =
    'Здравствуйте, Магдана! Пишу вам из мини-приложения студии. Хочу записаться на консультацию.';

  const maxMessengerUrl =
    'https://max.ru/u/f9LHodD0cOJkpADtBmufbJfoyFTn_nwvPxdB95o3WT4G_S3CrIuhE3UuNWM';
  const instagramUrl = 'https://instagram.com/magdana_stilist';

  return (
    <footer className="mt-auto border-t border-[#26201D] bg-[#110F0E] text-[#8C8276] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1F1A17]">
          {/* Brand & Craftsmanship */}
          <div className="md:col-span-5 space-y-3">
            <div className="font-serif text-xl font-semibold text-[#FAF6F0] tracking-wide">
              MAGDANA GADZHIEVA
            </div>
            <div className="text-xs text-[#D9A773]">
              Hair &amp; color master
            </div>
            <p className="text-xs text-[#A89F91] leading-relaxed max-w-sm font-light">
              Сложные авторские техники окрашивания, белковая реконструкция волос препаратами SPA Master,
              персональные рецептуры и точные геометрические стрижки.
            </p>
            <div className="pt-2 text-xs text-[#8C8276]">
              Прием ведется исключительно по предварительной записи
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold text-[#EAE6DF] mb-3">
              Разделы студии
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigateTab('overview')} className="hover:text-[#D9A773] transition-colors">
                  Главная
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('coloring')} className="hover:text-[#D9A773] transition-colors">
                  01. Окрашивание/тонирование (26)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('haircuts')} className="hover:text-[#D9A773] transition-colors">
                  02. Стрижки (20 форм)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('care')} className="hover:text-[#D9A773] transition-colors">
                  03. Уход и Паспорт волос (12)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('hairstyles')} className="hover:text-[#D9A773] transition-colors">
                  04. Укладки/прически (25)
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Concierge (Socials & Contacts) */}
          <div className="md:col-span-4 space-y-3 min-w-0">
            <div className="text-xs font-semibold text-[#EAE6DF]">
              Прямая связь с мастером
            </div>

            <div className="space-y-2 text-xs">
              <a
                href={MASTER_PHONE_TEL}
                onClick={() => hapticImpact('light')}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-[#2B231E] bg-[#171311] hover:border-[#D9A773] text-[#FAF6F0] transition-colors"
              >
                <span className="inline-flex items-center gap-2 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#D9A773] shrink-0" />
                  <span>{MASTER_PHONE_DISPLAY}</span>
                </span>
                <span className="text-[#A89F91]">Звонок</span>
              </a>

              <a
                href={buildWhatsAppMasterUrl(defaultGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openExternalUrl(buildWhatsAppMasterUrl(defaultGreeting), e)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-[#2B231E] bg-[#171311] hover:border-[#25D366]/60 text-[#EAE6DF] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>WhatsApp</span>
                </span>
                <span className="text-[#A89F91]">Консультация по фото</span>
              </a>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={buildTelegramMasterUrl(defaultGreeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openTelegramMasterChat(defaultGreeting, e)}
                  className="flex items-center justify-between min-h-[42px] py-2.5 px-2.5 rounded-xl border border-[#2B231E] bg-[#171311] hover:border-[#2AABEE]/70 hover:bg-[#1B1714] text-[#EAE6DF] transition-colors min-w-0"
                >
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Send className="w-3.5 h-3.5 text-[#2AABEE] shrink-0" />
                    <span className="truncate font-medium">Telegram</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[#8C8276] shrink-0" />
                </a>

                <a
                  href={maxMessengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(maxMessengerUrl, e)}
                  className="flex items-center justify-between min-h-[42px] py-2.5 px-2.5 rounded-xl border border-[#2B231E] bg-[#171311] hover:border-[#D9A773]/70 hover:bg-[#1B1714] text-[#EAE6DF] transition-colors min-w-0"
                >
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-md bg-[#D9A773]/20 border border-[#D9A773]/40 text-[#D9A773] text-[9px] font-bold flex items-center justify-center shrink-0">
                      M
                    </span>
                    <span className="truncate font-medium">MAX</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[#8C8276] shrink-0" />
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(instagramUrl, e)}
                  className="flex items-center justify-between min-h-[42px] py-2.5 px-2.5 rounded-xl border border-[#2B231E] bg-[#171311] hover:border-[#E1306C]/70 hover:bg-[#1B1714] text-[#EAE6DF] transition-colors min-w-0"
                >
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                    <span className="truncate font-medium">Instagram</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[#8C8276] shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E645A]">
          <p>© {new Date().getFullYear()} Magdana Gadzhieva · Hair &amp; color master. Все права защищены.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Конфиденциальность 152-ФЗ</span>
            <span aria-hidden="true">·</span>
            <span>Протоколы SPA Master Professional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
