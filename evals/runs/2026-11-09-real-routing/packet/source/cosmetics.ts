import type { BannerAppearance, BannerId } from "./banner-collection";
import {
  ownsBanner,
} from "./banner-progress";
import {
  loadMasterySnapshot,
  saveSnapshot,
  deviceId,
  earnedMedalCount,
  isMedalEarned,
  type MasteryId,
  type MasteryStorage,
} from "./mastery";

export type CosmeticSlot = "banner" | "frame" | "badge" | "badgeFrame" | "title" | "titleFrame";

export interface CosmeticLoadout {
  banner: BannerAppearance;
  frame: string | null;
  badge: string | null;
  badgeFrame: string | null;
  title: string | null;
  titleFrame: string | null;
}

export const COSMETIC_OPTIONS: Record<CosmeticSlot, readonly string[]> = {
  banner: [
    "classic",
    "slate",
    "forest",
    "banner_cosmic_knight",
    "banner_crimson_sun",
    "banner_hidden_myeongnyang",
  ],
  frame: ["frame:classic-gold", "frame:mastery-complete"],
  badge: [
    "badge:mastery-m01",
    "badge:mastery-m02",
    "badge:mastery-m03",
    "badge:mastery-m04",
    "badge:mastery-m05",
    "badge:mastery-m06",
    "badge:mastery-m07",
    "badge:mastery-m08",
  ],
  badgeFrame: ["badgeFrame:gold", "badgeFrame:silver", "badgeFrame:violet"],
  title: ["title:challenger", "title:explorer"],
  titleFrame: ["titleFrame:gold", "titleFrame:silver", "titleFrame:violet"],
};

export const DEFAULT_COSMETICS: Readonly<CosmeticLoadout> = Object.freeze({
  banner: "classic",
  frame: null,
  badge: null,
  badgeFrame: null,
  title: null,
  titleFrame: null,
});

export const GUEST_COSMETICS: Readonly<CosmeticLoadout> = Object.freeze({
  banner: "plain",
  frame: null,
  badge: null,
  badgeFrame: null,
  title: null,
  titleFrame: null,
});

function isStorageSafe(storage: MasteryStorage): boolean {
  if (!storage) return false;
  const owner = (storage as { owner?: string | null }).owner;
  const unsafe = (storage as { unsafeData?: boolean }).unsafeData;
  return (
    owner !== null &&
    owner !== undefined &&
    unsafe !== true &&
    (storage as { ready?: boolean }).ready !== false &&
    (storage as { conflict?: boolean }).conflict !== true
  );
}

export function ownsCosmetic(storage: MasteryStorage, slot: CosmeticSlot, id: string | null): boolean {
  if (!storage || (storage as { unsafeData?: boolean }).unsafeData === true) return false;
  const owner = (storage as { owner?: string | null }).owner;

  // Guest accounts cannot own or equip member cosmetics: guest plain only
  if (owner === null || owner === undefined) {
    return slot === "banner" && id === "plain";
  }

  // Member accounts
  if (id === null) {
    // Banner cannot be null; all other slots can be unequipped (null choice)
    return slot !== "banner";
  }

  if (!COSMETIC_OPTIONS[slot]?.includes(id)) {
    return false;
  }

  if (slot === "banner") {
    return ownsBanner(storage, id as BannerId);
  }

  if (slot === "frame") {
    if (id === "frame:classic-gold") return true;
    if (id === "frame:mastery-complete") {
      const snapshot = loadMasterySnapshot(storage);
      if (snapshot.malformed) return false;
      return Boolean(snapshot.rewards.items["frame:mastery-complete"]) || earnedMedalCount(snapshot.progress) >= 8;
    }
    return false;
  }

  if (slot === "badge") {
    const snapshot = loadMasterySnapshot(storage);
    if (snapshot.malformed) return false;
    const medalMatch = /^badge:mastery-(m0[1-8])$/.exec(id);
    if (!medalMatch) return false;
    const medalId = medalMatch[1].toUpperCase() as MasteryId;
    return Boolean(snapshot.rewards.items[id]) || isMedalEarned(snapshot.progress, medalId);
  }

  if (slot === "badgeFrame") {
    return ["badgeFrame:gold", "badgeFrame:silver", "badgeFrame:violet"].includes(id);
  }

  if (slot === "title") {
    if (id === "title:challenger") return true;
    if (id === "title:explorer") {
      const snapshot = loadMasterySnapshot(storage);
      if (snapshot.malformed) return false;
      return Boolean(snapshot.rewards.items["title:explorer"]) || earnedMedalCount(snapshot.progress) >= 4;
    }
    return false;
  }

  if (slot === "titleFrame") {
    return ["titleFrame:gold", "titleFrame:silver", "titleFrame:violet"].includes(id);
  }

  return false;
}

