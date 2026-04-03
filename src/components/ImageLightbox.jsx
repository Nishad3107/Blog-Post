export default function ImageLightbox({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white font-body"
          >
            Close
          </button>
        </div>
        <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain rounded-xl" />
      </div>
    </div>
  );
}
