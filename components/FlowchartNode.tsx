
import React from 'react';
import { FlowchartNode as FlowchartNodeType } from '../types';
import { ArrowLeftIcon, ArrowPathIcon } from './Icons';

interface FlowchartNodeProps {
  node: FlowchartNodeType;
  onNavigate: (nodeId: string) => void;
  onReset: () => void;
}

const getButtonStyle = (style: 'primary' | 'secondary' | 'danger' | undefined) => {
    switch (style) {
        case 'danger':
            return 'bg-red-600 hover:bg-red-700';
        case 'secondary':
            return 'bg-gray-500 hover:bg-gray-600';
        default:
            return 'bg-blue-600 hover:bg-blue-700';
    }
}

const FlowchartNode: React.FC<FlowchartNodeProps> = ({ node, onNavigate, onReset }) => {
  if (!node) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-bold text-red-600">Erro no Fluxograma</h3>
        <p className="text-gray-600 mt-2">A etapa solicitada não foi encontrada. Por favor, reinicie o atendimento.</p>
        <button onClick={onReset} className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
          <ArrowPathIcon className="h-5 w-5 mr-2"/>
          Reiniciar
        </button>
      </div>
    );
  }

  const Icon = node.icon;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl animate-fade-in">
      <div className="flex items-start mb-6">
        {Icon && (
          <div className="mr-4 flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{node.title}</h3>
        </div>
      </div>
      
      <div className="text-gray-700 text-base leading-relaxed prose max-w-none">
        {typeof node.text === 'string' ? <p>{node.text}</p> : node.text}
      </div>

      <div className="mt-8 border-t pt-6">
        {node.options && (
          <div className="space-y-4">
            <p className="font-semibold text-gray-600 mb-2">Selecione uma opção:</p>
            {node.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onNavigate(option.nextNodeId)}
                className={`w-full text-left text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200 shadow-sm ${getButtonStyle(option.style)}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
        {node.nextNodeId && (
          <button
            onClick={() => onNavigate(node.nextNodeId)}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Próximo Passo
          </button>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors flex items-center"
        >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Reiniciar Fluxo
        </button>
      </div>
    </div>
  );
};

export default FlowchartNode;
