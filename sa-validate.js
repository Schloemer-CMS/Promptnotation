#!/usr/bin/env node
/**
 * sa-validate.js — Minimaler CLI-Validator für Semantik‑Anker (sa::)
 * Lizenz: MIT (für dieses Tool); Spec unter CC BY 4.0
 */
const fs = require('fs');

const RE = /^[a-z0-9][a-z0-9-_\/#]*(::[a-z0-9][a-z0-9-_\/#]*)+$/;
const MIN_SEG = 3, MAX_SEG = 6, MAX_LEN = 32;

function analyze(chain) {
  const original = chain;
  const s = chain.trim().toLowerCase();
  const okRegex = RE.test(s);
  const segments = s.split('::');
  const hints = [];

  if (!okRegex) hints.push('Regex-Fehler (Zeichen/Syntax)');
  if (segments.length < MIN_SEG || segments.length > MAX_SEG) {
    hints.push(`Segmentanzahl ${segments.length} ist außerhalb 3–6`);
  }
  for (const seg of segments) {
    if (!seg) hints.push('Leeres Segment');
    if (seg.length > MAX_LEN) hints.push(`Segment zu lang: "${seg}" (${seg.length})`);
    if (/^(und|allgemein|misc|divers)$/.test(seg)) hints.push(`Unpräzises Segment: "${seg}"`);
  }
  return {
    input: original,
    normalized: s,
    valid: okRegex && hints.length === 0,
    segments,
    hints
  };
}

function printHuman(res) {
  const status = res.valid ? 'OK' : 'FAIL';
  const hint = res.hints.length ? ' — ' + res.hints.join('; ') : '';
  console.log(`${status}: ${res.input}${hint}`);
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const fileIdx = args.indexOf('--file');
  const targets = [];

  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const path = args[fileIdx + 1];
    const content = fs.readFileSync(path, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      if (line.trim()) targets.push(line.trim());
    });
  } else {
    // Remaining args treated as chains unless none: then read stdin
    const argChains = args.filter(a => !a.startsWith('--'));
    if (argChains.length) {
      targets.push(...argChains);
    } else {
      const data = fs.readFileSync(0, 'utf8'); // stdin
      data.split(/\r?\n/).forEach(line => {
        if (line.trim()) targets.push(line.trim());
      });
    }
  }

  if (!targets.length) {
    console.error('Usage: node sa-validate.js [--json] [--file path] [chain ...]');
    process.exit(2);
  }

  let anyFail = false;
  for (const t of targets) {
    const res = analyze(t);
    if (json) {
      console.log(JSON.stringify(res));
    } else {
      printHuman(res);
    }
    if (!res.valid) anyFail = true;
  }
  process.exit(anyFail ? 1 : 0);
}

if (require.main === module) main();
