import { I18nManager, type LanguageCode } from './i18n';
import {
  bannerImageUrl,
  type BannerTheme,
} from './banner-collection';
import { getCosmeticsCopy } from './cosmetics-copy';
import './cosmetics-view.css';

import { DEFAULT_COSMETICS, GUEST_COSMETICS, getCosmeticLoadout, normalizePublicCosmetics, type CosmeticLoadout } from './cosmetics';
export { DEFAULT_COSMETICS, GUEST_COSMETICS, getCosmeticLoadout, normalizePublicCosmetics };
export type { CosmeticLoadout };

export const BOT_COSMETICS: CosmeticLoadout = {
  banner: 'classic',
  frame: null,
  badge: null,
  badgeFrame: null,
  title: null,
  titleFrame: null,
};

// 메달 배지 메타정보 및 글리프
export const COSMETIC_BADGE_META: Record<string, { glyph: string; hasImage: boolean }> = {
  'badge:mastery-m01': { glyph: '★', hasImage: true },
  'badge:mastery-m02': { glyph: '♘', hasImage: true },
  'badge:mastery-m03': { glyph: '🧩', hasImage: true },
  'badge:mastery-m04': { glyph: '♛', hasImage: true },
  'badge:mastery-m05': { glyph: '⚔', hasImage: true },
  'badge:mastery-m06': { glyph: '⚡', hasImage: true },
  'badge:mastery-m07': { glyph: '🛡', hasImage: true },
  'badge:mastery-m08': { glyph: '🏰', hasImage: true },
};

/**
 * 배지 ID에 대응하는 WebP 이미지 URL을 반환합니다.
 */
export function getCosmeticBadgeImage(badgeId: string | null, baseUrl?: string): string | null {
  if (!badgeId || badgeId === 'none') return null;
  const rawBase = baseUrl ?? import.meta.env?.BASE_URL ?? '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  const normalized = badgeId.toLowerCase().replace(/^badge:/, '');
  const match = normalized.match(/^(?:mastery-)?(m0[1-8])$/);
  if (match) {
    return `${base}assets/cosmetics/badge-${match[1]}.webp`;
  }
  if (normalized === 'first_victory') {
    return `${base}assets/cosmetics/badge-m01.webp`;
  }
  return null;
}

/**
 * 칭호 ID에 대응하는 9개 언어 현지화 텍스트를 반환합니다.
 */
export function getCosmeticTitleLabel(titleId: string | null, lang?: LanguageCode): string {
  if (!titleId) return '';
  const language: LanguageCode = lang || (I18nManager.getLanguage ? I18nManager.getLanguage() : 'en');
  const copy = getCosmeticsCopy(language);

  // 정규화된 키 탐색 (e.g., 'title:explorer', 'title:challenger')
  const normalizedKey = titleId.startsWith('title:') ? titleId : `title:${titleId}`;
  if (copy.options[normalizedKey]) {
    return copy.options[normalizedKey];
  }
  if (copy.options[titleId]) {
    return copy.options[titleId];
  }

  // i18n 엔진 직접 조회
  const i18nLookup = I18nManager.t?.(`cosmetics.${titleId.replace(/^title:/, '')}`);
  if (i18nLookup && !i18nLookup.startsWith('cosmetics.')) {
    return i18nLookup;
  }

  // 안전한 기본값 반환
  if (normalizedKey.includes('explorer') || titleId.includes('explorer')) {
    return copy.options['title:explorer'] || (language === 'ko' ? '탐험가' : 'Explorer');
  }
  return copy.options['title:challenger'] || (language === 'ko' ? '도전자' : 'Challenger');
}

/**
 * 배지 ID에 대응하는 9개 언어 레이블을 반환합니다.
 */
export function getCosmeticBadgeLabel(badgeId: string | null, lang?: LanguageCode): string {
  if (!badgeId) return '';
  const language: LanguageCode = lang || (I18nManager.getLanguage ? I18nManager.getLanguage() : 'en');
  const copy = getCosmeticsCopy(language);
  const normalizedKey = badgeId.startsWith('badge:') ? badgeId : `badge:mastery-${badgeId.toLowerCase()}`;

  if (copy.options[normalizedKey]) {
    return copy.options[normalizedKey];
  }
  if (copy.options[badgeId]) {
    return copy.options[badgeId];
  }

  return language === 'ko' ? '숙련 배지' : 'Mastery Badge';
}

/**
 * 배지 ID에 대응하는 네이티브 체스/문양 글리프를 반환합니다.
 */
