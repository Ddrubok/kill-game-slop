import { getPlayerCosmetics } from './banner-theme';
import { I18nManager } from './i18n';
import { formatTier } from './tier-view';
import { getRuntimeText } from './runtime-text';
import { getBannerTheme, subscribeBannerTheme, type BannerAppearance } from './banner-theme';
import { progressStorage } from './progress-storage';
import {
  type CosmeticLoadout,
  DEFAULT_COSMETICS,
  GUEST_COSMETICS,
  BOT_COSMETICS,
  getCosmeticLoadout,
  getCosmeticTitleLabel,
  createCosmeticCardElements,
  updateCosmeticCard,
  applyCosmeticAppearance,
  normalizePublicCosmetics,
  type CosmeticCardView,
} from './cosmetics-view';
import type { UserProfile } from './supabase-auth';
import type { PieceSide } from './layout';
import type { GameMode } from './game-mode';
import './player-banner.css';

export type { CosmeticLoadout, CosmeticCardView };
export {
  DEFAULT_COSMETICS,
  GUEST_COSMETICS,
  BOT_COSMETICS,
  getCosmeticLoadout,
  getCosmeticTitleLabel,
  createCosmeticCardElements,
  updateCosmeticCard,
  applyCosmeticAppearance,
  normalizePublicCosmetics,
};

export interface PlayerBannerState {
  visible: boolean;
  mode: GameMode;
  stage: number;
  currentSide: PieceSide;
  mySide: PieceSide | null;
  profile: UserProfile | null;
  opponent: { id: string; nickname: string; mmr: number } | null;
  opponentDisplayName?: string;
  rankedMode: 'classic' | 'strategy';
  loggedIn: boolean;
  opponentBannerTheme?: BannerAppearance;
  opponentCosmetics?: CosmeticLoadout;
  remaining?: Record<PieceSide, number>;
}

export function getPlayerBannerModels(state: PlayerBannerState) {
  const mine = state.mode === 'online' ? state.mySide ?? 'white' : 'white';
  const opposite = mine === 'white' ? 'black' : 'white';
  const profile = state.profile;
  const rating = state.rankedMode === 'strategy' && state.mode === 'online' ? profile?.strategyMmr : profile?.classicMmr;
  const self = {
    side: mine,
    name: profile?.nickname || I18nManager.t('online.guest_mode'),
    detail: state.loggedIn && rating !== undefined ? formatTier(rating) : I18nManager.t('online.guest_mode'),
    bot: false,
  };
  const opponent = state.mode === 'stage'
    ? { side: opposite, name: 'AI', detail: I18nManager.t('lobby.stage_label', { stage: state.stage }), bot: true }
    : state.mode === 'online'
      ? { side: opposite, name: state.opponent?.nickname || state.opponentDisplayName || getRuntimeText('matchmaking.default_opponent_name'),
          detail: state.opponent ? formatTier(state.opponent.mmr) : I18nManager.t('p2p.subtitle'), bot: false }
      : { side: opposite, name: I18nManager.t('ingame.turn_black'), detail: I18nManager.t('lobby.mode_2p_short'), bot: false };
  return {
    self,
    opponent,
    canAddFriend: state.mode === 'online' && state.loggedIn && !!profile &&
      !!state.opponent && state.opponent.id !== profile.id,
  };
}

