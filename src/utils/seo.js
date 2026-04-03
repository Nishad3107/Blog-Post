export function setMeta({ title, description, image, url }) {
  if (typeof document === 'undefined') return;
  if (title) document.title = title;

  const ensure = (selector, attr, value) => {
    if (!value) return;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace(/meta\\[|\\]/g, '').split('=');
      if (key && val) el.setAttribute(key, val.replace(/\"/g, ''));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  ensure('meta[name="description"]', 'content', description);
  ensure('meta[property="og:title"]', 'content', title);
  ensure('meta[property="og:description"]', 'content', description);
  ensure('meta[property="og:image"]', 'content', image);
  ensure('meta[property="og:url"]', 'content', url);
  ensure('meta[property="og:type"]', 'content', 'website');
  ensure('meta[name="twitter:card"]', 'content', 'summary_large_image');
  ensure('meta[name="twitter:title"]', 'content', title);
  ensure('meta[name="twitter:description"]', 'content', description);
  ensure('meta[name="twitter:image"]', 'content', image);
}
