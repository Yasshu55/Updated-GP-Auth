import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import img7 from '../assets/img7.jpg';
import img8 from '../assets/img8.jpg';
import img9 from '../assets/img9.jpg';

function Login() {
  const compareArrays = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  };

  const [isNext, setIsNext] = useState(false);
  const [email, setUsername] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([null, null, null]);
  const [selectedGrids, setSelectedGrids] = useState([null, null, null]);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [imageLayers,setImageLayers] = useState([
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 1
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 2
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 3
  ]);

  const [isPass, setIsPass] = useState(false);
  const [isGridSelection, setIsGridSelection] = useState(false);
  const navigate = useNavigate();

  const handleImageSelection = (layerIndex, imageIndex) => {
    const newSelectedImages = [...selectedImages];
    const imagePath = imageLayers[layerIndex][imageIndex];
    newSelectedImages[layerIndex] = imagePath;
    setSelectedImages(newSelectedImages);

    const selectedImage = new Image();
    selectedImage.src = imagePath;
    selectedImage.onload = () => {
      const grids = generateGrids(selectedImage);
      setSelectedGrids(grids);
      setIsGridSelection(true);
    };
  };

  const handleGridSelection = (grid) => {
    if (isGridSelection) {
      selectedPatterns[currentLayer] = grid.pattern;
      setIsGridSelection(false);

      if (currentLayer < 2) {
        setCurrentLayer(currentLayer + 1);
        setSelectedImages([...selectedImages, null]);
        setSelectedGrids([...selectedGrids, null]);
      } else {
        setIsPass(true);
      }
    }
  };

  const generateGrids = (imageElement) => {
    const gridSize = 3;
    const gridWidth = imageElement.width / gridSize;
    const gridHeight = imageElement.height / gridSize;
    const grids = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * gridWidth;
        const y = row * gridHeight;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = gridWidth;
        canvas.height = gridHeight;
        ctx.drawImage(imageElement, x, y, gridWidth, gridHeight, 0, 0, gridWidth, gridHeight);

        const dataURL = canvas.toDataURL();
        const pattern = String.fromCharCode(65 + row * gridSize + col);

        grids.push({
          src: dataURL,
          pattern: pattern,
        });
      }
    }

    return grids;
  };

  const handleNext = (e) => {
    e.preventDefault();
  
    // Shuffle the imageLayers array
    const shuffledImageLayers = imageLayers.map((layer) => shuffleArray(layer));
  
    setImageLayers(shuffledImageLayers);
    setIsNext(true);
  };
  
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = {
      username: email,
      selectedImages,
      selectedPatterns,
    };

    try {
      // Replace the following code with your logic for checking user credentials
      const storedUserData = JSON.parse(localStorage.getItem('userData'));

      if (
        storedUserData &&
        storedUserData.email === email &&
        compareArrays(storedUserData.selectedImages, selectedImages) &&
        compareArrays(storedUserData.selectedPatterns, selectedPatterns)
      ) {
        console.log('Login successful');
        navigate('/dashboard');
        // You can add code to navigate to the home page here
      } else {
        console.error('Invalid login credentials. Please try again.');
        alert("Invalid login credentials. Please try again.😔 😔 ")
        navigate('/');
        // You can display an error message to the user or handle the error as needed
      }
    } catch (error) {
      console.error('Error validating login:', error);
      // Handle the error as needed
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={email}
          />
        </div>
        <button onClick={handleNext}>Next</button>
        {isNext && (
          <div className="image-selection">
            <h3>Layer {currentLayer + 1}</h3>
            {isGridSelection ? (
              <div className="grid-selection">
                {selectedGrids.map((grid, gridIndex) => (
                  <div
                    key={gridIndex}
                    className="grid"
                    onClick={() => handleGridSelection(grid)}
                  >
                    <img src={grid.src} alt={`Grid ${grid.pattern}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="image-container">
                {imageLayers[currentLayer].map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`image ${selectedImages[currentLayer] === image ? 'selected' : ''}`}
                    onClick={() => handleImageSelection(currentLayer, imageIndex)}
                  >
                    <img src={image} alt={`Image ${imageIndex + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {isPass && (
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default Login;