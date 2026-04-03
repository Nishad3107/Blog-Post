import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const csvPath = process.argv[2] || path.join(process.cwd(), 'supabase/seed/trips.csv');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const parseCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current);
  return result.map((v) => v.trim());
};

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split('\n').filter(Boolean);
const headers = parseCsvLine(lines.shift());
const rows = lines.map((line) => {
  const values = parseCsvLine(line);
  const row = {};
  headers.forEach((h, i) => {
    row[h] = values[i] || '';
  });
  row.tags = row.tags ? row.tags.split('|').map((t) => t.trim()).filter(Boolean) : [];
  return row;
});

const { error } = await supabase.from('trips').insert(rows);
if (error) {
  console.error('Import failed:', error.message);
  process.exit(1);
}
console.log(`Imported ${rows.length} trips.`);
