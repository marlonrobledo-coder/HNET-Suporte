import React from 'react';
import { XMarkIcon } from './Icons';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Visualização ampliada da imagem do equipamento"
    >
      <div 
        className="relative bg-white p-4 rounded-lg shadow-2xl max-w-3xl max-h-[90vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 bg-white rounded-full p-1 hover:bg-gray-200 hover:text-gray-800 transition-colors z-10"
            aria-label="Fechar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <img 
            src={imageUrl} 
            alt="Visualização ampliada do equipamento" 
            className="object-contain w-full h-full max-h-[calc(90vh-2rem)]"
        />
      </div>
    </div>
  );
};

export default ImageModal;
