import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { getPrivacyUrl } from '../src/app/blacknovember/_content/privacy.mjs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('somente a árvore /blacknovember expõe a campanha', () => {
  assert.deepEqual(readdirSync(new URL('../src/app/', import.meta.url)).sort(),
    ['blacknovember', 'layout.tsx', 'page.tsx']);
  assert.doesNotMatch(read('src/app/page.tsx'), /redirect\s*\(/);
  assert.match(read('src/app/page.tsx'), /notFound\(\)/);
  assert.doesNotMatch(read('src/app/page.tsx'), /import.*blacknovember/);
  assert.doesNotMatch(read('src/app/layout.tsx'), /metadata|canonical|globals\.css/);
  const form = read('src/app/blacknovember/_components/LeadCaptureForm.tsx');
  assert.match(form, /fetch\("\/blacknovember\/api\/leads"/);
  assert.match(form, /location\.assign\("\/blacknovember\/confirmacao"/);
  assert.equal(getPrivacyUrl(), '/blacknovember/politica-de-privacidade');
});

test('canonical da campanha usa o domínio oficial', () => {
  assert.match(read('src/app/blacknovember/page.tsx'),
    /canonical:\s*["']https:\/\/woatalk\.com\.br\/blacknovember["']/);
});

test('estilos da campanha não atingem html, body ou seletores fora do contêiner', () => {
  const css = read('src/app/blacknovember/campaign.module.css');
  assert.doesNotMatch(css, /:global\((?:html|body|:root)\)/);
  assert.doesNotMatch(css, /url\(["']?\/(?:images|fonts)\//);
  assert.match(css, /\.campaign :global\(button\)/);
  assert.match(read('src/app/blacknovember/layout.tsx'), /className=\{styles\.campaign\}/);
});