export function getCosmeticLoadout(storage: MasteryStorage): CosmeticLoadout {
  if (!storage || (storage as { owner?: string | null }).owner === null || (storage as { owner?: string | null }).owner === undefined) {
    return { ...GUEST_COSMETICS };
  }

  const snapshot = loadMasterySnapshot(storage);
  if (snapshot.malformed) {
    return { ...DEFAULT_COSMETICS };
  }

  let banner: BannerAppearance = "classic";
  const bannerItem = snapshot.preferences.equipped.banner?.itemId;
  if (bannerItem) {
    const raw = bannerItem.startsWith("banner:") ? bannerItem.slice(7) : bannerItem;
    if (ownsCosmetic(storage, "banner", raw)) {
      banner = raw as BannerId;
    }
  }

  const getSlotItem = (slot: "frame" | "badge" | "badgeFrame" | "title" | "titleFrame"): string | null => {
    const item = snapshot.preferences.equipped[slot]?.itemId ?? null;
    if (item && ownsCosmetic(storage, slot, item)) {
      return item;
    }
    return null;
  };

  return {
    banner,
    frame: getSlotItem("frame"),
    badge: getSlotItem("badge"),
    badgeFrame: getSlotItem("badgeFrame"),
    title: getSlotItem("title"),
    titleFrame: getSlotItem("titleFrame"),
  };
}

export function equipCosmeticLoadout(storage: MasteryStorage, loadout: CosmeticLoadout): boolean {
  if (!isStorageSafe(storage)) return false;
  if (!loadout || typeof loadout !== "object") return false;

  // Validate banner
  if (typeof loadout.banner !== "string" || loadout.banner === "plain" || !ownsCosmetic(storage, "banner", loadout.banner)) {
    return false;
  }

  // Validate other slots
  const nonBannerSlots = ["frame", "badge", "badgeFrame", "title", "titleFrame"] as const;
  for (const slot of nonBannerSlots) {
    const val = loadout[slot];
    if (val !== null && (typeof val !== "string" || !ownsCosmetic(storage, slot, val))) {
      return false;
    }
  }

  const snapshot = loadMasterySnapshot(storage);
  if (snapshot.malformed) return false;

  const now = new Date().toISOString();
  const devId = deviceId(storage);

  // Atomic update preserving tracked medal
  snapshot.preferences.equipped.banner = {
    itemId: `banner:${loadout.banner}`,
    updatedAt: now,
    deviceId: devId,
  };

  for (const slot of nonBannerSlots) {
    snapshot.preferences.equipped[slot] = {
      itemId: loadout[slot],
      updatedAt: now,
      deviceId: devId,
    };
  }

  saveSnapshot(storage, snapshot);
  return true;
}

export function normalizePublicCosmetics(value: unknown): CosmeticLoadout | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const allowedKeys = ["banner", "frame", "badge", "badgeFrame", "title", "titleFrame"];
  if (Object.keys(raw).some(k => !allowedKeys.includes(k))) return null;

  let banner = raw.banner;
  if (typeof banner === "string" && banner.startsWith("banner:")) {
    banner = banner.slice(7);
  }

  if (banner === "plain") {
    // Guest combo: plain only with all other slots null
    for (const key of ["frame", "badge", "badgeFrame", "title", "titleFrame"]) {
      if (raw[key] !== null && raw[key] !== undefined) return null;
    }
    return { ...GUEST_COSMETICS };
  }

  if (typeof banner !== "string" || !COSMETIC_OPTIONS.banner.includes(banner)) {
    return null;
  }

  const validateSlot = (slot: "frame" | "badge" | "badgeFrame" | "title" | "titleFrame"): string | null | undefined => {
    const v = raw[slot];
    if (v === null || v === undefined) return null;
    if (typeof v === "string" && COSMETIC_OPTIONS[slot].includes(v)) return v;
    return undefined;
  };

  const frame = validateSlot("frame");
  if (frame === undefined) return null;
  const badge = validateSlot("badge");
  if (badge === undefined) return null;
  const badgeFrame = validateSlot("badgeFrame");
  if (badgeFrame === undefined) return null;
  const title = validateSlot("title");
  if (title === undefined) return null;
  const titleFrame = validateSlot("titleFrame");
  if (titleFrame === undefined) return null;

  return {
    banner: banner as BannerAppearance,
    frame,
    badge,
    badgeFrame,
    title,
    titleFrame,
  };
}
