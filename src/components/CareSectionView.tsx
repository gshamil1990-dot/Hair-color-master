/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Send,
  Droplets,
  Search
} from 'lucide-react';
import { HairPassportView } from './HairPassportView.tsx';
import {
  buildTelegramMasterUrl,
  openTelegramMasterChat,
  hapticSelection
} from '../utils/telegram.ts';

export type CareFilterCategory = 'all' | 'reconstruction' | 'hydration' | 'gloss' | 'scalp';

export interface CareTreatment {
  id: string;
  title: string;
  subtitle: string;
  filterCategory: CareFilterCategory;
  categoryLabel: string;
  price: string;
  duration: string;
  durability: string;
  badge: string;
  visualEffect: string;
  description: string;
  steps: string[];
  recommendedFor: string;
  activeIngredients: string;
}

export const CARE_FILTER_BUTTONS: { key: CareFilterCategory; label: string }[] = [
  { key: 'all', label: 'Все программы' },
  { key: 'reconstruction', label: 'Реконструкция блонда' },
  { key: 'hydration', label: 'Увлажнение & Липиды' },
  { key: 'gloss', label: 'Зеркальный глянец' },
  { key: 'scalp', label: 'Кожа головы & Детокс' }
];

export const CARE_TREATMENTS: CareTreatment[] = [
  // --- 1. РЕКОНСТРУКЦИЯ & СПАСЕНИЕ БЛОНДА ---
  {
    id: 'protein-merquat',
    title: 'Белковая спа-реконструкция Merquat 280',
    subtitle: 'Молекулярное заполнение пустот кортекса после обесцвечивания',
    filterCategory: 'reconstruction',
    categoryLabel: 'Реконструкция блонда',
    price: 'от 4 500 ₽',
    duration: '1.5 часа',
    durability: 'Эффект держится 4 – 6 недель',
    badge: 'Спасение ломкого блонда',
    visualEffect: 'Волосы мгновенно перестают обламываться на концах, исчезает "эффект жвачки" при мытье, появляется плотность, монолитность и здоровый упругий вес.',
    description:
      'Интенсивная терапия для волос, пострадавших от регулярного осветления, утюжков или солнца. Препарат с катионным полимером Merquat 280 и гидролизованным шелком проникает в глубинные слои волоса, восстанавливая утраченные белковые цепочки.',
    steps: [
      'Мягкое детокс-очищение шампунем SPA Master Rosa Damascena с нейтральным pH',
      'Нанесение концентрированной белковой сыворотки под термоколпак с мягким теплом',
      'Запечатывание липидной маской с кислым pH 4.5 для закрытия кутикулы',
      'Укладка феном с защитным шелковым флюидом без перегрева'
    ],
    recommendedFor: 'Осветленные, ломкие, пушащиеся волосы, потерявшие плотность и силу',
    activeIngredients: 'Катионный полимер Merquat 280, гидролизованный протеин пшеницы, аминокислоты шелка'
  },
  {
    id: 'cold-botox',
    title: 'Холодный ботокс для волос (Cold Botox Therapy)',
    subtitle: 'Аминокислотное разглаживание и уплотнение без утюжка и формальдегида',
    filterCategory: 'reconstruction',
    categoryLabel: 'Реконструкция блонда',
    price: 'от 4 800 ₽',
    duration: '1.5 – 2 часа',
    durability: 'Эффект 5 – 7 недель',
    badge: 'Упругость и гладкость',
    visualEffect: 'Полное устранение пушистости и пористости. Волосы струятся шелковым полотном, легко расчесываются пальцами и не электризуются под одеждой.',
    description:
      'Безопасная холодная процедура без термического запекания утюжком. Коктейль из гиалуроновой кислоты, коллагена и пантенола запечатывается в волосе ультразвуковым инфракрасным методом.',
    steps: [
      'Хелатное мытье для глубокого очищения пор волоса',
      'Попрядное нанесение коллагеново-ботоксной эмульсии',
      'Проработка прядей ультразвуковыми холодными щипцами для глубокого проникновения',
      'Ополаскивание и легкая салонная укладка с блеском'
    ],
    recommendedFor: 'Сухие, пушащиеся, пористые и непослушные волосы, реагирующие на дождь и влажность',
    activeIngredients: 'Гиалуроновая кислота, растительный коллаген, пантенол, масло зародышей пшеницы'
  },
  {
    id: 'keraplasty-repair',
    title: 'Керапластика глубокого действия (Keraplasty Intense)',
    subtitle: 'Возвращение упругости и эластичности истонченным прядям',
    filterCategory: 'reconstruction',
    categoryLabel: 'Реконструкция блонда',
    price: 'от 5 000 ₽',
    duration: '1.5 часа',
    durability: 'Эффект до 6 недель',
    badge: 'Ударная доза кератина',
    visualEffect: 'Каждый волосок утолщается на 15–20%. Прическа становится заметно гуще на ощупь, концы перестают сечься и путаться в узелки.',
    description:
      'Глубокая гидролизация волоса натуральным микро-кератином. Молекулы кератина связываются с поврежденной структурой волоса, укрепляя каркас от корней до кончиков.',
    steps: [
      'Очищение волос восстанавливающим спа-шампунем',
      'Насыщение ампульным био-кератином по зонам повышенного повреждения',
      'Паровая баня горячим полотенцем для максимальной абсорбции',
      'Закрытие кутикулы стабилизатором блеска'
    ],
    recommendedFor: 'Тонкие, истонченные волосы, поврежденные частыми горячими укладками',
    activeIngredients: 'Натуральный гидролизованный кератин, экстракт бамбука, витамин E'
  },
  {
    id: 'cauterization-bamboo',
    title: 'Термо-каутеризация био-бамбуком (Bamboo Cautery)',
    subtitle: 'Запаивание питательных веществ в кортекс для зеркального щита',
    filterCategory: 'reconstruction',
    categoryLabel: 'Реконструкция блонда',
    price: 'от 5 500 ₽',
    duration: '2 часа',
    durability: 'Эффект до 2 месяцев',
    badge: 'Максимальная защита',
    visualEffect: 'Волосы приобретают тяжелый, напитанный и зеркально гладкий вид, как после салонного ламинирования, при этом сохраняют природный объем.',
    description:
      'Элитная спа-процедура для глубокой герметизации стержня волоса с экстрактом сердцевины бамбука, богатого природным кремнием.',
    steps: [
      'Деликатное очищение и пилинг стержня волоса',
      'Пропитка бамбуковым био-концентратом',
      'Мягкая термо-активация состава на контролируемой температуре',
      'Запечатывание защитной дышащей мембраной'
    ],
    recommendedFor: 'Очень сухие, поврежденные химическими процедурами и солнцем волосы',
    activeIngredients: 'Био-кремний бамбука, фосфолипиды, растительные керамиды'
  },

  // --- 2. ГЛУБОКОЕ УВЛАЖНЕНИЕ & ЛИПИДЫ ---
  {
    id: 'lipid-arganic',
    title: 'Липидное спа-обертывание Arganic Gloss',
    subtitle: 'Насыщение драгоценными маслами арганы и макадамии для шелковой мягкости',
    filterCategory: 'hydration',
    categoryLabel: 'Увлажнение & Липиды',
    price: 'от 3 800 ₽',
    duration: '1 час',
    durability: 'Эффект до 4 недель',
    badge: 'Шелковая мягкость',
    visualEffect: 'Жесткие, сухие волосы становятся бархатными и мягкими, как у ребенка. Локоны струятся сквозь пальцы без заломов и сухости.',
    description:
      'Спа-ванна для сухих, жестких и обезвоженных волос. Масла арганы и макадамии холодного отжима восполняют нехватку естественных липидов, возвращая волосам эластичность.',
    steps: [
      'Арома-массаж головы с теплыми питательными маслами в мойке',
      'Глубокое спа-обертывание горячим компрессом',
      'Финишное контрастное закрытие чешуек кутикулы',
      'Салонная экспресс-укладка с живым блеском'
    ],
    recommendedFor: 'Жесткие, сухие, волнистые или кудрявые волосы, лишенные мягкости и блеска',
    activeIngredients: 'Масло арганы первого отжима, масло макадамии, омега-3 и омега-6 кислоты'
  },
  {
    id: 'collagen-plump',
    title: 'Коллагеновое био-наполнение (Collagen Hydration)',
    subtitle: 'Глубокое удержание влаги внутри волоса для упругости и рассыпчатости',
    filterCategory: 'hydration',
    categoryLabel: 'Увлажнение & Липиды',
    price: 'от 4 200 ₽',
    duration: '1 час 15 мин',
    durability: 'Эффект 4 – 5 недель',
    badge: 'Аква-баланс',
    visualEffect: 'Ощущение прохладного, напитанного влагой волоса. Исчезает хруст на кончиках при сжатии, волосы пружинят и двигаются с живой пластикой.',
    description:
      'Интенсивная гидро-терапия. Морской коллаген создает вокруг каждого волоса дышащую микросетку, которая удерживает молекулы воды и защищает от пересушивания феном.',
    steps: [
      'Очищение увлажняющим шампунем с алоэ вера',
      'Нанесение коллагенового гелевого концентрата',
      'Выдержка под влажным теплым паром 20 минут',
      'Легкое кондиционирование и шелковая сушка'
    ],
    recommendedFor: 'Обезвоженные, тусклые волосы после лета, морской соли или отопительного сезона',
    activeIngredients: 'Морской коллаген, гидролат дамасской розы, сок листьев алоэ вера'
  },
  {
    id: 'curly-spa',
    title: 'Спа-ритуал для вьющихся волос (Curly Method Spa)',
    subtitle: 'Формирование очерченного упругого завитка без утяжеления',
    filterCategory: 'hydration',
    categoryLabel: 'Увлажнение & Липиды',
    price: 'от 4 500 ₽',
    duration: '1.5 часа',
    durability: 'Эффект до 4 недель',
    badge: 'Идеальные кудри',
    visualEffect: 'Бесформенный пух превращается в красивые, очерченные, упругие пружинки и шелковые локоны без эффекта склеенности или липкости.',
    description:
      'Специализированный уход по правилам Curly Girl Method. Полное отсутствие силиконов и сульфатов: только чистые масла, протеины и растительные экстракты.',
    steps: [
      'Бессульфатное ко-вошинг очищение с массажем скальпа',
      'Глубокое пропитывание кудрей маской методом "squish to condish"',
      'Бережное отжимание шелковым полотенцем',
      'Сушка насадкой-диффузором с фиксацией мягкого завитка'
    ],
    recommendedFor: 'Натуральные кудри, пушистые волны, пористые завитки, склонные к спутыванию',
    activeIngredients: 'Масло ши, протеины шелка, экстракт семян льна, масло жожоба'
  },

  // --- 3. ЗЕРКАЛЬНЫЙ ГЛЯНЕЦ & БЛЕСК ---
  {
    id: 'crystal-gloss-5d',
    title: 'Кристальное 5D-глазирование без аммиака (Clear Gloss)',
    subtitle: 'Эффект зеркального полотна и защита цвета без изменения тона',
    filterCategory: 'gloss',
    categoryLabel: 'Зеркальный глянец',
    price: 'от 4 000 ₽',
    duration: '1 час',
    durability: 'Гладкость до 1 месяца',
    badge: 'Зеркальный блеск',
    visualEffect: 'Волосы отражают свет как зеркало. Кончики выглядят запаянными и гладкими, прическа выглядит безупречно ухоженно даже без укладочных средств.',
    description:
      'Бесцветный полимерный глянец покрывает каждый волосок невидимой защитной вуалью. Волосы перестают пушиться от дождя, усиливается сочность родного или окрашенного цвета.',
    steps: [
      'Очищение кутикулы от внешних загрязнений и остатков стайлинга',
      'Нанесение кристального глазирующего состава 0.00N с керамидами',
      'Полировка волос с шелковой эмульсией',
      'Сушка с эффектом безупречной зеркальной глади'
    ],
    recommendedFor: 'Перед важным мероприятием, фотосессией или для продления зеркального блеска окрашивания',
    activeIngredients: 'Керамидный комплекс SPA Master Diamond, безаммиачная полимерная основа, протеины шелка'
  },
  {
    id: 'split-ends-shield',
    title: 'Шелковая запайка кончиков (Split Ends Shield)',
    subtitle: 'Локальная реставрация секущихся концов без потери длины',
    filterCategory: 'gloss',
    categoryLabel: 'Зеркальный глянец',
    price: 'от 2 500 ₽',
    duration: '45 минут',
    durability: 'Защита до 5 недель',
    badge: 'Сохранение длины',
    visualEffect: 'Расщепленные секущиеся концы соединяются и разглаживаются. Исчезает белая крошка на концах, срез выглядит свежим и плотным, словно сразу после стрижки.',
    description:
      'Точечная процедура для тех, кто отращивает длину и боится потерять даже один сантиметр. Термо-полимерный состав склеивает расщепленные участки кутикулы.',
    steps: [
      'Локальное очищение нижней трети волос',
      'Нанесение термоактивного герметика на расщепленные кончики',
      'Бережная полировка на ультра-гладких пластинах',
      'Фиксация защитной сывороткой'
    ],
    recommendedFor: 'Для тех, кто отращивает волосы и хочет избавиться от секущихся кончиков без состригания длины',
    activeIngredients: 'Липидный био-герметик, масло камелии, витаминный комплекс A+E'
  },
  {
    id: 'express-flash',
    title: 'Экспресс-блеск за 15 минут в мойке (Flash Glow)',
    subtitle: 'Моментальная реанимация тусклых волос перед важным событием',
    filterCategory: 'gloss',
    categoryLabel: 'Зеркальный глянец',
    price: 'от 2 000 ₽',
    duration: '20 минут',
    durability: 'Эффект 2 – 3 недели',
    badge: 'Экспресс-эффект',
    visualEffect: 'Быстро смывает усталость и тусклость: волосы мгновенно оживают, становятся рассыпчатыми, гладкими и шелковистыми.',
    description:
      'Идеальное экспресс-дополнение к стрижке или окрашиванию. Концентрированная спа-ампула распределяется в мойке и начинает действовать за секунды.',
    steps: [
      'Мытье головы с деликатным массажем',
      'Нанесение ампульного концентрата в мойке на 5–7 минут',
      'Смывание прохладной водой для зеркального финиша',
      'Быстрая укладка феном'
    ],
    recommendedFor: 'Когда ограничено время, но нужно моментально получить ухоженный салонный блеск',
    activeIngredients: 'Концентрированные протеины шелка, жидкий кератин, светоотражающие частицы'
  },

  // --- 4. КОЖА ГОЛОВЫ & ДЕТОКС ---
  {
    id: 'scalp-peeling-detox',
    title: 'Кислотный спа-пилинг кожи головы (Scalp Peeling & Detox)',
    subtitle: 'Глубокое очищение устьев фолликулов и стимуляция роста новых волос',
    filterCategory: 'scalp',
    categoryLabel: 'Кожа головы & Детокс',
    price: 'от 3 500 ₽',
    duration: '1 час',
    durability: 'Ощущение свежести 3 – 4 недели',
    badge: 'Здоровые корни & Объем',
    visualEffect: 'Невероятное ощущение легкости и "дышащей" кожи головы. Прикорневой объем приподнимается сам по себе, корни дольше остаются чистыми и свежими.',
    description:
      'Фундамент здоровья волос. AHA и BHA кислоты мягко растворяют ороговевшие чешуйки, остатки стайлинга и излишки себума, пробуждая спящие луковицы.',
    steps: [
      'Аппаратная или визуальная диагностика состояния кожи головы',
      'Нанесение энзимного пилинга по проборам с легким массажем',
      'Смывание очищающим терапевтическим шампунем с ментолом и чайным деревом',
      'Нанесение успокаивающей тонизирующей сыворотки-активатора роста'
    ],
    recommendedFor: 'Быстро жирнящиеся корни, перхоть, зуд, выпадение волос или потеря прикорневого объема',
    activeIngredients: 'Салициловая кислота (BHA), гликолевая кислота (AHA), экстракт чайного дерева, ментол'
  },
  {
    id: 'anti-age-gray-care',
    title: 'Anti-Age спа-ритуал для седых волос (Silver Silk)',
    subtitle: 'Глубокое смягчение жесткого седого волоса и устранение ломкости',
    filterCategory: 'scalp',
    categoryLabel: 'Кожа головы & Детокс',
    price: 'от 4 000 ₽',
    duration: '1 час 15 мин',
    durability: 'Мягкость до 5 недель',
    badge: 'Anti-Age Забота',
    visualEffect: 'Сухая и колючая седина становится мягкой, эластичной и податливой. Волосы легко укладываются и приобретают благородный серебряный блеск без желтизны.',
    description:
      'Седые волосы лишены меланина и имеют измененную пористую структуру. Этот ритуал насыщает их влагой и антиоксидантами, возвращая эластичность молодого волоса.',
    steps: [
      'Очищение антиоксидантным шампунем с экстрактом розы',
      'Глубокое липидное пропитывание для размягчения жесткой кутикулы',
      'Серебряный тонирующий уход для нейтрализации желтоватого налета',
      'Питательный несмываемый крем-уход'
    ],
    recommendedFor: 'Седые, жесткие, стекловидные волосы, трудно поддающиеся укладке',
    activeIngredients: 'Экстракт дамасской розы, антиоксиданты зеленого чая, масло жожоба'
  }
];