export function getCosmeticBadgeGlyph(badgeId: string | null): string {
  if (!badgeId) return '';
  const normalizedKey = badgeId.startsWith('badge:') ? badgeId : `badge:mastery-${badgeId.toLowerCase()}`;
  const meta = COSMETIC_BADGE_META[normalizedKey] || COSMETIC_BADGE_META[badgeId];
  return meta ? meta.glyph : '★';
}

export interface CosmeticCardView {
  card: HTMLElement;
  bgLayer: HTMLElement;
  frameLayer: HTMLElement;
  frameImg: HTMLImageElement;
  frameFallback: HTMLElement;
  badgeLayer: HTMLElement;
  badgeImg: HTMLImageElement;
  badgeGlyph: HTMLElement;
  badgeFrameLayer: HTMLElement;
  titlePlate: HTMLElement;
}

/**
 * 단일 카드 DOM 내부에 필요한 코스메틱 레이어 요소를 생성하거나 검색하여 바인딩합니다.
 */
export function createCosmeticCardElements(card: HTMLElement): CosmeticCardView {
  let bgLayer = card.querySelector<HTMLElement>(':scope > .pb-layer-background');
  if (!bgLayer) {
    bgLayer = document.createElement('div');
    bgLayer.className = 'pb-layer-background';
    bgLayer.setAttribute('aria-hidden', 'true');
    card.prepend(bgLayer);
  }

  let frameLayer = card.querySelector<HTMLElement>(':scope > .pb-layer-frame');
  let frameImg = frameLayer?.querySelector<HTMLImageElement>(':scope > .pb-frame-img') ?? null;
  let frameFallback = frameLayer?.querySelector<HTMLElement>(':scope > .pb-frame-fallback') ?? null;

  if (!frameLayer) {
    frameLayer = document.createElement('div');
    frameLayer.className = 'pb-layer-frame';
    frameLayer.setAttribute('aria-hidden', 'true');

    frameImg = document.createElement('img');
    frameImg.className = 'pb-frame-img';
    frameImg.alt = '';
    frameImg.src = (import.meta.env?.BASE_URL || '/') + 'assets/cosmetics/classic-frame.webp';

    frameFallback = document.createElement('div');
    frameFallback.className = 'pb-frame-fallback';

    frameImg.onerror = () => {
      if (frameImg) frameImg.style.display = 'none';
      if (frameFallback) frameFallback.style.display = 'block';
    };
    frameImg.onload = () => {
      if (frameImg) frameImg.style.display = 'block';
      if (frameFallback) frameFallback.style.display = 'none';
    };

    frameLayer.append(frameImg, frameFallback);
    card.append(frameLayer);
  }

  let badgeLayer = card.querySelector<HTMLElement>(':scope > .pb-layer-badge');
  let badgeImg = badgeLayer?.querySelector<HTMLImageElement>(':scope > .pb-badge-img') ?? null;
  let badgeGlyph = badgeLayer?.querySelector<HTMLElement>(':scope > .pb-badge-glyph') ?? null;

  if (!badgeLayer) {
    badgeLayer = document.createElement('div');
    badgeLayer.className = 'pb-layer-badge';

    badgeImg = document.createElement('img');
    badgeImg.className = 'pb-badge-img';
    badgeImg.alt = '';

    badgeGlyph = document.createElement('span');
    badgeGlyph.className = 'pb-badge-glyph';
    badgeGlyph.setAttribute('aria-hidden', 'true');

    badgeLayer.append(badgeImg, badgeGlyph);
    card.append(badgeLayer);
  }

  let badgeFrameLayer = card.querySelector<HTMLElement>(':scope > .pb-layer-badgeframe');
  if (!badgeFrameLayer) {
    badgeFrameLayer = document.createElement('div');
    badgeFrameLayer.className = 'pb-layer-badgeframe';
    badgeFrameLayer.setAttribute('aria-hidden', 'true');
    card.append(badgeFrameLayer);
  }

  let titlePlate = card.querySelector<HTMLElement>('.pb-title-plate');
  if (!titlePlate) {
    titlePlate = document.createElement('span');
    titlePlate.className = 'pb-title-plate';
    const textContainer = card.querySelector('.player-banner-text') || card.querySelector('.pb-layer-content') || card;
    textContainer.append(titlePlate);
  }

  return {
    card,
    bgLayer,
    frameLayer,
    frameImg: frameImg!,
    frameFallback: frameFallback!,
    badgeLayer,
    badgeImg: badgeImg!,
    badgeGlyph: badgeGlyph!,
    badgeFrameLayer,
    titlePlate,
  };
}

/**
 * 코스메틱 뷰를 주어진 loadout 데이터에 따라 가볍고 안전하게 갱신합니다.
 */
