/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Download, Play, Code2 } from 'lucide-react';
import { AppTab } from '../types/calculator';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onDownloadAll: () => void;
  onQuickRun?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onDownloadAll,
  onQuickRun,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 via-blue-500/20 to-indigo-500/20 border border-slate-700 flex items-center justify-center text-blue-400 shadow-sm">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <button
            onClick={() => onTabChange('visual')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-base lg:text-lg font-bold tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors whitespace-nowrap">
                PyCalc Studio
              </span>
              <span className="text-[11px] font-mono-code px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 hidden sm:inline-block">
                Python 3.12
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onTabChange('visual')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'visual'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Calculadora Interativa
          </button>
          <button
            onClick={() => onTabChange('editor')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Editor & REPL
          </button>
          <button
            onClick={() => onTabChange('templates')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'templates'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Scripts Prontos (.py)
          </button>
          <button
            onClick={() => onTabChange('generator')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'generator'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Gerador Customizado
          </button>
          <button
            onClick={() => onTabChange('guide')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Tutorial Passo a Passo
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab === 'editor' && onQuickRun ? (
            <button
              onClick={onQuickRun}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs lg:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Executar código (Ctrl + Enter)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Executar Código</span>
            </button>
          ) : (
            <button
              onClick={onDownloadAll}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs lg:text-sm font-medium text-slate-100 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Todos (.py)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden overflow-x-auto gap-1 pt-2.5 pb-1 border-t border-slate-800/50 mt-2 text-xs">
        <button
          onClick={() => onTabChange('visual')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'visual' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Calculadora
        </button>
        <button
          onClick={() => onTabChange('editor')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'editor' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Editor & REPL
        </button>
        <button
          onClick={() => onTabChange('templates')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'templates' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Scripts (.py)
        </button>
        <button
          onClick={() => onTabChange('generator')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'generator' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Gerador
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'guide' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Tutorial
        </button>
      </div>
    </header>
  );
};
