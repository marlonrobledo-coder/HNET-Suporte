import React, { useState, useCallback, useMemo } from 'react';
import { Equipment, FlowchartNode as FlowchartNodeType } from './types';
import { FLOWCHART_DATA, INITIAL_EQUIPMENT } from './constants';
import { findFlowchartStep } from './services/geminiService';
import Header from './components/Header';
import FlowchartNode from './components/FlowchartNode';
import EquipmentPanel from './components/EquipmentPanel';
import ImageModal from './components/ImageModal';
import { WifiIcon, SignalSlashIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customEquipmentImages, setCustomEquipmentImages] = useState<{ [modelName: string]: string }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const currentNode: FlowchartNodeType = useMemo(() => FLOWCHART_DATA[currentNodeId], [currentNodeId]);

  const handleReset = useCallback(() => {
    setCurrentNodeId('start');
    setError(null);
  }, []);

  const handleNavigation = useCallback((nodeId: string) => {
    if (FLOWCHART_DATA[nodeId]) {
      setCurrentNodeId(nodeId);
      setError(null);
    } else {
      setError('Etapa do fluxograma não encontrada.');
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const targetNodeId = await findFlowchartStep(query);
      if (targetNodeId && FLOWCHART_DATA[targetNodeId]) {
        setCurrentNodeId(targetNodeId);
      } else {
        setError('Não foi possível encontrar uma etapa relevante para sua busca. Tente novamente.');
        setCurrentNodeId('search_fallback');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao buscar com a IA. Por favor, tente novamente.');
      setCurrentNodeId('search_fallback');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNoteChange = (id: number, notes: string) => {
    setEquipment(prevEquipment =>
      prevEquipment.map(eq => (eq.id === id ? { ...eq, notes } : eq))
    );
  };

  const handleModelChange = (id: number, model: string) => {
    setEquipment(prevEquipment =>
      prevEquipment.map(eq => (eq.id === id ? { ...eq, model } : eq))
    );
  };

  const handleModelImageChange = (modelName: string, imageUrl: string) => {
    setCustomEquipmentImages(prev => ({
      ...prev,
      [modelName]: imageUrl,
    }));
  };
  
  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const getStarted = () => {
    handleNavigation('problem_selection');
  };

  const renderStartScreen = () => (
    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
            <WifiIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo à Ferramenta de Suporte HNET</h2>
        <p className="text-gray-600 mb-8 text-lg">
            Esta ferramenta irá guiá-lo no diagnóstico e resolução de problemas de internet dos clientes.
        </p>
        <button
            onClick={getStarted}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg shadow-md"
        >
            Iniciar Atendimento
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header onSearch={handleSearch} isLoading={isLoading} />
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin" style={{borderTopColor: '#3498db'}}></div>
                <p className="ml-4 text-gray-600">A IA está analisando o problema...</p>
              </div>
            )}
            {!isLoading && error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative shadow-md" role="alert">
                 <strong className="font-bold mr-2"><ExclamationTriangleIcon className="inline-block h-5 w-5 -mt-1"/> Erro:</strong>
                 <span className="block sm:inline">{error}</span>
              </div>
            )}
            {!isLoading && currentNodeId === 'start' && renderStartScreen()}
            {!isLoading && currentNodeId !== 'start' && (
              <FlowchartNode
                node={currentNode}
                onNavigate={handleNavigation}
                onReset={handleReset}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <EquipmentPanel 
              equipment={equipment} 
              onNoteChange={handleNoteChange}
              onModelChange={handleModelChange}
              onImageChange={handleModelImageChange}
              onImageClick={handleImageClick}
              customImages={customEquipmentImages}
            />
          </div>
        </div>
      </main>
      {modalImage && <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />}
    </div>
  );
};

export default App;