export function updateCosmeticCard(
  view: CosmeticCardView,
  loadout: CosmeticLoadout,
  titleLabel?: string,
): void {
  const { card, bgLayer, frameLayer, badgeLayer, badgeImg, badgeGlyph, badgeFrameLayer, titlePlate } = view;

  const hasFrame = Boolean(loadout.frame && loadout.frame !== 'none');
  const hasBadge = Boolean(loadout.badge && loadout.badge !== 'none');
  const hasBadgeFrame = hasBadge && Boolean(loadout.badgeFrame && loadout.badgeFrame !== 'none');
  const hasTitle = Boolean(loadout.title && loadout.title !== 'none');

  // 1. 테마 및 배경
  card.dataset.theme = loadout.banner;
  card.dataset.hasFrame = String(hasFrame);
  card.dataset.badgeVisible = String(hasBadge);

  if (loadout.banner === 'plain') {
    bgLayer.style.backgroundImage = 'none';
  } else {
    const url = bannerImageUrl(loadout.banner as BannerTheme);
    bgLayer.style.backgroundImage = `url("${url}")`;
  }

  // 2. 외곽 프레임
  frameLayer.hidden = !hasFrame;
  if (hasFrame && loadout.frame === 'frame:mastery-complete') {
    card.dataset.frameStyle = 'mastery-complete';
  } else {
    delete card.dataset.frameStyle;
  }

  // 3. 배지 및 배지 프레임
  badgeLayer.hidden = !hasBadge;
  badgeFrameLayer.hidden = !hasBadgeFrame;

  if (hasBadge && loadout.badge) {
    const currentBadgeId = loadout.badge;
    const badgeLabel = getCosmeticBadgeLabel(currentBadgeId);
    badgeLayer.setAttribute('aria-label', badgeLabel);
    badgeLayer.title = badgeLabel;

    const imgSrc = getCosmeticBadgeImage(currentBadgeId);
    if (imgSrc) {
      if (badgeImg.dataset.activeBadge !== currentBadgeId) {
        delete badgeImg.dataset.failed;
        badgeImg.dataset.activeBadge = currentBadgeId;
      }
      const failed = badgeImg.dataset.failed === 'true';
      badgeGlyph.textContent = getCosmeticBadgeGlyph(currentBadgeId);
      badgeImg.style.display = failed ? 'none' : 'block';
      badgeGlyph.style.display = failed ? 'flex' : 'none';

      badgeImg.onload = () => {
        if (badgeImg.dataset.activeBadge !== currentBadgeId) return;
        delete badgeImg.dataset.failed;
        badgeImg.style.display = 'block';
        badgeGlyph.style.display = 'none';
      };
      badgeImg.onerror = () => {
        if (badgeImg.dataset.activeBadge !== currentBadgeId) return;
        badgeImg.dataset.failed = 'true';
        badgeImg.style.display = 'none';
        badgeGlyph.style.display = 'flex';
        badgeGlyph.textContent = getCosmeticBadgeGlyph(currentBadgeId);
      };

      if (badgeImg.getAttribute('src') !== imgSrc) {
        badgeImg.src = imgSrc;
      }
    } else {
      badgeImg.onload = null;
      badgeImg.onerror = null;
      delete badgeImg.dataset.activeBadge;
      delete badgeImg.dataset.failed;
      badgeImg.removeAttribute('src');
      badgeImg.style.display = 'none';
      badgeGlyph.style.display = 'flex';
      badgeGlyph.textContent = getCosmeticBadgeGlyph(currentBadgeId);
    }
  } else {
    badgeImg.onload = null;
    badgeImg.onerror = null;
    delete badgeImg.dataset.activeBadge;
    delete badgeImg.dataset.failed;
    badgeImg.removeAttribute('src');
    badgeImg.style.display = 'none';
    badgeGlyph.style.display = 'none';
  }

  if (hasBadgeFrame) {
    badgeFrameLayer.dataset.frame = loadout.badgeFrame?.split(':').at(-1) || 'none';
  }

  // 4. 칭호 플레이트
  titlePlate.hidden = !hasTitle;
  if (hasTitle) {
    const label = titleLabel || getCosmeticTitleLabel(loadout.title);
    titlePlate.textContent = label;
    titlePlate.title = label;
    titlePlate.dataset.frame = loadout.titleFrame?.split(':').at(-1) || 'none';
  } else {
    titlePlate.textContent = '';
  }
}

/**
 * 외부 모듈(설정 UI 등)에서 재사용 가능한 경량 외형 적용 함수
 */
export function applyCosmeticAppearance(
  card: HTMLElement,
  loadout: CosmeticLoadout,
  titleLabel?: string,
): void {
  const view = createCosmeticCardElements(card);
  updateCosmeticCard(view, loadout, titleLabel);
}
