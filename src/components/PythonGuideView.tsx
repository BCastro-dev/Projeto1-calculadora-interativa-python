/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

export const PythonGuideView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-8 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Guia Didático: Como Criar uma Calculadora em Python
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Aprenda o passo a passo de como programar uma calculadora do zero em Python: desde as
          operações aritméticas básicas até o laço contínuo com tratamento de erros e boas práticas.
        </p>
      </div>

      {/* Step 1: Operadores Matemáticos */}
      <section className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono-code">
            1
          </span>
          <h2>Operadores Aritméticos no Python</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          O Python já possui todos os operadores matemáticos nativos integrados na sua sintaxe.
          Ao contrário de outras linguagens, o Python suporta potência nativa com duplo asterisco{' '}
          <code className="text-blue-400 font-mono-code">**</code> e divisão inteira com{' '}
          <code className="text-blue-400 font-mono-code">//</code>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Adição:</span>
            <span className="text-emerald-400 font-bold">a + b</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Subtração:</span>
            <span className="text-emerald-400 font-bold">a - b</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Multiplicação:</span>
            <span className="text-emerald-400 font-bold">a * b</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Divisão Real:</span>
            <span className="text-emerald-400 font-bold">a / b (ex: 7/2 = 3.5)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Divisão Inteira:</span>
            <span className="text-emerald-400 font-bold">a // b (ex: 7//2 = 3)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Resto / Módulo:</span>
            <span className="text-emerald-400 font-bold">a % b (ex: 7%2 = 1)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex justify-between sm:col-span-2">
            <span className="text-slate-400">Potenciação:</span>
            <span className="text-emerald-400 font-bold">a ** b (ex: 2 ** 8 = 256)</span>
          </div>
        </div>
      </section>

      {/* Step 2: Entrada com input e float */}
      <section className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono-code">
            2
          </span>
          <h2>A Pegadinha do input() e a Conversão de Tipos</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          No Python, a função <code className="text-blue-400 font-mono-code">input()</code> sempre
          lê o que o usuário digita no formato de <strong>texto (string)</strong>. Se você tentar
          somar sem converter, o Python fará concatenação de texto:
        </p>

        <div className="bg-[#080C14] border border-slate-800/90 rounded-lg p-3.5 font-mono-code text-xs text-slate-300">
          <pre>{`# ❌ ERRADO: Concatena como texto
num1 = input("Digite o 1º número: ")  # "10"
num2 = input("Digite o 2º número: ")  # "20"
print(num1 + num2)                     # Saída: "1020" (não 30!)

# ✅ CORRETO: Converte para float (número decimal)
num1 = float(input("Digite o 1º número: "))  # 10.0
num2 = float(input("Digite o 2º número: "))  # 20.0
print(num1 + num2)                           # Saída: 30.0`}</pre>
        </div>
      </section>

      {/* Step 3: Laço Contínuo e Tratamento de Erros */}
      <section className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono-code">
            3
          </span>
          <h2>Tratando Erros com try / except e Mantendo o Programa Rodando</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Um bom software nunca fecha com erro abrupto na cara do usuário. Dois erros comuns
          acontecem em calculadoras:
        </p>
        <ul className="text-sm space-y-1.5 list-disc list-inside text-slate-300">
          <li>
            <strong className="text-amber-400">ValueError:</strong> se o usuário digitar uma letra
            em vez de um número (ex: digitar "dez" em vez de "10").
          </li>
          <li>
            <strong className="text-rose-400">ZeroDivisionError:</strong> se o usuário tentar
            dividir por zero (matematicamente impossível).
          </li>
        </ul>

        <div className="bg-[#080C14] border border-slate-800/90 rounded-lg p-3.5 font-mono-code text-xs text-slate-300">
          <pre>{`while True:
    try:
        n1 = float(input("Primeiro número: "))
        n2 = float(input("Segundo número: "))
        operacao = input("Operação (+, -, *, / ou sair): ")
        
        if operacao.lower() == "sair":
            print("Encerrando calculadora.")
            break
            
        if operacao == "/":
            if n2 == 0:
                print("❌ Erro: Não é possível dividir por zero!")
                continue
            print(f"Resultado: {n1 / n2}")
            
    except ValueError:
        print("❌ Por favor, digite apenas números válidos!")`}</pre>
        </div>
      </section>

      {/* Step 4: O moderno match / case */}
      <section className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-mono-code">
            4
          </span>
          <h2>Sintaxe Moderna: match / case (Python 3.10+)</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Em vez de múltiplos <code className="text-blue-400 font-mono-code">if/elif/else</code>, o
          Python 3.10 introduziu o <em>Structural Pattern Matching</em>, tornando menus de
          calculadoras muito mais limpos e elegantes:
        </p>

        <div className="bg-[#080C14] border border-slate-800/90 rounded-lg p-3.5 font-mono-code text-xs text-slate-300">
          <pre>{`match operacao:
    case "+":
        resultado = n1 + n2
    case "-":
        resultado = n1 - n2
    case "*":
        resultado = n1 * n2
    case "/":
        resultado = n1 / n2 if n2 != 0 else "Erro: Divisão por zero"
    case "**":
        resultado = n1 ** n2
    case _:
        resultado = "Operação desconhecida!"`}</pre>
        </div>
      </section>

      {/* Step 5: Dica de ouro do eval() */}
      <section className="space-y-3 bg-amber-950/20 border border-amber-800/40 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <h2>Atenção de Segurança: Por que ter cuidado com o eval()?</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Muitos tutoriais na internet sugerem fazer uma calculadora usando apenas{' '}
          <code className="text-amber-300 font-mono-code">resultado = eval(input())</code>. Embora
          seja curto, o comando <code className="text-amber-300 font-mono-code">eval()</code>{' '}
          executa <em>qualquer</em> código Python arbitrário, incluindo comandos perigosos que podem
          apagar arquivos do sistema do usuário (como{' '}
          <code className="text-rose-400 font-mono-code">__import__('os').system(...)</code>).
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          ✅ <strong>Como fazer do jeito seguro:</strong> Valide os caracteres com uma lista de
          permitidos antes, ou use os operadores matemáticos explícitos como demonstrado nos nossos
          modelos!
        </p>
      </section>
    </div>
  );
};