export function createPlayerBanners(parent: HTMLElement, options: {
  getState: () => PlayerBannerState;
  requestFriend: (profileId: string, opponent: NonNullable<PlayerBannerState['opponent']>) => Promise<{ success: boolean; error?: string }>;
}) {
  const element = document.createElement('div');
  element.className = 'player-banners';
  element.hidden = true;

  const makeCard = (mine: boolean) => {
    const card = document.createElement('section');
    card.className = 'player-banner';
    card.dataset.owner = mine ? 'self' : 'opponent';

    const emblem = document.createElement('span');
    emblem.className = 'player-banner-emblem';
    emblem.setAttribute('aria-hidden', 'true');

    const text = document.createElement('div');
    text.className = 'player-banner-text';

    const name = document.createElement('strong');
    name.className = 'player-banner-name';

    const detail = document.createElement('span');
    detail.className = 'player-banner-detail';

    text.append(name, detail);
    card.append(emblem, text);
    element.append(card);

    // 6슬롯 코스메틱 DOM 엘리먼트 바인딩
    const cosmeticView = createCosmeticCardElements(card);

    const compact = document.createElement('span');
    compact.className = 'player-banner-compact';
    card.append(compact);

    return { card, emblem, name, detail, cosmeticView, compact };
  };

  const self = makeCard(true);
  const opponent = makeCard(false);

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'player-banner-add';

  const status = document.createElement('p');
  status.className = 'player-banner-status';
  status.setAttribute('role', 'status');
  status.hidden = true;

  opponent.card.append(add, status);
  parent.append(element);

  const completed = new Set<string>();
  const pending = new Set<string>();
  const messages = new Map<string, { key: string; name: string }>();
  let last = '';
  let destroyed = false;
  const lossUntil = { white: 0, black: 0 };

  const update = () => {
    if (destroyed) return;
    const state = options.getState();
    const hidden = !state.visible || !['stage', 'online', 'hotseat'].includes(state.mode);
    if (element.hidden !== hidden) element.hidden = hidden;
    const models = getPlayerBannerModels(state);
    for (const [view, model] of [[self, models.self], [opponent, models.opponent]] as const) {
      view.card.classList.toggle('piece-loss', !element.hidden && performance.now() < lossUntil[model.side as PieceSide]);
    }
    if (element.hidden) return;

    const key = `${state.profile?.id}:${state.opponent?.id}`;

    // 코스메틱 로드아웃 계산
    const selfCosmetics = getPlayerCosmetics(state.loggedIn);

    let opponentCosmetics: CosmeticLoadout;
    if (state.mode === 'stage') {
      opponentCosmetics = { ...BOT_COSMETICS };
    } else if (state.mode === 'hotseat') {
      opponentCosmetics = { ...GUEST_COSMETICS };
    } else if (state.opponentCosmetics) {
      opponentCosmetics = normalizePublicCosmetics(state.opponentCosmetics) ?? { ...GUEST_COSMETICS };
    } else if (state.opponentBannerTheme) {
      opponentCosmetics = {
        banner: state.opponentBannerTheme,
        frame: null,
        badge: null,
        badgeFrame: null,
        title: null,
        titleFrame: null,
      };
    } else {
      opponentCosmetics = { ...BOT_COSMETICS };
    }

    const signature = JSON.stringify([
      state,
      I18nManager.getLanguage?.() || 'ko',
      getBannerTheme(),
      selfCosmetics,
      opponentCosmetics,
      pending.has(key),
      completed.has(key),
      messages.get(key),
    ]);

    if (signature === last) return;
    last = signature;

    for (const [view, model] of [[self, models.self], [opponent, models.opponent]] as const) {
      const side = I18nManager.t(model.side === 'white' ? 'ingame.turn_white' : 'ingame.turn_black');
      const count = state.remaining?.[model.side as PieceSide];
      const label = [count === undefined ? '' : `${model.side === 'white' ? '♙' : '♟'} ${count}`, model.name, side, ...(model.bot ? [model.detail] : [])].filter(Boolean).join(' · ');
      view.compact.textContent = label;
      view.compact.title = label;
    }

    // 내 배너 렌더링
    self.name.textContent = models.self.name;
    self.name.title = models.self.name;
    self.detail.textContent = [models.self.detail, state.remaining ? `${models.self.side === 'white' ? '♙' : '♟'} ${state.remaining[models.self.side as PieceSide]}` : ''].filter(Boolean).join(' · ');
    self.emblem.textContent = models.self.bot ? '♚' : models.self.side === 'white' ? '♙' : '♟';
    self.card.dataset.active = String(models.self.side === state.currentSide);
    updateCosmeticCard(self.cosmeticView, selfCosmetics);
    self.card.setAttribute('aria-label', `${models.self.name} · ${self.detail.textContent}`);

    // 상대 배너 렌더링
    opponent.name.textContent = models.opponent.name;
    opponent.name.title = models.opponent.name;
    opponent.detail.textContent = [models.opponent.detail, state.remaining ? `${models.opponent.side === 'white' ? '♙' : '♟'} ${state.remaining[models.opponent.side as PieceSide]}` : ''].filter(Boolean).join(' · ');
    opponent.emblem.textContent = models.opponent.bot ? '♚' : models.opponent.side === 'white' ? '♙' : '♟';
    opponent.card.dataset.active = String(models.opponent.side === state.currentSide);
    updateCosmeticCard(opponent.cosmeticView, opponentCosmetics);
    opponent.card.setAttribute('aria-label', `${models.opponent.name} · ${opponent.detail.textContent}`);

    // 친구 추가 버튼 및 상태
    add.hidden = !models.canAddFriend;
    add.disabled = pending.has(key) || completed.has(key);
    add.textContent = completed.has(key) ? '✓' : pending.has(key) ? '…' : '+';
    add.title = I18nManager.t('friends.tab_add') ? I18nManager.t(completed.has(key) ? 'friends.request_already_sent' : 'friends.tab_add') : '+';
    add.setAttribute('aria-label', add.title);

    const message = messages.get(key);
    status.hidden = !models.canAddFriend || !message;
    status.textContent = message ? I18nManager.t(message.key, { name: message.name }) : '';
  };

  add.addEventListener('click', async () => {
    const state = options.getState();
    const target = state.opponent;
    if (!state.visible || !getPlayerBannerModels(state).canAddFriend || !state.profile || !target) return;
    const key = `${state.profile.id}:${target.id}`;
    if (pending.has(key) || completed.has(key)) return;

    pending.add(key);
    messages.delete(key);
    update();

    try {
      const result = await options.requestFriend(state.profile.id, target);
      if (result.success || result.error === 'request_already_sent') completed.add(key);
      const known = ['request_already_sent', 'user_not_found', 'cannot_add_self', 'login_required'];
      const message = result.success ? 'friends.request_sent_success' : known.includes(result.error ?? '') ? `friends.${result.error}` : 'online.server_error_fallback';
      messages.set(key, { key: message, name: target.nickname });
    } catch {
      messages.set(key, { key: 'online.server_error_fallback', name: target.nickname });
    } finally {
      pending.delete(key);
      update();
    }
  });

  const unsubscribeTheme = subscribeBannerTheme(update);
  const unsubscribeLanguage = I18nManager.subscribe(update);
  const unsubscribeProgress = typeof progressStorage?.subscribe === 'function'
    ? progressStorage.subscribe(update)
    : () => {};

  return {
    element,
    update,
    pieceRemoved(side: PieceSide) { lossUntil[side] = performance.now() + 280; update(); },
    resetFeedback() { lossUntil.white = 0; lossUntil.black = 0; update(); },
    destroy() {
      destroyed = true;
      unsubscribeTheme();
      unsubscribeLanguage();
      unsubscribeProgress();
      element.remove();
    },
  };
}
