import { useEffect } from 'react';

export default function Toast({ message, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl shadow-xl font-body text-sm animate-[toast-in_0.25s_ease-out]">
        {message}
      </div>
    </div>
  );
}
