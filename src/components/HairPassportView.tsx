/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Check,
  ShieldCheck,
  MessageCircle,
  Send,
  Copy,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  getTelegramGuestName,
  buildTelegramMasterUrl,
  buildWhatsAppMasterUrl,
  openTelegramMasterChat,
  openExternalUrl,
  hapticSelection,
  hapticNotification
} from '../utils/telegram.ts';

interface HairPassportViewProps {
  onSelectCareById?: (careId: string) => void;
}

export const HairPassportView: React.FC<HairPassportViewProps> = ({ onSelectCareById }) => {
  const [clientName, setClientName] = useState<string>('');
  const [hairType, setHairType] = useState<string>('blonde');
  const [hairConcern, setHairConcern] = useState<string>('yellow_dry');
  const [hairLength, setHairLength] = useState<string>('medium');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const tgName = getTelegramGuestName();
    if (tgName) {
      setClientName((prev) => prev || tgName);
    }
  }, []);

  const getPrescription = () => {
    if (hairType === 'blonde') {
      return {
        careId: 'protein-merquat',
        careName: 'Белковая спа-реконструкция Merquat 280',
        salonRitual: '«Королевский шелк» (Airtouch Diamond) + Белковое насыщение Merquat 280',
        nextVisitWeeks: 'через 6 – 8 месяцев (тонирование через 2.5 – 3 месяца)',
        shampoo: 'SPA Master Rosa Damascena (мягкий бессульфатный pH 5.5)',
        treatmentMask: 'Keratin Intensive Therapy Mask — 1 раз в неделю на 10 мин',
        leaveInCare: 'Шелковые капли Silk Drop + термозащита до 220°C',
        proRule: 'Никогда не сушите влажный блонд горячим феном без термозащиты'
      };
    }
    if (hairType === 'gray') {
      return {
        careId: 'anti-age-gray-care',
        careName: 'Anti-Age спа-ритуал для седых волос (Silver Silk)',
        salonRitual: '«Шелковый бархат» (Anti-Age Care для седины) + Питание касторовым маслом',
        nextVisitWeeks: 'через 5 – 6 недель',
        shampoo: 'Питательный шампунь с аргановым маслом SPA Master Arganic Care',
        treatmentMask: 'Basic Mask pH 4.5 с эффектом запечатывания блеска',
        leaveInCare: 'Увлажняющий несмываемый двухфазный спрей Keratin Bi-Phase',
        proRule: 'Седине требуется постоянная влага: наносите несмываемый крем после каждого мытья'
      };
    }
    if (hairType === 'brunette') {
      return {
        careId: 'lipid-arganic',
        careName: 'Липидное спа-обертывание Arganic Gloss',
        salonRitual: '«Калифорнийское солнце» (Shatush Amber Glow) + Аргановое спа-обертывание',
        nextVisitWeeks: 'через 4 – 5 месяцев',
        shampoo: 'Шампунь для сохранения насыщенности темных оттенков Color Protect',
        treatmentMask: 'Аргановое спа-обертывание Arganic Gloss 1 раз в 10 дней',
        leaveInCare: 'Эликсир макадамии Elixir Vital на влажные кончики',
        proRule: 'Смывайте маску прохладной водой для зеркального закрытия чешуек'
      };
    }
    return {
      careId: hairConcern === 'mirror_shine' ? 'crystal-gloss-5d' : 'cold-botox',
      careName:
        hairConcern === 'mirror_shine'
          ? 'Кристальное 5D-глазирование без аммиака (Clear Gloss)'
          : 'Холодный ботокс для волос (Cold Botox Therapy)',
      salonRitual: '«Жидкое зеркало» (5D Crystal Glossing) + Холодный ботокс и плотный срез',
      nextVisitWeeks: 'через 2 – 2.5 месяца',
      shampoo: 'Увлажняющий шампунь с экстрактом розы Rosa Damascena',
      treatmentMask: 'Восстанавливающая маска с микропротеинами пшеницы',
      leaveInCare: 'Флюид для кончиков против сечения Silk Drops',
      proRule: 'Расчесывайте волосы только после нанесения несмываемого кондиционера'
    };
  };

  const prescription = getPrescription();

  const passportText =
    `Здравствуйте, Магдана! Вот мой Персональный Паспорт Волос:\n` +
    `• Гость: ${clientName || 'Прекрасная гостья'}\n` +
    `• Рекомендованный салонный ритуал: ${prescription.salonRitual}\n` +
    `• Интервал следующего визита: ${prescription.nextVisitWeeks}\n` +
    `• Домашний шампунь: ${prescription.shampoo}\n` +
    `• Интенсивная маска: ${prescription.treatmentMask}\n` +
    `• Несмываемый уход: ${prescription.leaveInCare}\n` +
    `• Главный совет Магданы: ${prescription.proRule}\n\n` +
    `Хочу записаться на этот ритуал!`;

  const handleCopy = () => {
    hapticNotification('success');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(passportText);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const telegramPassportUrl = buildTelegramMasterUrl(passportText);
  const whatsappPassportUrl = buildWhatsAppMasterUrl(passportText);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#2D2622]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#D9A773] mb-3">
            <FileText className="w-4 h-4" />
            <span>Индивидуальная карта заботы о ваших волосах</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#FAF6F0]">
            Электронный «Паспорт волос»
          </h2>
          <p className="text-sm text-[#A89F91] mt-2 max-w-2xl font-light">
            Интерактивная диагностика за 1 минуту: определите потребности ваших волос и получите персональный
            рецепт салонного ритуала и домашнего ухода от Магданы.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#D9A773] bg-[#221B18] px-3.5 py-2 rounded-xl border border-[#3C322C]">
          <ShieldCheck className="w-4 h-4" />
          <span>Персональный подбор без навязывания лишних средств</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Diagnostic Interactive Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border border-[#2D2622] bg-[#171412]">
          <h3 className="font-serif text-2xl font-medium text-[#FAF6F0] mb-2">
            Экспресс-диагностика волос
          </h3>
          <p className="text-xs text-[#A89F91] mb-6">
            Укажите ваши параметры, чтобы сформировать точный рецепт ухода
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-medium text-[#C8BFB2] mb-1.5">
                Ваше имя (как к вам обращаться):
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Например: Анастасия"
                className="w-full px-4 py-2.5 rounded-xl bg-[#13100F] border border-[#3A3029] text-[#FAF6F0] text-sm focus:border-[#D9A773] focus:outline-none"
              />
            </div>

            {/* Current Hair State */}
            <div>
              <label className="block text-xs font-medium text-[#C8BFB2] mb-2">
                Текущее состояние ваших волос:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'blonde', label: 'Осветленный блонд / мелирование' },
                  { id: 'brunette', label: 'Натуральные темные / шатен' },
                  { id: 'gray', label: 'С сединой (требуется плотность)' },
                  { id: 'damaged', label: 'Сухие, пушащиеся или ломкие' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setHairType(item.id);
                    }}
                    className={`p-3.5 min-h-[46px] text-left rounded-xl border text-xs transition-all ${
                      hairType === item.id
                        ? 'border-[#D9A773] bg-[#251D19] text-[#FAF6F0]'
                        : 'border-[#2E2621] bg-[#13100F] text-[#A89F91] hover:text-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{item.label}</span>
                      {hairType === item.id && (
                        <Check className="w-3.5 h-3.5 text-[#D9A773] shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Wish / Concern */}
            <div>
              <label className="block text-xs font-medium text-[#C8BFB2] mb-2">
                Что для вас сейчас важнее всего:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'yellow_dry', label: 'Убрать желтизну и сухость кончиков' },
                  { id: 'lived_in', label: 'Цвет, который отрастает незаметно до 8 месяцев' },
                  { id: 'mirror_shine', label: 'Максимальный зеркальный блеск и гладкость' },
                  { id: 'volume_cut', label: 'Плотный срез и объем без долгой укладки' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setHairConcern(item.id);
                    }}
                    className={`p-3.5 min-h-[46px] text-left rounded-xl border text-xs transition-all ${
                      hairConcern === item.id
                        ? 'border-[#D9A773] bg-[#251D19] text-[#FAF6F0]'
                        : 'border-[#2E2621] bg-[#13100F] text-[#A89F91] hover:text-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{item.label}</span>
                      {hairConcern === item.id && (
                        <Check className="w-3.5 h-3.5 text-[#D9A773] shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Length */}
            <div>
              <label className="block text-xs font-medium text-[#C8BFB2] mb-2">
                Длина волос:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short', label: 'До плеч / каре' },
                  { id: 'medium', label: 'По лопатки' },
                  { id: 'long', label: 'Ниже лопаток' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setHairLength(item.id);
                    }}
                    className={`py-2.5 px-2 min-h-[44px] text-center rounded-xl border text-xs transition-all ${
                      hairLength === item.id
                        ? 'border-[#D9A773] bg-[#251D19] text-[#D9A773] font-medium'
                        : 'border-[#2E2621] bg-[#13100F] text-[#A89F91]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: The Luxury Hair Passport Card */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
          <div className="p-5 sm:p-8 rounded-2xl border border-[#D9A773]/40 bg-gradient-to-b from-[#221B18] via-[#1A1513] to-[#141110] shadow-2xl relative overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3A3029] mb-6">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#D9A773] font-semibold block">
                  Magdana Gadzhieva · Hair &amp; color master
                </span>
                <h4 className="font-serif text-xl font-medium text-[#FAF6F0]">
                  Персональный паспорт волос
                </h4>
              </div>
              <div className="p-2 rounded-xl bg-[#2A211D] border border-[#3C322C] text-[#D9A773]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Guest Name & Greeting */}
            <div className="mb-6">
              <span className="text-[11px] text-[#8C8073] block mb-0.5">Владелец паспорта:</span>
              <div className="text-lg font-serif font-medium text-[#FAF6F0]">
                {clientName ? clientName : 'Прекрасная гостья'}
              </div>
            </div>

            {/* Prescribed Salon Ritual */}
            <div className="p-4 rounded-xl bg-[#161211] border border-[#2F2620] mb-4 space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D9A773] font-semibold block mb-1">
                  Рекомендованный ритуал в студии:
                </span>
                <div className="text-sm font-semibold text-[#FAF6F0] mb-1">
                  {prescription.salonRitual}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#A89F91]">
                  <Clock className="w-3.5 h-3.5 text-[#D9A773]" />
                  <span>Плановый визит: {prescription.nextVisitWeeks}</span>
                </div>
              </div>

              {onSelectCareById && (
                <button
                  type="button"
                  onClick={() => {
                    hapticSelection();
                    onSelectCareById(prescription.careId);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-[#241D18] hover:bg-[#D9A773] text-[#D9A773] hover:text-[#141211] border border-[#D9A773]/40 text-xs font-medium transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">Открыть паспорт: {prescription.careName}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>

            {/* Home Care Prescription */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-[#FAF6F0] font-semibold block">
                Персональный рецепт домашнего ухода:
              </span>

              <div className="p-3 rounded-xl bg-[#161211] border border-[#2F2620] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#D9A773] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-[#8C8073] block">Шампунь:</span>
                  <span className="text-[#FAF6F0] font-medium">{prescription.shampoo}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161211] border border-[#2F2620] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#D9A773] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-[#8C8073] block">Глубокая маска (1 раз в неделю):</span>
                  <span className="text-[#FAF6F0] font-medium">{prescription.treatmentMask}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161211] border border-[#2F2620] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#D9A773] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-[#8C8073] block">Несмываемая шелковая защита:</span>
                  <span className="text-[#FAF6F0] font-medium">{prescription.leaveInCare}</span>
                </div>
              </div>
            </div>

            {/* Master Pro Rule */}
            <div className="p-3.5 rounded-xl bg-[#201916] border border-[#382D25] text-xs text-[#C8BFB2] leading-relaxed mb-6">
              <strong className="text-[#D9A773]">Золотое правило Магданы: </strong>
              «{prescription.proRule}»
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <a
                href={telegramPassportUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openTelegramMasterChat(passportText, e)}
                className="w-full min-h-[48px] py-3 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#D9A773] to-[#B88554] text-[#141211] rounded-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md text-center"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Отправить паспорт Магдане в Telegram</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsappPassportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(whatsappPassportUrl, e)}
                  className="min-h-[44px] py-2.5 px-4 text-xs font-medium rounded-xl border border-[#25D366]/40 bg-[#161211] hover:border-[#25D366] text-[#25D366] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Отправить в WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[44px] px-4 py-2.5 text-xs font-medium rounded-xl border border-[#3C322C] bg-[#161211] hover:border-[#D9A773] text-[#FAF6F0] flex items-center justify-center gap-2 transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Паспорт скопирован' : 'Скопировать рецепт'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
