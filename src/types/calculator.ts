/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppTab = 'visual' | 'editor' | 'templates' | 'generator' | 'guide';

export type CalcMode = 'basic' | 'scientific' | 'programmer';

export type AngleUnit = 'deg' | 'rad';

export interface HistoryItem {
  id: string;
  expression: string;
  pythonCode: string;
  result: string;
  numericResult?: number;
  timestamp: string;
  isError?: boolean;
}

export interface PythonTemplate {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  filename: string;
  description: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  code: string;
  concepts: {
    name: string;
    description: string;
  }[];
  runnableInEditor: boolean;
}

export interface GeneratorConfig {
  paradigm: 'procedural' | 'functions' | 'oop' | 'tkinter';
  operations: {
    basic: boolean;
    power: boolean;
    sqrt: boolean;
    modulo: boolean;
    trig: boolean;
    log: boolean;
    factorial: boolean;
    percentage: boolean;
    stats: boolean;
  };
  features: {
    typeHints: boolean;
    docstrings: boolean;
    errorHandling: boolean;
    keepHistory: boolean;
    colorOutput: boolean;
    inputLoop: boolean;
  };
  authorName: string;
  calculatorTitle: string;
}

export interface ExecutionResult {
  stdout: string[];
  returnValue: string | null;
  error: string | null;
  executionTimeMs: number;
  variables: Record<string, string>;
}
