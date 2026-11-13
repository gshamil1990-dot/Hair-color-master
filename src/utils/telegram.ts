/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Нативный контроллер Telegram Mini App (Telegram WebApp SDK)
 * Обеспечивает авторазворот, синхронизацию темы (#141211), тактильный отклик (HapticFeedback),
 * управление системной кнопкой «Назад» (BackButton) и открытие чата @Magdana_Stilist с готовым текстом.
 */

export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramBackButton {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
    start_param?: string;
  };
  version?: string;
  platform?: string;
  colorScheme?: 'light' | 'dark';
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  BackButton?: TelegramBackButton;
  HapticFeedback?: TelegramHapticFeedback;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  disableVerticalSwipes?: () => void;
  enableClosingConfirmation?: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const MASTER_TELEGRAM_USERNAME = 'Magdana_Stilist';
export const MASTER_WHATSAPP_PHONE = '79281013204';
export const MASTER_PHONE_DISPLAY = '8 (928) 101-32-04';
export const MASTER_PHONE_TEL = 'tel:89281013204';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

export function isRunningInTelegram(): boolean {
  const tg = getTelegramWebApp();
  if (!tg) return false;
  return Boolean(tg.initData && tg.initData.length > 0) || (Boolean(tg.platform) && tg.platform !== 'unknown');
}

export function initTelegramMiniApp(): void {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.('#141211');
    tg.setBackgroundColor?.('#141211');
    tg.setBottomBarColor?.('#141211');
    tg.disableVerticalSwipes?.();
  } catch {
    // Безопасный фолбэк для старых версий клиентов или обычного браузера
  }
}

export function getTelegramGuestName(): string {
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user;
  if (!user) return '';
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
}

export function hapticSelection(): void {
  try {
    getTelegramWebApp()?.HapticFeedback?.selectionChanged();
  } catch {
    // Ignore outside Telegram
  }
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): void {
  try {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
  } catch {
    // Ignore outside Telegram
  }
}

export function hapticNotification(type: 'success' | 'warning' | 'error' = 'success'): void {
  try {
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type);
  } catch {
    // Ignore outside Telegram
  }
}

export function buildTelegramMasterUrl(prefilledText?: string): string {
  const baseUrl = `https://t.me/${MASTER_TELEGRAM_USERNAME}`;
  if (!prefilledText || !prefilledText.trim()) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(prefilledText.trim())}`;
}

export function buildWhatsAppMasterUrl(prefilledText?: string): string {
  const baseUrl = `https://wa.me/${MASTER_WHATSAPP_PHONE}`;
  if (!prefilledText || !prefilledText.trim()) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(prefilledText.trim())}`;
}

export function openTelegramMasterChat(prefilledText?: string, e?: { preventDefault: () => void }): void {
  hapticImpact('medium');
  const url = buildTelegramMasterUrl(prefilledText);
  const tg = getTelegramWebApp();

  if (tg && isRunningInTelegram() && typeof tg.openTelegramLink === 'function') {
    e?.preventDefault();
    try {
      tg.openTelegramLink(url);
      return;
    } catch {
      // Если клиент не поддержал вызов, сработает стандартный переход по ссылке
    }
  }
}

export function openExternalUrl(url: string, e?: { preventDefault: () => void }): void {
  hapticImpact('light');
  const tg = getTelegramWebApp();

  if (tg && isRunningInTelegram()) {
    if (url.startsWith('https://t.me/') && typeof tg.openTelegramLink === 'function') {
      e?.preventDefault();
      try {
        tg.openTelegramLink(url);
        return;
      } catch {
        return;
      }
    }
    if ((url.startsWith('https://') || url.startsWith('http://')) && typeof tg.openLink === 'function') {
      e?.preventDefault();
      try {
        tg.openLink(url);
        return;
      } catch {
        return;
      }
    }
  }
}
