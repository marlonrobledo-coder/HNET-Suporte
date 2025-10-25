import React, { useState, useRef } from 'react';
import { Equipment, EquipmentModel } from '../types';
import { WifiIcon, ServerIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, CameraIcon } from './Icons';
import { ONU_MODELS_DATA, ROUTER_MODELS_DATA } from '../constants';

interface EquipmentCardProps {
    equipment: Equipment;
    onNoteChange: (id: number, notes: string) => void;
    onModelChange: (id: number, model: string) => void;
    onImageChange: (modelName: string, imageUrl: string) => void;
    onImageClick: (imageUrl: string) => void;
    customImages: { [modelName: string]: string };
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onNoteChange, onModelChange, onImageChange, onImageClick, customImages }) => {
    const isONU = equipment.type === 'ONU';
    const [notes, setNotes] = useState(equipment.notes);
    const modelOptions: EquipmentModel[] = isONU ? ONU_MODELS_DATA : ROUTER_MODELS_DATA;
    const selectedModelData = modelOptions.find(m => m.name === equipment.model);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageUrl = customImages[equipment.model] || selectedModelData?.imageUrl;

    const handleNotesBlur = () => {
        onNoteChange(equipment.id, notes);
    };

    const handleModelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onModelChange(equipment.id, e.target.value);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onImageChange(equipment.model, reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const StatusIcon = () => {
        switch (equipment.status) {
            case 'Online':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'Offline':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'Alerta':
                return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    {isONU ? <ServerIcon className="h-6 w-6 text-gray-500 mr-3" /> : <WifiIcon className="h-6 w-6 text-gray-500 mr-3" />}
                    <p className="font-bold text-gray-800">{equipment.type}</p>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-sm ml-2">
                    <StatusIcon />
                    <span className="ml-1.5 font-medium">{equipment.status}</span>
                </div>
            </div>

            <div>
                 <label htmlFor={`model-${equipment.id}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Modelo do Equipamento
                </label>
                <select
                    id={`model-${equipment.id}`}
                    value={equipment.model}
                    onChange={handleModelSelectChange}
                    className="text-sm text-gray-800 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full"
                >
                    {modelOptions.map(modelData => (
                        <option key={modelData.name} value={modelData.name}>{modelData.name}</option>
                    ))}
                </select>

                {imageUrl && (
                    <div className="mt-3 bg-gray-50 p-2 rounded-md border flex justify-center items-center">
                        <img 
                            src={imageUrl} 
                            alt={equipment.model}
                            className="object-contain h-28 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onImageClick(imageUrl)}
                        />
                    </div>
                )}
            </div>
            
            <div className="mt-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md py-2 transition-colors"
                >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Adicionar/Alterar Foto
                </button>
            </div>

            <div className='mt-4'>
                <label htmlFor={`notes-${equipment.id}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Anotações do Agente
                </label>
                <textarea
                    id={`notes-${equipment.id}`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    rows={3}
                    placeholder="Adicionar notas sobre o equipamento..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                ></textarea>
            </div>
        </div>
    )
}


interface EquipmentPanelProps {
  equipment: Equipment[];
  onNoteChange: (id: number, notes: string) => void;
  onModelChange: (id: number, model: string) => void;
  onImageChange: (modelName: string, imageUrl: string) => void;
  onImageClick: (imageUrl: string) => void;
  customImages: { [modelName: string]: string };
}

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment, onNoteChange, onModelChange, onImageChange, onImageClick, customImages }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Equipamentos do Cliente</h3>
      <div className="space-y-4">
        {equipment.map(eq => (
          <EquipmentCard 
            key={eq.id} 
            equipment={eq} 
            onNoteChange={onNoteChange} 
            onModelChange={onModelChange} 
            onImageChange={onImageChange} 
            onImageClick={onImageClick}
            customImages={customImages}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentPanel;