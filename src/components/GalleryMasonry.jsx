export default function GalleryMasonry({ images = [] }) {
  return (
    <div className="masonry-grid">
      {images.map((img, index) => (
        <figure key={img} className="masonry-item">
          <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" />
          <figcaption className="masonry-caption">View Story</figcaption>
        </figure>
      ))}
    </div>
  );
}
