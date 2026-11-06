import { I18nManager } from "./i18n";
import { uiText } from "./ui-text";
/**
 * 폰 승급(프로모션) 선택 모달
 * 상대 진영 끝에서 1턴 생존한 폰을 4종 기물(퀸, 룩, 비숍, 나이트) 중 하나로 선택하는 UI
 */

import type { PieceType } from "./config";
import type { PieceSide } from "./layout";

let cancelCurrentModal: (() => void) | undefined;

export interface PromotionPieceOption {
  type: PieceType;
  name: string;
  symbol: string;
  description: string;
}

export const PROMOTION_PIECE_OPTIONS: readonly PromotionPieceOption[] = [
  {
    type: "Queen",
    get name() { return I18nManager.t("lobby.piece_queen"); },
    symbol: "♕",
    get description() { return uiText("Queen"); },
  },
  {
    type: "Rook",
    get name() { return I18nManager.t("lobby.piece_rook"); },
    symbol: "♖",
    get description() { return uiText("Rook"); },
  },
  {
    type: "Bishop",
    get name() { return I18nManager.t("lobby.piece_bishop"); },
    symbol: "♗",
    get description() { return uiText("Bishop"); },
  },
  {
    type: "Knight",
    get name() { return I18nManager.t("lobby.piece_knight"); },
    symbol: "♘",
    get description() { return uiText("Knight"); },
  },
];

/**
 * 폰 승급 모달을 띄우고 선택 결과를 콜백으로 전달한다.
 */
export function openPromotionModal(
  _pieceId: string,
  side: PieceSide,
  onSelect: (chosenType: PieceType) => void,
  parentContainer?: HTMLElement,
): void {
  const container = parentContainer ?? document.body;
  cancelCurrentModal?.();
  const existing = document.querySelector(".promotion-modal-overlay");
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "promotion-modal-overlay";

  const card = document.createElement("div");
  card.className = "promotion-modal-card";

  const sideLabel = I18nManager.t(side === "white" ? "ingame.turn_white" : "ingame.turn_black");

  card.innerHTML = `
    <div class="promotion-modal-header">
      <h2 class="promotion-title">${uiText("promotionTitle")}</h2>
      <p class="promotion-subtitle">
        ${sideLabel} · ${uiText("promotionHint")}
      </p>
    </div>
    <div class="promotion-piece-grid">
      ${PROMOTION_PIECE_OPTIONS.map(
        (opt) => `
        <button type="button" class="promotion-piece-card" data-piece-type="${opt.type}" aria-pressed="false">
          <span class="promotion-piece-symbol">${opt.symbol}</span>
          <div class="promotion-piece-info">
            <span class="promotion-piece-name">${opt.name}</span>
            <span class="promotion-piece-desc">${opt.description}</span>
          </div>
        </button>
      `,
      ).join("")}
    </div>
  `;

  overlay.appendChild(card);
  container.appendChild(overlay);

  const buttons = card.querySelectorAll<HTMLButtonElement>(
    ".promotion-piece-card",
  );
  let selected = false;
  let deliveryTimer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    selected = true;
    if (deliveryTimer !== undefined) clearTimeout(deliveryTimer);
    overlay.remove();
    if (cancelCurrentModal === cancel) cancelCurrentModal = undefined;
  };
  cancelCurrentModal = cancel;
  for (const btn of buttons) {
    btn.addEventListener("click", () => {
      if (selected || !overlay.isConnected || cancelCurrentModal !== cancel) return;
      selected = true;
      const chosenType = btn.dataset.pieceType as PieceType;
      for (const option of buttons) {
        option.setAttribute("aria-disabled", "true");
        option.setAttribute("aria-pressed", String(option === btn));
        option.classList.toggle("promotion-selected", option === btn);
      }
      overlay.classList.add("promotion-closing");
      deliveryTimer = setTimeout(() => {
        if (!overlay.isConnected || cancelCurrentModal !== cancel) return;
        overlay.remove();
        cancelCurrentModal = undefined;
        onSelect(chosenType);
      }, 120);
    });
  }
}
