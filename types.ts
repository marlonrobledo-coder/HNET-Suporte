import React from 'react';

export enum NodeType {
  QUESTION = 'question',
  SOLUTION = 'solution',
  ACTION = 'action',
  START = 'start'
}

export interface FlowchartNodeOption {
  text: string;
  nextNodeId: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface FlowchartNode {
  id: string;
  type: NodeType;
  title: string;
  text: string | React.ReactNode;
  options?: FlowchartNodeOption[];
  nextNodeId?: string;
  icon?: React.ElementType;
}

export interface EquipmentModel {
  name: string;
  imageUrl: string;
}

export interface Equipment {
  id: number;
  type: 'ONU' | 'Roteador';
  model: string;
  status: 'Online' | 'Offline' | 'Alerta';
  notes: string;
}