function getCareSpecProfile(care: CareTreatment) {
  const isGloss = care.filterCategory === 'gloss';
  return {
    phBalance: isGloss ? 'pH 4.2 Кислотный щит' : 'pH 4.5 – 5.0 Реконструкция',
    penetrationDepth:
      care.filterCategory === 'reconstruction'
        ? 'Глубокий кортекс (100%)'
        : care.filterCategory === 'hydration'
        ? 'Межклеточный липидный слой'
        : care.filterCategory === 'gloss'
        ? 'Зеркальная кутикула 5D'
        : 'Устья фолликулов и дерма',
    layers: [
      {
        id: 0,
        title: '01. Белковый кортекс (Ядро волоса)',
        metric: 'Merquat 280 + Кератин',
        detail: 'Заполняет микропустоты после осветления и возвращает стержню волоса прочность на разрыв.'
      },
      {
        id: 1,
        title: '02. Липидно-коллагеновая мантия',
        metric: 'Омега-3/6 + Аргана',
        detail: 'Связывает и удерживает молекулы воды внутри волоса, убирая сухость и электризацию.'
      },
      {
        id: 2,
        title: '03. Кутикулярный щит pH 4.5',
        metric: 'Герметизация чешуек',
        detail: 'Плотно приглаживает чешуйки кутикулы для зеркального светоотражения и защиты пигмента.'
      }
    ]
  };
}

