/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { PythonCodeEditor } from './components/PythonCodeEditor';
import { PythonTemplatesView } from './components/PythonTemplatesView';
import { CustomCalculatorGenerator } from './components/CustomCalculatorGenerator';
import { PythonGuideView } from './components/PythonGuideView';
import { AppTab, HistoryItem } from './types/calculator';
import { PYTHON_TEMPLATES } from './data/pythonTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('visual');
  const [editorCode, setEditorCode] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      expression: 'math.sqrt(144) + 2**5',
      pythonCode: 'import math\n\nresultado = math.sqrt(144) + 2**5\nprint(resultado)  # => 44',
      result: '44',
      numericResult: 44,
      timestamp: '15:30',
    },
    {
      id: 'init-2',
      expression: '15 * 8 / (4 - 2)',
      pythonCode: 'resultado = 15 * 8 / (4 - 2)\nprint(resultado)  # => 60.0',
      result: '60',
      numericResult: 60,
      timestamp: '15:28',
    },
  ]);

  const handleSendToEditor = (code: string) => {
    setEditorCode(code);
    setActiveTab('editor');
  };

  const handleAddHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.slice(0, 24)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Download all 6 python templates as ready-to-run files
  const handleDownloadAll = () => {
    PYTHON_TEMPLATES.forEach((template, index) => {
      setTimeout(() => {
        const blob = new Blob([template.code], { type: 'text/x-python;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = template.filename;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 250);
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadAll={handleDownloadAll}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'visual' && (
          <InteractiveCalculator
            onSendToEditor={handleSendToEditor}
            history={history}
            onAddHistory={handleAddHistory}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'editor' && <PythonCodeEditor initialCode={editorCode} />}

        {activeTab === 'templates' && (
          <PythonTemplatesView onLoadInEditor={handleSendToEditor} />
        )}

        {activeTab === 'generator' && (
          <CustomCalculatorGenerator onLoadInEditor={handleSendToEditor} />
        )}

        {activeTab === 'guide' && <PythonGuideView />}
      </main>

      {/* Quiet, Human-Designed Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080C14] py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PyCalc Studio</span>
            <span>·</span>
            <span>Calculadora em Python</span>
            <span>·</span>
            <span>CPython 3.12 Standard Library</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('visual')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Calculadora
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Modelos .py
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Gerador
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Tutorial
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
