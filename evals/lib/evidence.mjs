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
export async function selectionState() {
  const r = globalThis.__presentationQA();
  const presentation = async e => {
    if (!e) return { hasLayoutBox: false, cssVisible: false, intersectsViewport: false, clippedViewportRatio: 0 };
    const box = e.getBoundingClientRect();
    const hasLayoutBox = box.width > 0 && box.height > 0;
    // Native intersection accounts for ancestor clipping, but not occlusion by other elements.
    const clippedViewportRatio = await new Promise(resolve => {
      const observer = new IntersectionObserver(([entry]) => { observer.disconnect(); resolve(entry.intersectionRatio); });
      observer.observe(e);
    });
    return { hasLayoutBox, cssVisible: e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }),
      intersectsViewport: hasLayoutBox && box.right > 0 && box.bottom > 0 && box.left < innerWidth && box.top < innerHeight,
      clippedViewportRatio };
  };
  const [preview, actionBar, strikePanel, buttons] = await Promise.all([
    presentation(r.aimParametersRuntime.root), presentation(document.querySelector('.strike-action-bar')),
    presentation(document.querySelector('.strike-point-panel')),
    Promise.all([...document.querySelectorAll('.strike-action-bar button')].map(async e => ({
      action: e.dataset.action, pressed: e.getAttribute('aria-pressed'), bounds: e.getBoundingClientRect().toJSON(),
      presentation: await presentation(e),
    }))),
  ]);
  return {
    selected: r.aimRuntime.selectedPieceId, phase: r.turnRuntime.phase,
    side: r.turnRuntime.currentSide, mode: r.inputRuntime.mode,
    preview, actionBar, strikePanel, redDot: r.aimParametersRuntime.redDot.visible,
    buttons: buttons.filter(b => b.presentation.cssVisible),
  };
}
