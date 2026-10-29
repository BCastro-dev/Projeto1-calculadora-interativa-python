/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Wand2,
  Download,
  Copy,
  Check,
  Play,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { GeneratorConfig } from '../types/calculator';
import { generateCustomPythonCalculator } from '../services/codeGenerator';

interface CustomCalculatorGeneratorProps {
  onLoadInEditor: (code: string) => void;
}

export const CustomCalculatorGenerator: React.FC<CustomCalculatorGeneratorProps> = ({
  onLoadInEditor,
}) => {
  const [config, setConfig] = useState<GeneratorConfig>({
    paradigm: 'oop',
    calculatorTitle: 'Calculadora Pro Python',
    authorName: 'Desenvolvedor',
    operations: {
      basic: true,
      power: true,
      sqrt: true,
      modulo: false,
      trig: false,
      log: false,
      factorial: false,
      percentage: false,
      stats: false,
    },
    features: {
      typeHints: true,
      docstrings: true,
      errorHandling: true,
      keepHistory: true,
      colorOutput: true,
      inputLoop: true,
    },
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Generate code dynamically
  const generatedCode = useMemo(() => {
    return generateCustomPythonCalculator(config);
  }, [config]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${config.calculatorTitle.toLowerCase().replace(/\s+/g, '_')}.py`;
    const blob = new Blob([generatedCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleOp = (key: keyof GeneratorConfig['operations']) => {
    setConfig((prev) => ({
      ...prev,
      operations: { ...prev.operations, [key]: !prev.operations[key] },
    }));
  };

  const toggleFeature = (key: keyof GeneratorConfig['features']) => {
    setConfig((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Intro */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Gerador de Calculadora Python Sob Medida
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Personalize as operações, o paradigma de programação e os recursos extras. O código Python
          é gerado em tempo real, pronto para copiar ou executar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
          {/* Metadata inputs */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome da Calculadora:
              </label>
              <input
                type="text"
                value={config.calculatorTitle}
                onChange={(e) => setConfig({ ...config, calculatorTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: Minha Calculadora Python"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Autor do Código:
              </label>
              <input
                type="text"
                value={config.authorName}
                onChange={(e) => setConfig({ ...config, authorName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Seu nome"
              />
            </div>
          </div>

          {/* Paradigm Selection */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Escolha o Paradigma de Programação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfig({ ...config, paradigm: 'procedural' })}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  config.paradigm === 'procedural'
                    ? 'bg-blue-950/60 border-blue-500/80 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-slate-200">CLI / Terminal</div>
                <div className="text-[11px] text-slate-500">Menu com laço while</div>
              </button>

              <button
                onClick={() => setConfig({ ...config, paradigm: 'functions' })}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  config.paradigm === 'functions'
                    ? 'bg-blue-950/60 border-blue-500/80 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-slate-200">Funções Modulares</div>
                <div className="text-[11px] text-slate-500">Funções puras isoladas</div>
              </button>

              <button
                onClick={() => setConfig({ ...config, paradigm: 'oop' })}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  config.paradigm === 'oop'
                    ? 'bg-blue-950/60 border-blue-500/80 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-slate-200">Orientação a Objetos</div>
                <div className="text-[11px] text-slate-500">Classe Calculadora</div>
              </button>

              <button
                onClick={() => setConfig({ ...config, paradigm: 'tkinter' })}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  config.paradigm === 'tkinter'
                    ? 'bg-blue-950/60 border-blue-500/80 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-slate-200">Interface Gráfica (Tkinter)</div>
                <div className="text-[11px] text-slate-500">Janela desktop nativa</div>
              </button>
            </div>
          </div>

          {/* Operations to Include */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Operações Matemáticas
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.operations.basic}
                  onChange={() => toggleOp('basic')}
                  className="rounded text-blue-500 focus:ring-0"
                />
                <span className="text-slate-300">Básicas (+, -, *, /)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.operations.power}
                  onChange={() => toggleOp('power')}
                  className="rounded text-blue-500 focus:ring-0"
                />
                <span className="text-slate-300">Potenciação (**)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.operations.sqrt}
                  onChange={() => toggleOp('sqrt')}
                  className="rounded text-blue-500 focus:ring-0"
                />
                <span className="text-slate-300">Raiz Quadrada (√)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.operations.modulo}
                  onChange={() => toggleOp('modulo')}
                  className="rounded text-blue-500 focus:ring-0"
                />
                <span className="text-slate-300">Resto da Divisão (%)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.operations.percentage}
                  onChange={() => toggleOp('percentage')}
                  className="rounded text-blue-500 focus:ring-0"
                />
                <span className="text-slate-300">Porcentagem (%)</span>
              </label>
            </div>
          </div>

          {/* Engineering Best Practices */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Boas Práticas do Python
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <span className="text-slate-300">Type Hints (PEP 484)</span>
                <input
                  type="checkbox"
                  checked={config.features.typeHints}
                  onChange={() => toggleFeature('typeHints')}
                  className="rounded text-blue-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <span className="text-slate-300">Docstrings Explicativas (PEP 257)</span>
                <input
                  type="checkbox"
                  checked={config.features.docstrings}
                  onChange={() => toggleFeature('docstrings')}
                  className="rounded text-blue-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                <span className="text-slate-300">Tratamento de Exceções (try / except)</span>
                <input
                  type="checkbox"
                  checked={config.features.errorHandling}
                  onChange={() => toggleFeature('errorHandling')}
                  className="rounded text-blue-500 focus:ring-0"
                />
              </label>

              {config.paradigm === 'oop' && (
                <label className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 cursor-pointer">
                  <span className="text-slate-300">Histórico de Operações</span>
                  <input
                    type="checkbox"
                    checked={config.features.keepHistory}
                    onChange={() => toggleFeature('keepHistory')}
                    className="rounded text-blue-500 focus:ring-0"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-time Generated Code Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono-code font-bold text-white">
                  {config.calculatorTitle.toLowerCase().replace(/\s+/g, '_')}.py
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Baixar arquivo Python gerado"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .py</span>
                </button>

                {config.paradigm !== 'tkinter' && (
                  <button
                    onClick={() => onLoadInEditor(generatedCode)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Testar no Editor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Generated Code Window */}
            <div className="p-4 bg-[#080C14] max-h-[580px] overflow-y-auto font-mono-code text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre">{generatedCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
