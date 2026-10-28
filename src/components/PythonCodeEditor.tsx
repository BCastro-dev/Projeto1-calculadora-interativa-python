/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  Sparkles,
  Info,
} from 'lucide-react';
import { ExecutionResult } from '../types/calculator';
import { executePythonScript } from '../services/pythonRunner';
import { PYTHON_TEMPLATES } from '../data/pythonTemplates';

interface PythonCodeEditorProps {
  initialCode?: string;
}

const DEFAULT_SCRIPT = `"""
Calculadora Interativa em Python
Experimente alterar os números ou adicionar novas operações!
"""
import math

def calcular_operacoes(a, b):
    print("=" * 35)
    print(f"Cálculos para a = {a} e b = {b}")
    print("=" * 35)
    
    soma = a + b
    subtracao = a - b
    multiplicacao = a * b
    divisao = a / b if b != 0 else "Indefinida (Divisão por zero)"
    potencia = a ** b
    raiz_a = math.sqrt(a) if a >= 0 else "Imaginária"
    
    print(f"Adição:        {a} + {b} = {soma}")
    print(f"Subtração:     {a} - {b} = {subtracao}")
    print(f"Multiplicação: {a} * {b} = {multiplicacao}")
    print(f"Divisão:       {a} / {b} = {divisao}")
    print(f"Potência:      {a} ** {b} = {potencia}")
    print(f"Raiz de a:     √{a} = {raiz_a}")
    print(f"Hipotenusa:    math.hypot({a}, {b}) = {math.hypot(a, b)}")

# Executando a função com valores de exemplo:
calcular_operacoes(16, 4)
`;

export const PythonCodeEditor: React.FC<PythonCodeEditorProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || DEFAULT_SCRIPT);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');

  // If initialCode changes from outside (e.g. from Interactive Calculator), update it
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setSelectedTemplateId('custom');
    }
  }, [initialCode]);

  // Handle run code
  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executePythonScript(code);
      setResult(res);
    } catch (err: any) {
      setResult({
        stdout: [],
        returnValue: null,
        error: `Error: ${err?.message || 'Falha ao executar o script'}`,
        executionTimeMs: 0,
        variables: {},
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut Ctrl + Enter or Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  // Load template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === 'custom') {
      setCode(DEFAULT_SCRIPT);
      return;
    }
    const found = PYTHON_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      setCode(found.code);
    }
  };

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .py
  const handleDownloadPy = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minha_calculadora.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Line numbers calculation
  const linesCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Editor & Interpretador Python
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edite ou escreva qualquer código de calculadora em Python e execute instantaneamente no navegador.
          </p>
        </div>

        {/* Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedTemplateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="custom" className="bg-slate-900 text-slate-200">
                Script Básico (Exemplo)
              </option>
              {PYTHON_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id} className="bg-slate-900 text-slate-200">
                  {tmpl.title}
                </option>
              ))}
            </select>
          </div>

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
            onClick={handleDownloadPy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Baixar arquivo .py para rodar no seu computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executando...' : 'Executar (Ctrl+Enter)'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono-code">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span>calculadora.py</span>
            </div>
            <div className="text-slate-500 font-mono-code text-[11px]">
              {linesCount} linhas · UTF-8
            </div>
          </div>

          {/* Editor Body with Line Numbers */}
          <div className="flex flex-1 min-h-[460px] bg-[#080C14] font-mono-code text-xs">
            {/* Line Numbers Column */}
            <div className="py-4 px-2 select-none text-right text-slate-600 border-r border-slate-800/80 bg-slate-950/40 w-12 shrink-0">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 py-4 px-3 bg-transparent text-slate-200 resize-none focus:outline-none leading-6 whitespace-pre font-mono-code selection:bg-blue-600/30"
              placeholder="# Digite seu código Python aqui..."
            />
          </div>
        </div>

        {/* Console / Output Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Terminal & Saída Python (stdout)</span>
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <span className="text-[11px] font-mono-code text-slate-400">
                  {result.executionTimeMs}ms
                </span>
              )}
              {result && (
                <button
                  onClick={() => setResult(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Terminal Display */}
          <div className="flex-1 min-h-[460px] bg-[#060910] p-4 font-mono-code text-xs text-slate-300 overflow-y-auto space-y-1">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16 px-4">
                <Terminal className="w-10 h-10 text-slate-700 mb-2 stroke-1" />
                <p className="font-sans text-sm text-slate-400">Nenhuma execução ainda</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                  Pressione o botão verde <strong>"Executar"</strong> ou o atalho{' '}
                  <code className="text-slate-400">Ctrl + Enter</code> para rodar o script.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Simulated Terminal Prompt line */}
                <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800/60 mb-2">
                  $ python3 calculadora.py
                </div>

                {/* Stdout lines */}
                {result.stdout.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-5 text-emerald-300/90">
                    {line}
                  </div>
                ))}

                {/* Return Value */}
                {result.returnValue && (
                  <div className="text-blue-400 pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-500">Valor de retorno: </span>
                    <span className="font-bold">{result.returnValue}</span>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div className="p-3 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 whitespace-pre-wrap text-xs mt-2">
                    {result.error}
                  </div>
                )}

                {result.stdout.length === 0 && !result.returnValue && !result.error && (
                  <div className="text-slate-500 italic">
                    O script executou com sucesso (sem mensagens de print).
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal Footer Info */}
          <div className="px-4 py-2.5 bg-slate-950/70 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Ambiente: Python 3.12 (Sandbox CPython)</span>
            <span>Módulo math ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