interface CareEditorialCardProps {
  care: CareTreatment;
  indexNumber: number;
  onBook: (care: CareTreatment) => void;
}

const CareEditorialCard: React.FC<CareEditorialCardProps> = ({
  care,
  indexNumber,
  onBook
}) => {
  const spec = useMemo(() => getCareSpecProfile(care), [care]);

  return (
    <article className="w-full min-w-0 rounded-2xl border border-[#382E26] bg-[#181513] overflow-hidden shadow-2xl">
      {/* Compact Header Block */}
      <div className="p-4 sm:p-6 border-b border-[#26201B] space-y-3 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D9A773] tabular-nums">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-semibold">
              #{String(indexNumber).padStart(2, '0')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{care.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{care.badge}</span>
          </div>
          <span className="font-mono text-[#FAF6F0] font-semibold">{care.price}</span>
        </div>

        <div>
          <h3 className="font-serif text-xl sm:text-3xl text-[#FAF6F0] font-normal leading-tight">
            {care.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#A89F91] font-light mt-1">
            {care.subtitle}
          </p>
        </div>

        {/* 3 Core Metrics Strip (Durability, Duration, Price) */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#141110] border border-[#26201B]">
            <div className="text-[10px] text-[#8A7F73] uppercase tracking-wider">Эффект</div>
            <div className="text-xs sm:text-sm font-mono font-semibold text-[#FAF6F0] tabular-nums mt-0.5">
              {care.durability}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#141110] border border-[#26201B]">
            <div className="text-[10px] text-[#8A7F73] uppercase tracking-wider">Время</div>
            <div className="text-xs sm:text-sm font-mono font-semibold text-[#FAF6F0] tabular-nums mt-0.5">
              {care.duration}
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#141110] border border-[#26201B]">
            <div className="text-[10px] text-[#8A7F73] uppercase tracking-wider">Стоимость</div>
            <div className="text-xs sm:text-sm font-mono font-semibold text-[#D9A773] tabular-nums mt-0.5">
              {care.price}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Passport Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-w-0">
        {/* 1. Concise Essence */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#D9A773] font-medium inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Суть процедуры и результат</span>
            </span>
            <span className="font-mono text-[11px] text-[#A89F91] tabular-nums">
              {spec.phBalance}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#FAF6F0] font-light leading-relaxed">
            {care.visualEffect}
          </p>
        </div>

        {/* 2. Compact 2-Column Indications & Active Formula */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#141110] border border-[#26201C]">
            <span className="text-[10px] uppercase tracking-wider text-[#8A7F73] block mb-1">
              Показания к ритуалу
            </span>
            <p className="text-xs text-[#FAF6F0] font-light leading-relaxed">
              {care.recommendedFor}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#141110] border border-[#26201C]">
            <span className="text-[10px] uppercase tracking-wider text-[#8A7F73] block mb-1">
              Активная формула SPA Master
            </span>
            <p className="text-xs text-[#D9A773] font-light leading-relaxed">
              {care.activeIngredients}
            </p>
          </div>
        </div>

        {/* 3. Action Bar */}
        <div className="pt-3 border-t border-[#26201B] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => onBook(care)}
            className="flex-1 min-h-[46px] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-[#D9A773] hover:bg-[#E5B887] active:scale-[0.99] text-[#141211] rounded-xl transition-all flex items-center justify-center gap-2 text-center"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Записаться на уход ({care.price})</span>
          </button>
          <a
            href={buildTelegramMasterUrl(
              `Здравствуйте, Магдана! Хочу записаться на спа-программу «${care.title}» (${care.price}). Подскажите удобное время.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) =>
              openTelegramMasterChat(
                `Здравствуйте, Магдана! Хочу записаться на спа-программу «${care.title}» (${care.price}). Подскажите удобное время.`,
                e
              )
            }
            className="min-h-[46px] py-2.5 px-4 text-xs font-medium border border-[#2AABEE]/45 hover:border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE]/10 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>В Telegram с услугой</span>
          </a>
        </div>
      </div>
    </article>
  );
};

interface CareSectionViewProps {
  onSelectCareForBooking: (care: CareTreatment) => void;
}

export const CareSectionView: React.FC<CareSectionViewProps> = ({ onSelectCareForBooking }) => {
  const [activeTab, setActiveTab] = useState<'treatments' | 'passport'>('treatments');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<CareFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCare, setSelectedCare] = useState<CareTreatment>(CARE_TREATMENTS[0]);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(CARE_TREATMENTS[0].id);

  const handleJumpToCareById = (careId: string) => {
    const target = CARE_TREATMENTS.find((c) => c.id === careId);
    if (!target) return;
    setSelectedFilterCategory('all');
    setSearchQuery('');
    setSelectedCare(target);
    setMobileExpandedId(target.id);
    setActiveTab('treatments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTreatments = useMemo(() => {
    return CARE_TREATMENTS.filter((care) => {
      const matchesCategory =
        selectedFilterCategory === 'all' || care.filterCategory === selectedFilterCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        care.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        care.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        care.visualEffect.toLowerCase().includes(searchQuery.toLowerCase()) ||
        care.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        care.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedFilterCategory, searchQuery]);

  const currentDetailItem = useMemo(() => {
    if (filteredTreatments.some((c) => c.id === selectedCare.id)) {
      return selectedCare;
    }
    return filteredTreatments[0] || CARE_TREATMENTS[0];
  }, [filteredTreatments, selectedCare]);

  const currentDetailIndex = useMemo(() => {
    const idx = CARE_TREATMENTS.findIndex((c) => c.id === currentDetailItem?.id);
    return idx >= 0 ? idx + 1 : 1;
  }, [currentDetailItem]);

  return (
    <div className="w-full min-w-0 space-y-8 sm:space-y-12 animate-fade-in">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-[#2D2622] min-w-0">
        <div className="min-w-0">
          <p className="text-xs text-[#D9A773] tracking-wide mb-2 flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 shrink-0" />
            <span>Молекулярная реконструкция & Персональная диагностика · 12 протоколов</span>
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FAF6F0]">
            Уход & Паспорт волос (12)
          </h2>
          <p className="text-xs sm:text-base text-[#A89F91] mt-2 max-w-3xl font-light leading-relaxed">
            Компактные паспорта 12 спа-программ SPA Master: активные формулы с полимером Merquat 280, время визита, стоимость, срок эффекта и электронный «Паспорт волос».
          </p>
        </div>

        {/* Tab Switcher inside Care section */}
        <div className="flex items-center gap-1 p-1 bg-[#1A1614] border border-[#2D2622] rounded-xl self-start lg:self-end shrink-0 w-full sm:w-auto min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab('treatments')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 min-h-[40px] text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'treatments'
                ? 'bg-[#2B231F] text-[#D9A773]'
                : 'text-[#A89F91] hover:text-[#FAF6F0]'
            }`}
          >
            Спа-программы (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('passport')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 min-h-[40px] text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'passport'
                ? 'bg-[#2B231F] text-[#D9A773]'
                : 'text-[#A89F91] hover:text-[#FAF6F0]'
            }`}
          >
            Паспорт волос
          </button>
        </div>
      </div>

      {activeTab === 'passport' ? (
        <HairPassportView onSelectCareById={handleJumpToCareById} />
      ) : (
        <>
          {/* SEARCH & CATEGORY FILTER BUTTONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
            <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {CARE_FILTER_BUTTONS.map((cat) => {
                const isActive = selectedFilterCategory === cat.key;
                const count =
                  cat.key === 'all'
                    ? CARE_TREATMENTS.length
                    : CARE_TREATMENTS.filter((c) => c.filterCategory === cat.key).length;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedFilterCategory(cat.key)}
                    className={`px-3.5 py-2.5 min-h-[40px] rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 ${
                      isActive
                        ? 'bg-[#2A221D] border-[#D9A773] text-[#FAF6F0]'
                        : 'bg-[#181412] border-[#2D2622] text-[#A89F91] hover:text-[#FAF6F0] hover:border-[#4A3E37]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[11px] font-mono tabular-nums text-[#D9A773]/80">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72 shrink-0 min-w-0">
              <Search className="w-4 h-4 text-[#8A7F73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск ухода (ботокс, блонд, блеск...)"
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#1A1614] border border-[#2D2622] text-xs text-[#FAF6F0] placeholder:text-[#6D6359] focus:outline-none focus:border-[#D9A773] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7F73] hover:text-[#FAF6F0] p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* MOBILE ACCORDION (< lg) + DESKTOP SPLIT-PANE (>= lg) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start min-w-0">
            {/* LEFT COLUMN (5 cols on desktop, full accordion list on mobile) */}
            <div className="lg:col-span-5 space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2 px-1 pb-2 border-b border-[#2D2622]">
                <span className="text-xs text-[#A89F91] truncate">
                  Нажмите на спа-программу для открытия паспорта
                </span>
                <span className="text-xs font-mono tabular-nums text-[#D9A773] shrink-0">
                  {filteredTreatments.length} из {CARE_TREATMENTS.length}
                </span>
              </div>

              {filteredTreatments.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-[#2D2622] bg-[#161311]">
                  <p className="text-sm text-[#A89F91]">
                    По запросу «{searchQuery}» ничего не найдено.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilterCategory('all');
                    }}
                    className="mt-3 px-4 py-2 text-xs text-[#D9A773] border border-[#D9A773]/40 rounded-lg"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 lg:max-h-[820px] lg:overflow-y-auto lg:pr-1">
                  {filteredTreatments.map((care) => {
                    const isDesktopSelected = currentDetailItem.id === care.id;
                    const isMobileExpanded = mobileExpandedId === care.id;
                    const globalIdx = CARE_TREATMENTS.findIndex((c) => c.id === care.id) + 1;

                    return (
                      <div key={care.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            hapticSelection();
                            setSelectedCare(care);
                            setMobileExpandedId((prev) => (prev === care.id ? null : care.id));
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-150 group flex items-start gap-3.5 ${
                            isDesktopSelected
                              ? 'border-[#D9A773] bg-[#231B16]'
                              : 'border-[#2D2622] bg-[#161311] hover:border-[#4A3E37] hover:bg-[#1B1714]'
                          }`}
                        >
                          <span
                            className={`font-mono text-xs tabular-nums pt-0.5 shrink-0 ${
                              isDesktopSelected ? 'text-[#D9A773] font-semibold' : 'text-[#6D6359]'
                            }`}
                          >
                            {String(globalIdx).padStart(2, '0')}.
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-[#8A7F73] tabular-nums mb-0.5">
                              <span className="truncate">
                                {care.categoryLabel} · {care.duration}
                              </span>
                              <span className="text-[#D9A773] font-mono font-medium shrink-0">
                                {care.price}
                              </span>
                            </div>

                            <h4
                              className={`font-serif text-base sm:text-lg leading-snug transition-colors ${
                                isDesktopSelected
                                  ? 'text-[#D9A773] font-medium'
                                  : 'text-[#FAF6F0] group-hover:text-[#D9A773]'
                              }`}
                            >
                              {care.title}
                            </h4>

                            <p className="text-xs text-[#A89F91] line-clamp-1 font-light mt-0.5">
                              {care.subtitle}
                            </p>
                          </div>

                          <span className="text-xs font-mono text-[#D9A773] self-center shrink-0 lg:hidden">
                            {isMobileExpanded ? 'Свернуть' : 'Открыть'}
                          </span>
                        </button>

                        {/* INLINE MOBILE ACCORDION CARD (< lg) */}
                        {isMobileExpanded && (
                          <div className="lg:hidden pt-1 pb-3 animate-fade-in">
                            <CareEditorialCard
                              care={care}
                              indexNumber={globalIdx}
                              onBook={onSelectCareForBooking}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (7 cols, Desktop Only >= lg): Sticky Luxury Text Card */}
            {currentDetailItem && (
              <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-24 min-w-0">
                <CareEditorialCard
                  care={currentDetailItem}
                  indexNumber={currentDetailIndex}
                  onBook={onSelectCareForBooking}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
