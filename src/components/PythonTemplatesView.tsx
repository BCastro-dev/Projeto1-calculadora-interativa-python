/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Play,
  FileCode,
  BookOpen,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { PYTHON_TEMPLATES } from '../data/pythonTemplates';
import { PythonTemplate } from '../types/calculator';

interface PythonTemplatesViewProps {
  onLoadInEditor: (code: string) => void;
}

export const PythonTemplatesView: React.FC<PythonTemplatesViewProps> = ({ onLoadInEditor }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PythonTemplate>(PYTHON_TEMPLATES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (template: PythonTemplate) => {
    navigator.clipboard.writeText(template.code);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (template: PythonTemplate) => {
    const blob = new Blob([template.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Intro */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Modelos Prontos de Calculadoras em Python
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Códigos completos, testados e comentados em português. Copie, teste no interpretador ou
          baixe o arquivo <code className="text-blue-400">.py</code> para executar no seu VS Code,
          PyCharm ou Terminal.
        </p>
      </div>

      {/* Main Grid: Template List on Left, Full Code & Pedagogical Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Templates Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Selecione uma Arquitetura
          </div>

          <div className="space-y-2">
            {PYTHON_TEMPLATES.map((t) => {
              const isSelected = selectedTemplate.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500/60 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono-code text-slate-400">{t.filename}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.difficulty === 'Iniciante'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : t.difficulty === 'Intermediário'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                      }`}
                    >
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">{t.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {t.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Template Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedTemplate.title}</h2>
                  <span className="text-xs font-mono-code text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedTemplate.filename}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(selectedTemplate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === selectedTemplate.id ? (
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
                  onClick={() => handleDownload(selectedTemplate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Baixar arquivo Python (.py)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .py</span>
                </button>

                {selectedTemplate.runnableInEditor && (
                  <button
                    onClick={() => onLoadInEditor(selectedTemplate.code)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Testar no Editor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Concepts Learned Section */}
            <div className="pt-3">
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Conceitos de Python Utilizados neste Código:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedTemplate.concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="font-semibold text-blue-300 font-mono-code">
                      {concept.name}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-normal">
                      {concept.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 font-mono-code">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>{selectedTemplate.filename}</span>
              </div>
              <span>Como executar: python {selectedTemplate.filename}</span>
            </div>

            <div className="p-4 bg-[#080C14] max-h-[540px] overflow-y-auto font-mono-code text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre">{selectedTemplate.code}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
