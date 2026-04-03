import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const siteUrl = process.env.SITE_URL || 'https://your-domain.com';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase.from('trips').select('id').eq('status', 'published');
if (error) {
  console.error('Failed to fetch trips:', error.message);
  process.exit(1);
}

const tripUrls = (data || []).map((t) => `${siteUrl}/trip/${t.id}`);
const staticUrls = [
  `${siteUrl}/`,
  `${siteUrl}/trips`,
  `${siteUrl}/wishlist`,
  `${siteUrl}/add-story`,
  `${siteUrl}/about`,
];

const urls = [...staticUrls, ...tripUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Sitemap generated with ${urls.length} URLs.`);
