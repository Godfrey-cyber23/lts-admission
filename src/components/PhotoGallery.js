import React, { useState } from 'react';
import { FaImages, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../styles/PhotoGallery.css'; 

const PhotoGallery = () => {
  const [activeAlbum, setActiveAlbum] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  
  const albums = [
    {
      title: "Sports Day 2024",
      photos: [
        { id: 1, src: "/chengelo.jpg", caption: "100m race finals" },
        { id: 2, src: "/school-early-days.jpg", caption: "Tug of war competition" },
        { id: 3, src: "/image1.jpg", caption: "Victory ceremony" }
      ]
    },
    {
      title: "Cultural Festival",
      photos: [
        { id: 4, src: "/founder-signature.jpg", caption: "Traditional dance performance" },
        { id: 5, src: "/founder-signature.jpg", caption: "Art exhibition" }
      ]
    },
    {
      title: "Classroom Activities",
      photos: [
        { id: 6, src: "/pre-school.jpg", caption: "Science experiment" },
        { id: 7, src: "/classroom-2.jpg", caption: "Reading corner" },
        { id: 8, src: "/classroom-2.jpg", caption: "Reading corner" }
      ]
    }
  ];

  const nextPhoto = () => {
    setActivePhoto(prev => 
      prev === albums[activeAlbum].photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setActivePhoto(prev => 
      prev === 0 ? albums[activeAlbum].photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="page-container">
      <h1><FaImages /> Photo Gallery</h1>
      
      <div className="album-selector">
        {albums.map((album, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveAlbum(index);
              setActivePhoto(0);
            }}
            className={activeAlbum === index ? 'active' : ''}
          >
            {album.title}
          </button>
        ))}
      </div>
      
      <div className="gallery-display">
        <button onClick={prevPhoto} className="nav-button">
          <FaArrowLeft />
        </button>
        
        <div className="photo-container">
          <img 
            src={albums[activeAlbum].photos[activePhoto].src} 
            alt={albums[activeAlbum].photos[activePhoto].caption}
          />
          <p className="photo-caption">
            {albums[activeAlbum].photos[activePhoto].caption}
          </p>
        </div>
        
        <button onClick={nextPhoto} className="nav-button">
          <FaArrowRight />
        </button>
      </div>
      
      <div className="photo-thumbnails">
        {albums[activeAlbum].photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.src}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setActivePhoto(index)}
            className={activePhoto === index ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;