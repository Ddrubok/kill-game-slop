import { I18nManager, type LanguageCode } from "./i18n";
import { progressStorage } from "./progress-storage";
import {
  BANNER_IDS,
  BANNER_THEMES,
  DEFAULT_BANNER_IDS,
  ACHIEVEMENT_BANNER_IDS,
  isValidTheme,
  isValidBannerAppearance,
  equipBanner,
  ownsBanner,
  getBannerProgress,
  bannerImageUrl,
  preloadEquippedBanner as preloadEquippedBannerHelper,
  type BannerId,
  type BannerTheme,
  type BannerAppearance,
} from "./banner-collection";
import { bannerCopy, bannerThemeName } from "./banner-copy";
import { DEFAULT_COSMETICS, GUEST_COSMETICS, getCosmeticLoadout, normalizePublicCosmetics, type CosmeticLoadout } from "./cosmetics";

export type { BannerId, BannerTheme, BannerAppearance };
export {
  BANNER_IDS,
  BANNER_THEMES,
  DEFAULT_BANNER_IDS,
  ACHIEVEMENT_BANNER_IDS,
  isValidTheme,
  isValidBannerAppearance,
  ownsBanner,
  getBannerProgress,
  bannerImageUrl,
};

const listeners = new Set<() => void>();

// Visual preview only: never grant rewards or save the selection to an account.
export const isLocalBannerPreview = Boolean(import.meta.env?.DEV)
  && typeof location !== "undefined"
  && ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)
  && new URLSearchParams(location.search).get("bannerPreview") === "1";
let previewTheme: BannerTheme = "classic";
let previewCosmetics: CosmeticLoadout = { ...DEFAULT_COSMETICS };
let cachedCosmetics: CosmeticLoadout | null = null;
let cachedOwner: string | null = null;

export function getPlayerCosmetics(isMember: boolean): CosmeticLoadout {
  if (isLocalBannerPreview) return { ...previewCosmetics, banner: previewTheme };
  if (!isMember) return { ...GUEST_COSMETICS };
  if (!cachedCosmetics || cachedOwner !== progressStorage.owner) {
    cachedCosmetics = getCosmeticLoadout(progressStorage);
    cachedOwner = progressStorage.owner;
  }
  return { ...cachedCosmetics };
}

export function setLocalCosmeticPreview(value: CosmeticLoadout): boolean {
  if (!isLocalBannerPreview) return false;
  const normalized = normalizePublicCosmetics(value);
  if (!normalized || normalized.banner === 'plain') return false;
  previewCosmetics = normalized;
  previewTheme = normalized.banner;
  listeners.forEach(listener => listener());
  return true;
}


// Listen to progressStorage updates so account changes automatically trigger banner theme listeners
if (typeof progressStorage?.subscribe === "function") {
  progressStorage.subscribe(() => {
    cachedCosmetics = null;
    if (progressStorage.owner && progressStorage.ready) preloadEquippedBanner();
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in banner theme progress observer:", err);
      }
    });
  });
}

/**
 * Returns player banner appearance.
 * Guests always receive "plain".
 * Members receive their equipped account banner theme.
 */
export function getPlayerBannerTheme(isMember: boolean): BannerAppearance {
  return isMember || isLocalBannerPreview ? getBannerTheme() : "plain";
}

/**
 * Retrieves the currently active banner theme for the user.
 * Defaults to "classic".
 */
export function getBannerTheme(): BannerTheme {
  if (isLocalBannerPreview) return previewTheme;
  if (progressStorage?.owner) {
    const banner = getPlayerCosmetics(true).banner;
    return banner === 'plain' ? 'classic' : banner;
  }
  return "classic";
}

/**
 * Sets the banner theme on the member's account.
 */
export function setBannerTheme(theme: BannerTheme): void {
  if (!isValidTheme(theme)) {
    return;
  }
  if (isLocalBannerPreview) {
    previewTheme = theme;
  } else if (progressStorage?.owner) {
    const success = equipBanner(progressStorage, theme);
    if (!success) {
      // If equipping failed because banner is locked or invalid, return early
      return;
    }
  } else {
    return;
  }

  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error("Error in banner theme listener:", err);
    }
  });
}

/**
 * Subscribes to banner theme updates.
 */
export function subscribeBannerTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns the localized name for a banner theme.
 */
export function bannerThemeLabel(theme: BannerTheme, lang?: LanguageCode): string {
  const language = lang || I18nManager.getLanguage?.() || "en";
  return bannerThemeName(theme, language);
}

/**
 * Returns localized banner settings text ("tab" or "hint").
 */
export function bannerSettingsText(key: "tab" | "hint", lang?: LanguageCode): string {
  const language = lang || I18nManager.getLanguage?.() || "en";
  const dict = bannerCopy(language);
  return dict[key] || "";
}

/**
 * Preloads the equipped banner image for fast rendering.
 */
export function preloadEquippedBanner(baseUrl?: string): void {
  preloadEquippedBannerHelper(progressStorage, baseUrl);
}
