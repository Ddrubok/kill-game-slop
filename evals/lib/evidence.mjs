import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function freshDirectory(value) {
  if (!value || value.startsWith('--')) throw new Error('Supply a new output directory');
  const out = path.resolve(value);
  await mkdir(path.dirname(out), { recursive: true });
  try { await mkdir(out); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Refusing to reuse evidence directory: ${out}`);
    throw error;
  }
  return out;
}

export async function writeJSON(file, value) {
  await writeFile(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}

export async function screenshot(page, file, options = {}) {
  // Capture to memory first: Playwright's path option otherwise overwrites files.
  const data = await page.screenshot(options);
  await writeFile(file, data, { flag: 'wx' });
}

// Serialized into the page; deliberately no whole-page text or account fields.
export function selectionState() {
  const r = globalThis.__presentationQA();
  const visible = e => {
    if (!e) return false;
    const box = e.getBoundingClientRect();
    return !!box.width && !!box.height && getComputedStyle(e).visibility !== 'hidden';
  };
  return {
    selected: r.aimRuntime.selectedPieceId, phase: r.turnRuntime.phase,
    side: r.turnRuntime.currentSide, mode: r.inputRuntime.mode,
    previewVisible: visible(r.aimParametersRuntime.root), redDot: r.aimParametersRuntime.redDot.visible,
    actionBarVisible: visible(document.querySelector('.strike-action-bar')),
    strikePanelVisible: visible(document.querySelector('.strike-point-panel')),
    buttons: [...document.querySelectorAll('.strike-action-bar button')].filter(visible).map(e => ({
      action: e.dataset.action, pressed: e.getAttribute('aria-pressed'), bounds: e.getBoundingClientRect().toJSON(),
    })),
  };
}
