import { mkdir, readdir, copyFile } from 'node:fs/promises';
const source = new URL('../../server/shared/', import.meta.url);
const target = new URL('../src/shared/', import.meta.url);
await mkdir(target, {recursive: true});
try { for (const name of await readdir(source)) if (name.endsWith('.js')) await copyFile(new URL(name, source), new URL(name, target)); }
catch (error) { if (error.code !== 'ENOENT') throw error; console.log('Shared source not present; using checked-in client modules.'); }
