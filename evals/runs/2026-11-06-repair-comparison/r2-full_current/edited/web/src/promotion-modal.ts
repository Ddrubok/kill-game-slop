import { I18nManager } from "./i18n";
import { uiText } from "./ui-text";
/**
 * 폰 승급(프로모션) 선택 모달
 * 상대 진영 끝에서 1턴 생존한 폰을 4종 기물(퀸, 룩, 비숍, 나이트) 중 하나로 선택하는 UI
 */

import type { PieceType } from "./config";
import type { PieceSide } from "./layout";

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
  const existing = document.querySelector(".promotion-modal-overlay");
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "promotion-modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "promotion-modal-title");

  const card = document.createElement("div");
  card.className = "promotion-modal-card";

  const sideLabel = I18nManager.t(side === "white" ? "ingame.turn_white" : "ingame.turn_black");

  card.innerHTML = `
    <div class="promotion-modal-header">
      <h2 class="promotion-title" id="promotion-modal-title">${uiText("promotionTitle")}</h2>
      <p class="promotion-subtitle">
        ${sideLabel} · ${uiText("promotionHint")}
      </p>
    </div>
    <div class="promotion-piece-grid">
      ${PROMOTION_PIECE_OPTIONS.map(
        (opt) => `
        <button class="promotion-piece-card" data-piece-type="${opt.type}">
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
  buttons[0]?.focus();
  let selectionPending = false;
  for (const btn of buttons) {
    btn.addEventListener("click", () => {
      if (selectionPending || !overlay.isConnected || document.querySelector(".promotion-modal-overlay") !== overlay) return;
      selectionPending = true;
      const chosenType = btn.dataset.pieceType as PieceType;
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(button === btn));
        button.disabled = true;
      }
      btn.classList.add("promotion-selected");
      overlay.classList.add("promotion-closing");
      setTimeout(() => {
        if (!overlay.isConnected || document.querySelector(".promotion-modal-overlay") !== overlay) return;
        overlay.remove();
        onSelect(chosenType);
      }, 120);
    });
  }
}
