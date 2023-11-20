import React from 'react';

const ImageGrid = ({ image, selectedImageGrid, onGridSelect }) => {
  if (!image || !image.grids) {
    return null; // If image or grids are null, do not render anything.
  }

  const grids = image.grids;

  return (
    <div className="image-grid">
      {grids.map((grid, index) => (
        <div
          key={index}
          className={`grid ${selectedImageGrid === grid ? 'selected' : ''}`}
          onClick={() => onGridSelect(grid)}
        >
          <img src={grid.src} alt={`Grid ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
