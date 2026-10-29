/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Code,
  ArrowRight,
  Clock,
  Sparkles,
  Bookmark,
  Trash2,
} from 'lucide-react';
import { AngleUnit, CalcMode, HistoryItem } from '../types/calculator';
import {
  evaluatePythonExpression,
  generatePythonEquivalent,
  getMemoryValue,
  setMemoryValue,
} from '../services/pythonRunner';

interface InteractiveCalculatorProps {
  onSendToEditor: (code: string) => void;
  history: HistoryItem[];
  onAddHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({
  onSendToEditor,
  history,
  onAddHistory,
  onClearHistory,
}) => {
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('0');
  const [calcMode, setCalcMode] = useState<CalcMode>('scientific');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [copiedCode, setCopiedCode] = useState(false);
  const [hasMemory, setHasMemory] = useState(getMemoryValue() !== 0);
  const [programmerBase, setProgrammerBase] = useState<'DEC' | 'HEX' | 'BIN' | 'OCT'>('DEC');

  // Evaluate as user types (live preview)
  useEffect(() => {
    if (!expression.trim()) {
      setDisplayResult('0');
      return;
    }
    const res = evaluatePythonExpression(expression, angleUnit);
    if (res.success && res.result !== 'Erro') {
      setDisplayResult(res.result);
    }
  }, [expression, angleUnit]);

  // Handle number or symbol click
  const handleInput = (val: string) => {
    setExpression((prev) => prev + val);
  };

  // Backspace
  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  // Clear All
  const handleClear = () => {
    setExpression('');
    setDisplayResult('0');
  };

  // Calculate Equals
  const handleEquals = () => {
    if (!expression.trim()) return;
    const res = evaluatePythonExpression(expression, angleUnit);

    const pythonCode = generatePythonEquivalent(expression, res.result, angleUnit);

    const newItem: HistoryItem = {
      id: String(Date.now()),
      expression: expression,
      pythonCode,
      result: res.result,
      numericResult: res.numericValue,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isError: !res.success,
    };

    onAddHistory(newItem);

    if (res.success) {
      setDisplayResult(res.result);
      setExpression(res.result);
    } else {
      setDisplayResult(res.error || 'Erro');
    }
  };

  // Memory functions
  const handleMemory = (type: 'MC' | 'MR' | 'M+' | 'M-') => {
    const currentVal = parseFloat(displayResult) || 0;
    if (type === 'MC') {
      setMemoryValue(0);
      setHasMemory(false);
    } else if (type === 'MR') {
      setExpression((prev) => prev + String(getMemoryValue()));
    } else if (type === 'M+') {
      setMemoryValue(getMemoryValue() + currentVal);
      setHasMemory(true);
    } else if (type === 'M-') {
      setMemoryValue(getMemoryValue() - currentVal);
      setHasMemory(true);
    }
  };

  // Copy Python snippet
  const handleCopyPython = () => {
    const py = generatePythonEquivalent(expression || '0', displayResult, angleUnit);
    navigator.clipboard.writeText(py);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Quick preset loader
  const handleLoadPreset = (expr: string) => {
    setExpression(expr);
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (['+', '-', '*', '/', '%', '(', ')', '.'].includes(e.key)) {
        handleInput(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, angleUnit, displayResult]);

  // Programmer conversions
  const numericVal = parseFloat(displayResult) || 0;
  const intVal = Math.floor(numericVal);
  const hexString = '0x' + (intVal >>> 0).toString(16).toUpperCase();
  const binString = '0b' + (intVal >>> 0).toString(2);
  const octString = '0o' + (intVal >>> 0).toString(8);

  const currentPythonSnippet = generatePythonEquivalent(
    expression || '0',
    displayResult,
    angleUnit
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Introduction text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Calculadora Interativa em Python
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cada clique gera e executa código Python em tempo real com sintaxe idêntica ao CPython.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setCalcMode('basic')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              calcMode === 'basic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Básica
          </button>
          <button
            onClick={() => setCalcMode('scientific')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              calcMode === 'scientific'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Científica
          </button>
          <button
            onClick={() => setCalcMode('programmer')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              calcMode === 'programmer'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Programador
          </button>
        </div>
      </div>

      {/* Main Grid: Calculator UI on Left, Python Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tactile Hardware Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl relative backdrop-blur-xs">
          {/* Display Header with Memory & Angle indicators */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
            <div className="flex items-center gap-2">
              {calcMode === 'scientific' && (
                <button
                  onClick={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono-code font-bold uppercase transition-colors cursor-pointer"
                  title="Alternar Graus e Radianos"
                >
                  {angleUnit}
                </button>
              )}
              {hasMemory && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code text-[11px] border border-amber-500/30">
                  M = {getMemoryValue()}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-mono-code">
              Teclado numérico ativo
            </div>
          </div>

          {/* Calculator Screen */}
          <div className="bg-[#090D16] border border-slate-800/90 rounded-lg p-4 mb-4 font-mono-code relative text-right overflow-hidden shadow-inner">
            {/* Expression line */}
            <div className="text-slate-400 text-sm sm:text-base min-h-[1.5rem] tracking-wide break-all select-all font-mono">
              {expression || <span className="text-slate-600 font-normal">0</span>}
            </div>

            {/* Result line */}
            <div className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1 truncate">
              = {displayResult}
            </div>
          </div>

          {/* Programmer Base Conversions Ribbon */}
          {calcMode === 'programmer' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code">
              <div
                onClick={() => setProgrammerBase('DEC')}
                className={`p-1.5 rounded cursor-pointer ${
                  programmerBase === 'DEC'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-slate-500 text-[10px] block">DEC</span>
                <span className="truncate block font-semibold">{intVal}</span>
              </div>
              <div
                onClick={() => setProgrammerBase('HEX')}
                className={`p-1.5 rounded cursor-pointer ${
                  programmerBase === 'HEX'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-slate-500 text-[10px] block">HEX</span>
                <span className="truncate block font-semibold">{hexString}</span>
              </div>
              <div
                onClick={() => setProgrammerBase('BIN')}
                className={`p-1.5 rounded cursor-pointer ${
                  programmerBase === 'BIN'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-slate-500 text-[10px] block">BIN</span>
                <span className="truncate block font-semibold">{binString}</span>
              </div>
              <div
                onClick={() => setProgrammerBase('OCT')}
                className={`p-1.5 rounded cursor-pointer ${
                  programmerBase === 'OCT'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-slate-500 text-[10px] block">OCT</span>
                <span className="truncate block font-semibold">{octString}</span>
              </div>
            </div>
          )}

          {/* Memory Bar */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button
              onClick={() => handleMemory('MC')}
              className="py-1.5 text-xs font-mono-code font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
            >
              MC
            </button>
            <button
              onClick={() => handleMemory('MR')}
              className="py-1.5 text-xs font-mono-code font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
            >
              MR
            </button>
            <button
              onClick={() => handleMemory('M+')}
              className="py-1.5 text-xs font-mono-code font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
            >
              M+
            </button>
            <button
              onClick={() => handleMemory('M-')}
              className="py-1.5 text-xs font-mono-code font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
            >
              M-
            </button>
          </div>

          {/* Keypad Grid */}
          <div className="space-y-2">
            {/* Scientific Rows */}
            {calcMode === 'scientific' && (
              <div className="grid grid-cols-5 gap-2 pb-2 border-b border-slate-800/80">
                <button
                  onClick={() => handleInput('math.sin(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                >
                  sin
                </button>
                <button
                  onClick={() => handleInput('math.cos(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                >
                  cos
                </button>
                <button
                  onClick={() => handleInput('math.tan(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                >
                  tan
                </button>
                <button
                  onClick={() => handleInput('math.pi')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-amber-300 rounded transition-colors cursor-pointer"
                >
                  π (pi)
                </button>
                <button
                  onClick={() => handleInput('math.e')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-amber-300 rounded transition-colors cursor-pointer"
                >
                  e
                </button>

                <button
                  onClick={() => handleInput('math.log(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                  title="Logaritmo natural ln(x)"
                >
                  ln
                </button>
                <button
                  onClick={() => handleInput('math.log10(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                >
                  log10
                </button>
                <button
                  onClick={() => handleInput('math.sqrt(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-blue-300 rounded transition-colors cursor-pointer"
                >
                  √ (sqrt)
                </button>
                <button
                  onClick={() => handleInput('**')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-indigo-300 rounded transition-colors cursor-pointer"
                  title="Potência no Python (ex: 2**8)"
                >
                  xʸ (**)
                </button>
                <button
                  onClick={() => handleInput('math.factorial(')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800/90 hover:bg-slate-700/80 text-indigo-300 rounded transition-colors cursor-pointer"
                >
                  n!
                </button>
              </div>
            )}

            {/* Programmer Rows */}
            {calcMode === 'programmer' && (
              <div className="grid grid-cols-5 gap-2 pb-2 border-b border-slate-800/80">
                <button
                  onClick={() => handleInput(' & ')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded transition-colors cursor-pointer"
                >
                  AND (&)
                </button>
                <button
                  onClick={() => handleInput(' | ')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded transition-colors cursor-pointer"
                >
                  OR (|)
                </button>
                <button
                  onClick={() => handleInput(' ^ ')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded transition-colors cursor-pointer"
                >
                  XOR (^)
                </button>
                <button
                  onClick={() => handleInput(' << ')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded transition-colors cursor-pointer"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => handleInput(' >> ')}
                  className="p-2 text-xs font-mono-code font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded transition-colors cursor-pointer"
                >
                  {'>>'}
                </button>
              </div>
            )}

            {/* Standard Keypad Rows */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {/* Row 1 */}
              <button
                onClick={handleClear}
                className="p-3 text-sm font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg transition-colors cursor-pointer"
              >
                C (Limpar)
              </button>
              <button
                onClick={() => handleInput('(')}
                className="p-3 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                (
              </button>
              <button
                onClick={() => handleInput(')')}
                className="p-3 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                )
              </button>
              <button
                onClick={() => handleInput('%')}
                className="p-3 text-sm font-semibold bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700/40 rounded-lg transition-colors cursor-pointer"
                title="Calcular Porcentagem (%)"
              >
                % (porc)
              </button>

              {/* Row 2 */}
              <button
                onClick={() => handleInput('7')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                7
              </button>
              <button
                onClick={() => handleInput('8')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                8
              </button>
              <button
                onClick={() => handleInput('9')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                9
              </button>
              <button
                onClick={() => handleInput(' / ')}
                className="p-3 text-sm font-semibold bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 rounded-lg transition-colors cursor-pointer"
              >
                / (div)
              </button>

              {/* Row 3 */}
              <button
                onClick={() => handleInput('4')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                4
              </button>
              <button
                onClick={() => handleInput('5')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                5
              </button>
              <button
                onClick={() => handleInput('6')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                6
              </button>
              <button
                onClick={() => handleInput(' * ')}
                className="p-3 text-sm font-semibold bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 rounded-lg transition-colors cursor-pointer"
              >
                * (mult)
              </button>

              {/* Row 4 */}
              <button
                onClick={() => handleInput('1')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                1
              </button>
              <button
                onClick={() => handleInput('2')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                2
              </button>
              <button
                onClick={() => handleInput('3')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                3
              </button>
              <button
                onClick={() => handleInput(' - ')}
                className="p-3 text-sm font-semibold bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 rounded-lg transition-colors cursor-pointer"
              >
                - (sub)
              </button>

              {/* Row 5 */}
              <button
                onClick={() => handleInput('0')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => handleInput('.')}
                className="p-3 text-base font-bold bg-slate-800/70 hover:bg-slate-700/90 text-white rounded-lg transition-colors cursor-pointer"
              >
                .
              </button>
              <button
                onClick={handleBackspace}
                className="p-3 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Apagar último caractere"
              >
                ⌫
              </button>
              <button
                onClick={() => handleInput(' + ')}
                className="p-3 text-sm font-semibold bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 rounded-lg transition-colors cursor-pointer"
              >
                + (adição)
              </button>

              {/* Row 6: Wide Equals */}
              <button
                onClick={handleEquals}
                className="col-span-4 p-3.5 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                title="Executar cálculo em Python (=)"
              >
                = (Calcular em Python)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Python Code Inspector & Quick Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Python Code Inspector Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Código Python Equivalente
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPython}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  {copiedCode ? (
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
                  onClick={() => onSendToEditor(currentPythonSnippet)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-300 hover:text-blue-200 bg-blue-900/40 hover:bg-blue-800/60 rounded border border-blue-700/50 transition-colors cursor-pointer"
                  title="Abrir no Editor REPL"
                >
                  <span>Abrir no Editor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="mt-3 bg-[#080C14] border border-slate-800/80 rounded-lg p-3.5 font-mono-code text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <pre className="text-slate-300 whitespace-pre">
                {currentPythonSnippet}
              </pre>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Você pode rodar exatamente esse script em qualquer terminal com{' '}
              <code className="text-blue-400">python script.py</code>.
            </p>
          </div>

          {/* Quick Python Formula Presets */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Expressões e Fórmulas em Python</span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleLoadPreset('math.sqrt(144) + 2**5')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Raiz + Potência</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  math.sqrt(144) + 2**5
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('math.hypot(3, 4)')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Teorema de Pitágoras</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  math.hypot(3, 4)
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('math.sin(math.radians(30))')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Seno de 30°</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  math.sin(math.radians(30))
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('1000 * (1 + 0.05)**12')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Juros Compostos 1 ano</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  1000 * (1 + 0.05)**12
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('250 * 15%')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Porcentagem (15% de 250)</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  250 * 15%
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('200 + 10%')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Acréscimo de 10% (200 + 10%)</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  200 + 10%
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('math.comb(10, 3)')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Combinação C(10, 3)</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  math.comb(10, 3)
                </span>
              </button>
              <button
                onClick={() => handleLoadPreset('math.factorial(7)')}
                className="text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-blue-300">Fatorial 7!</span>
                <span className="font-mono-code text-[11px] text-slate-400 truncate block">
                  math.factorial(7)
                </span>
              </button>
            </div>
          </div>

          {/* History Drawer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Histórico de Cálculos</span>
                {history.length > 0 && (
                  <span className="text-xs font-mono-code text-slate-500">
                    ({history.length})
                  </span>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1">
              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Nenhum cálculo recente. Execute uma operação para salvar no histórico.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadPreset(item.expression)}
                    className="p-2.5 rounded bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/60 text-xs font-mono-code cursor-pointer transition-colors group flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <div className="text-slate-400 truncate group-hover:text-blue-300">
                        {item.expression}
                      </div>
                      <div className="text-white font-bold text-sm mt-0.5">
                        = {item.result}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
