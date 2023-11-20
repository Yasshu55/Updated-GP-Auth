import React, { useState } from 'react';
import './Register.css'; // Import your CSS file

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import img7 from '../assets/img7.jpg';
import img8 from '../assets/img8.jpg';
import img9 from '../assets/img9.jpg';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    age: '',
  });

  const [selectedImages, setSelectedImages] = useState([]); // Initialize as an empty array
  const [selectedPatterns, setSelectedPatterns] = useState([null, null, null]);
  const [selectedGrids, setSelectedGrids] = useState([null, null, null]);
  const [currentLayer, setCurrentLayer] = useState(0); // Track the current layer
  const [imageLayers,setImageLayers] = useState([
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 1
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 2
    [img1, img2, img3, img4, img5, img6, img7, img8, img9], // Layer 3
  ]);
  const [isPass, setIsPass] = useState(false);
  const [isGridSelection, setIsGridSelection] = useState(false);
  const squarePatterns = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I'],
  ];

  const handleImageSelection = (layerIndex, imageIndex) => {
    const newSelectedImages = [...selectedImages];
    const imagePath = imageLayers[layerIndex][imageIndex]; // Get the selected image path
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

      // If patterns are selected for all three layers, allow moving to the next layer
      if (currentLayer < 2) {
        setCurrentLayer(currentLayer + 1);
        setSelectedImages([...selectedImages, null]); // Add a placeholder for the next layer
        setSelectedGrids([...selectedGrids, null]);
      } else {
        setIsPass(true); // Show submit button
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      selectedImages,
      selectedPatterns,
    };
  
    try {
      // Save user data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('Data sent to the server:', userData);
      // const response = await axios.post('your-backend-api-endpoint', userData);
      // navigate("/Home")
      alert("Registration Successful")
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  };
  

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
  
    // Shuffle the imageLayers array
    const shuffledImageLayers = imageLayers.map((layer) => shuffleArray(layer));
  
    setImageLayers(shuffledImageLayers);
    setIsPass(true);
  };
  
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  

  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Registration</h2>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            onChange={handleFormChange}
            value={formData.firstName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            onChange={handleFormChange}
            value={formData.lastName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            onChange={handleFormChange}
            value={formData.phoneNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={handleFormChange}
            value={formData.email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="text"
            name="age"
            id="age"
            onChange={handleFormChange}
            value={formData.age}
          />
        </div>
        <button onClick={handlePasswordSubmit}>Set Password</button>
        {isPass && (
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
        {/* Render the next button only if there are more layers to go */
          currentLayer < 2 && !isPass && (
            <button onClick={() => setCurrentLayer(currentLayer + 1)}>Next Layer</button>
          )}
        {/* Render the submit button if all layers are done */}
        {isPass && (
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default Register;
