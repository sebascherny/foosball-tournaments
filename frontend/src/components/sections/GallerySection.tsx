import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../utils/api';

interface GalleryImage {
  id: number;
  title: string;
  image: string;
  description: string;
  order: number;
}

const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(getApiUrl('/api/gallery/'));
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Local team logos
        const localImages = [
          {
            id: 1,
            title: "ALSA Team Logo",
            image: "/images/logos/alsa.png",
            description: "Official logo of ALSA team",
            order: 1
          },
          {
            id: 2,
            title: "Desubikaos Team Logo",
            image: "/images/logos/desubikaos.png",
            description: "Official logo of Desubikaos team",
            order: 2
          },
          {
            id: 3,
            title: "Rompeniekos Team Logo",
            image: "/images/logos/rompeniekos.png",
            description: "Official logo of Rompeniekos team",
            order: 3
          },
          {
            id: 4,
            title: "Txapeldunas Team Logo",
            image: "/images/logos/txapeldunas.png",
            description: "Official logo of Txapeldunas team",
            order: 4
          },
          {
            id: 5,
            title: "Txokofingers Team Logo",
            image: "/images/logos/txokofingers.png",
            description: "Official logo of Txokofingers team",
            order: 5
          },
          {
            id: 6,
            title: "Vecinos VK Team Logo",
            image: "/images/logos/vecinos_vk.png",
            description: "Official logo of Vecinos VK team",
            order: 6
          }
        ];
        setImages(localImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="gallery" className="section-container bg-purple-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">GALERÍA</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando imágenes...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Main Image Display */}
            <div className="relative">
              <img
                src={images[currentIndex].image}
                alt={images[currentIndex].title}
                className="w-full h-96 object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                disabled={images.length <= 1}
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                disabled={images.length <= 1}
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
            
            {/* Image Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {images[currentIndex].title}
              </h3>
              <p className="text-gray-600">
                {images[currentIndex].description}
              </p>
            </div>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="px-6 pb-6">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentIndex 
                          ? 'border-primary-600' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay imágenes disponibles en la galería</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
