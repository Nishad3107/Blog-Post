import { useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'travelblog_wishlist_v1';

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export function useWishlist() {
  const [items, setItems] = useState(() => readWishlist());

  const isSaved = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  );

  const toggle = useCallback(
    (trip) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === trip.id);
        const next = exists ? prev.filter((item) => item.id !== trip.id) : [trip, ...prev];
        writeWishlist(next);
        return next;
      });
    },
    []
  );

  const value = useMemo(() => ({ items, isSaved, toggle }), [items, isSaved, toggle]);
  return value;
}
