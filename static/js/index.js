'use strict';

document.body.classList.add('js-enabled');

// Keep the manuscript unavailable until the authors supply a public link.
// All content and figures remain readable without external scripts or CDNs.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, moveFocus = false) {
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute('aria-selected', String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
  }
  if (moveFocus) tab.focus();
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
}
if (tabs.length) selectTab(tabs[0]);

const cases = {
  subject: {
    input: 'subject.png',
    prompt: 'A photo of the same dog playing on a beach',
    output: 'subject.png',
    guidance: '',
  },
  canny: {
    input: 'edges.png',
    prompt: 'A red car parked beside a lake at sunset',
    output: 'canny.png',
    guidance: ' --guidance_scale 2.0',
  },
  editing: {
    input: 'source.png',
    prompt: 'Change the sky to sunset while preserving the rest of the scene',
    output: 'edited.png',
    guidance: '',
  },
};
for (const button of document.querySelectorAll('[data-command]')) {
  button.addEventListener('click', () => {
    const sample = cases[button.dataset.command];
    const lines = [
      'CUDA_VISIBLE_DEVICES=0 MODEL_PATH=./ckpts bash scripts/infer.sh',
      '  --lora_path ./checkpoints/pytorch_lora_weights.safetensors',
      `  --input_image ./inputs/${sample.input}`,
      '  --reference_size 512',
      `  --prompt "${sample.prompt}"`,
      `  --output_path ./outputs/${sample.output}`,
      `  --num_inference_steps 50${sample.guidance}`,
    ];
    document.getElementById('inference-command').textContent = lines.join(' \\\n');
    document.getElementById('guidance-note').textContent = sample.guidance ? 'Guidance scale 2.0' : 'Guidance scale 6.0 (default)';
    for (const sibling of document.querySelectorAll('[data-command]')) {
      sibling.setAttribute('aria-pressed', String(sibling === button));
    }
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (_) { /* Try the local-file and older-browser fallback. */ }
  }
  const previousFocus = document.activeElement;
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const succeeded = document.execCommand('copy');
  field.remove();
  previousFocus?.focus();
  if (!succeeded) throw new Error('Clipboard unavailable');
}
for (const button of document.querySelectorAll('[data-copy]')) {
  const originalLabel = button.textContent;
  let resetTimer;
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copy).textContent;
    try {
      await copyText(text);
      button.textContent = 'Copied!';
      document.getElementById('copy-status').textContent = `${button.getAttribute('aria-label')} completed.`;
    } catch (_) {
      button.textContent = 'Select to copy';
      const range = document.createRange();
      range.selectNodeContents(document.getElementById(button.dataset.copy));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.getElementById('copy-status').textContent = 'Clipboard unavailable. Text selected for manual copying.';
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { button.textContent = originalLabel; }, 2500);
  });
}

const dialog = document.getElementById('figure-dialog');
const dialogImage = document.getElementById('dialog-image');
let previousFigure;
for (const button of document.querySelectorAll('[data-lightbox]')) {
  button.addEventListener('click', () => {
    previousFigure = button;
    dialogImage.src = button.dataset.lightbox;
    dialogImage.alt = button.querySelector('img').alt;
    document.getElementById('dialog-caption').textContent = button.dataset.caption;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      window.open(button.dataset.lightbox, '_blank', 'noopener');
    }
  });
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  previousFigure?.focus({ preventScroll: true });
});

const toTop = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', () => { toTop.hidden = window.scrollY < 800; }, { passive: true });
toTop.addEventListener('click', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
});
