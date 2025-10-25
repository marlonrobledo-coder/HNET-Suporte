

import { GoogleGenAI } from "@google/genai";
import { FLOWCHART_DATA } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Simplified flowchart for the AI prompt to reduce token count and improve focus
const getSimplifiedFlowchart = () => {
    const simplified: { [key: string]: { id: string; title: string; text: string } } = {};
    for (const key in FLOWCHART_DATA) {
        const node = FLOWCHART_DATA[key];
        simplified[key] = {
            id: node.id,
            title: node.title,
            text: typeof node.text === 'string' ? node.text.substring(0, 200) : node.title, // Keep text short
        };
    }
    return simplified;
}

const flowchartJsonString = JSON.stringify(getSimplifiedFlowchart(), null, 2);

export const findFlowchartStep = async (searchQuery: string): Promise<string | null> => {
  try {
    const prompt = `
      Você é um assistente de IA para um call center de um provedor de internet chamado HNET.
      Sua tarefa é analisar o problema do cliente e o fluxograma de diagnóstico em JSON fornecido.
      Com base na descrição do problema, retorne APENAS o 'id' da etapa mais relevante do fluxograma para iniciar a investigação.
      Não retorne nenhuma outra palavra, explicação ou formatação, apenas o 'id'.

      Exemplos:
      - Se o problema for "luz los piscando", o id relevante é 'check_onu_lights' ou 'los_red_solution'.
      - Se o problema for "wi-fi não conecta", o id relevante é 'wifi_ask_initial_problem'.
      - Se o problema for "tv travando" ou "imagem congelando", o id relevante é 'iptv_start' ou 'iptv_stuttering_check_connection'.
      - Se o problema for "internet caiu", o id relevante é 'problem_selection' ou 'check_onu_lights'.

      Problema do Cliente: "${searchQuery}"

      Fluxograma de Diagnóstico (JSON):
      ${flowchartJsonString}

      ID da Etapa Relevante:
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const candidateId = response.text.trim().replace(/['"`]/g, ''); // Clean the response

    // Validate that the returned ID actually exists in our flowchart
    if (candidateId && FLOWCHART_DATA[candidateId]) {
      return candidateId;
    }
    
    return null; // Return null if the ID is invalid or not found

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};