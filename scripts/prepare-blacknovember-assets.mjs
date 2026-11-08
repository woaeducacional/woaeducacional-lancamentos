import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const publicDir = new URL('../public/', import.meta.url);
for (const folder of ['images', 'fonts']) {
  const destination = new URL('blacknovember/' + folder + '/', publicDir);
  mkdirSync(destination, { recursive: true });
  cpSync(fileURLToPath(new URL(folder, publicDir)), fileURLToPath(destination), { recursive: true });
}
