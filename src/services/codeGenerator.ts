/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratorConfig } from '../types/calculator';

export function generateCustomPythonCalculator(config: GeneratorConfig): string {
  const { paradigm, operations, features, authorName, calculatorTitle } = config;

  let code = `"""
${calculatorTitle.toUpperCase()}
Gerado por: ${authorName || 'Desenvolvedor Python'}
Paradigma: ${paradigm.toUpperCase()}
"""\n\n`;

  // Imports
  const imports: string[] = [];
  if (operations.trig || operations.log || operations.factorial || operations.sqrt) {
    imports.push('import math');
  }
  if (operations.stats) {
    imports.push('import statistics');
  }
  if (features.typeHints) {
    imports.push('from typing import List, Optional, Union');
  }
  if (paradigm === 'tkinter') {
    imports.push('import tkinter as tk');
    imports.push('from tkinter import messagebox');
  }

  if (imports.length > 0) {
    code += imports.join('\n') + '\n\n';
  }

  // Terminal Colors if requested
  if (features.colorOutput && paradigm !== 'tkinter') {
    code += `# Cores ANSI para o terminal\n`;
    code += `VERDE = "\\033[92m"\n`;
    code += `VERMELHO = "\\033[91m"\n`;
    code += `AZUL = "\\033[94m"\n`;
    code += `AMARELO = "\\033[93m"\n`;
    code += `RESET = "\\033[0m"\n\n`;
  }

  // 1. Tkinter Paradigm
  if (paradigm === 'tkinter') {
    code += `class ${calculatorTitle.replace(/\s+/g, '')}App:\n`;
    code += `    def __init__(self, root: tk.Tk):\n`;
    code += `        self.root = root\n`;
    code += `        self.root.title("${calculatorTitle}")\n`;
    code += `        self.root.geometry("320x460")\n`;
    code += `        self.root.configure(bg="#0F172A")\n`;
    code += `        self.expressao = ""\n`;
    code += `        self.display_var = tk.StringVar(value="0")\n\n`;
    code += `        self._criar_interface()\n\n`;
    code += `    def _criar_interface(self):\n`;
    code += `        # Display\n`;
    code += `        frame_disp = tk.Frame(self.root, bg="#1E293B", padx=12, pady=16)\n`;
    code += `        frame_disp.pack(fill=tk.BOTH, padx=12, pady=(12, 6))\n`;
    code += `        lbl = tk.Label(frame_disp, textvariable=self.display_var, font=("Consolas", 24, "bold"), fg="#FFFFFF", bg="#1E293B", anchor="e")\n`;
    code += `        lbl.pack(fill=tk.BOTH)\n\n`;
    code += `        # Botoes\n`;
    code += `        grade = tk.Frame(self.root, bg="#0F172A", padx=8, pady=8)\n`;
    code += `        grade.pack(fill=tk.BOTH, expand=True)\n\n`;
    code += `        botoes = [\n`;
    code += `            ("C", 1, 0, "#EF4444"), ("(", 1, 1, "#475569"), (")", 1, 2, "#475569"), ("/", 1, 3, "#3B82F6"),\n`;
    code += `            ("7", 2, 0, "#334155"), ("8", 2, 1, "#334155"), ("9", 2, 2, "#334155"), ("*", 2, 3, "#3B82F6"),\n`;
    code += `            ("4", 3, 0, "#334155"), ("5", 3, 1, "#334155"), ("6", 3, 2, "#334155"), ("-", 3, 3, "#3B82F6"),\n`;
    code += `            ("1", 4, 0, "#334155"), ("2", 4, 1, "#334155"), ("3", 4, 2, "#334155"), ("+", 4, 3, "#3B82F6"),\n`;
    code += `            ("0", 5, 0, "#334155"), (".", 5, 1, "#334155"), ("⌫", 5, 2, "#64748B"), ("=", 5, 3, "#10B981")\n`;
    code += `        ]\n`;
    code += `        for txt, l, c, cor in botoes:\n`;
    code += `            b = tk.Button(grade, text=txt, font=("Segoe UI", 12, "bold"), bg=cor, fg="#FFF", bd=0, command=lambda t=txt: self._clicar(t))\n`;
    code += `            b.grid(row=l, column=c, padx=3, pady=3, sticky="nsew")\n`;
    code += `        for r in range(1, 6): grade.rowconfigure(r, weight=1)\n`;
    code += `        for c in range(4): grade.columnconfigure(c, weight=1)\n\n`;
    code += `    def _clicar(self, val: str):\n`;
    code += `        if val == "C":\n`;
    code += `            self.expressao = ""\n`;
    code += `            self.display_var.set("0")\n`;
    code += `        elif val == "⌫":\n`;
    code += `            self.expressao = self.expressao[:-1]\n`;
    code += `            self.display_var.set(self.expressao or "0")\n`;
    code += `        elif val == "=":\n`;
    code += `            try:\n`;
    code += `                res = eval(self.expressao, {"__builtins__": {}}, {})\n`;
    code += `                self.display_var.set(str(res))\n`;
    code += `                self.expressao = str(res)\n`;
    code += `            except Exception:\n`;
    code += `                messagebox.showerror("Erro", "Expressão inválida")\n`;
    code += `                self.expressao = ""\n`;
    code += `                self.display_var.set("Erro")\n`;
    code += `        else:\n`;
    code += `            self.expressao += val\n`;
    code += `            self.display_var.set(self.expressao)\n\n`;
    code += `if __name__ == "__main__":\n`;
    code += `    root = tk.Tk()\n`;
    code += `    app = ${calculatorTitle.replace(/\s+/g, '')}App(root)\n`;
    code += `    root.mainloop()\n`;
    return code;
  }

  // 2. OOP Paradigm
  if (paradigm === 'oop') {
    code += `class Calculadora:\n`;
    if (features.docstrings) {
      code += `    """Classe que encapsula a lógica e histórico da calculadora."""\n`;
    }
    code += `    def __init__(self${features.typeHints ? ': float = 0.0' : ''}):\n`;
    code += `        self.valor_atual${features.typeHints ? ': float' : ''} = 0.0\n`;
    if (features.keepHistory) {
      code += `        self.historico${features.typeHints ? ': List[str]' : ''} = []\n`;
    }
    code += `\n`;

    if (operations.basic) {
      code += `    def somar(self, n${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Adiciona n ao valor acumulado."""\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} + {n} = {self.valor_atual + n}")\n`;
      code += `        self.valor_atual += n\n`;
      code += `        return self.valor_atual\n\n`;

      code += `    def subtrair(self, n${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Subtrai n do valor acumulado."""\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} - {n} = {self.valor_atual - n}")\n`;
      code += `        self.valor_atual -= n\n`;
      code += `        return self.valor_atual\n\n`;

      code += `    def multiplicar(self, n${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Multiplica o valor acumulado por n."""\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} * {n} = {self.valor_atual * n}")\n`;
      code += `        self.valor_atual *= n\n`;
      code += `        return self.valor_atual\n\n`;

      code += `    def dividir(self, n${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Divide o valor acumulado por n."""\n`;
      if (features.errorHandling) {
        code += `        if n == 0:\n`;
        code += `            raise ZeroDivisionError("Erro: Não é possível dividir por zero!")\n`;
      }
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} / {n} = {self.valor_atual / n}")\n`;
      code += `        self.valor_atual /= n\n`;
      code += `        return self.valor_atual\n\n`;
    }

    if (operations.power) {
      code += `    def potencia(self, expoente${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Eleva o valor acumulado à potência expoente."""\n`;
      code += `        self.valor_atual = self.valor_atual ** expoente\n`;
      code += `        return self.valor_atual\n\n`;
    }

    if (operations.sqrt) {
      code += `    def raiz_quadrada(self)${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Calcula a raiz quadrada do valor acumulado."""\n`;
      if (features.errorHandling) {
        code += `        if self.valor_atual < 0:\n`;
        code += `            raise ValueError("Erro: Raiz de número negativo não existe nos reais!")\n`;
      }
      code += `        self.valor_atual = math.sqrt(self.valor_atual)\n`;
      code += `        return self.valor_atual\n\n`;
    }

    if (operations.percentage) {
      code += `    def porcentagem(self, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Calcula o valor correspondente a percentual% sobre o valor acumulado."""\n`;
      code += `        resultado = self.valor_atual * (percentual / 100)\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{percentual}% de {self.valor_atual} = {resultado}")\n`;
      code += `        return resultado\n\n`;

      code += `    def aplicar_acrescimo(self, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Aplica acréscimo percentual ao valor acumulado."""\n`;
      code += `        acrescimo = self.valor_atual * (percentual / 100)\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} + {percentual}% = {self.valor_atual + acrescimo}")\n`;
      code += `        self.valor_atual += acrescimo\n`;
      code += `        return self.valor_atual\n\n`;

      code += `    def aplicar_desconto(self, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `        """Aplica desconto percentual ao valor acumulado."""\n`;
      code += `        desconto = self.valor_atual * (percentual / 100)\n`;
      if (features.keepHistory) code += `        self.historico.append(f"{self.valor_atual} - {percentual}% = {self.valor_atual - desconto}")\n`;
      code += `        self.valor_atual -= desconto\n`;
      code += `        return self.valor_atual\n\n`;
    }

    if (features.keepHistory) {
      code += `    def ver_historico(self)${features.typeHints ? ' -> None' : ''}:\n`;
      code += `        print("\\n=== Histórico de Cálculos ===")\n`;
      code += `        for item in self.historico:\n`;
      code += `            print(f" • {item}")\n\n`;
    }

    code += `if __name__ == "__main__":\n`;
    code += `    calc = Calculadora()\n`;
    code += `    print("Valor inicial:", calc.valor_atual)\n`;
    code += `    calc.somar(50)\n`;
    code += `    calc.multiplicar(2)\n`;
    code += `    print("Resultado intermediário:", calc.valor_atual)\n`;
    if (features.keepHistory) {
      code += `    calc.ver_historico()\n`;
    }
    return code;
  }

  // 3. Functional / Modular Paradigm
  if (paradigm === 'functions') {
    code += `# Funções matemáticas modulares\n\n`;

    if (operations.basic) {
      code += `def somar(a${features.typeHints ? ': float' : ''}, b${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna a soma de dois números a + b."""\n`;
      code += `    return a + b\n\n`;

      code += `def subtrair(a${features.typeHints ? ': float' : ''}, b${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna a subtração a - b."""\n`;
      code += `    return a - b\n\n`;

      code += `def multiplicar(a${features.typeHints ? ': float' : ''}, b${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna a multiplicação a * b."""\n`;
      code += `    return a * b\n\n`;

      code += `def dividir(a${features.typeHints ? ': float' : ''}, b${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna a divisão a / b."""\n`;
      if (features.errorHandling) {
        code += `    if b == 0:\n`;
        code += `        raise ZeroDivisionError("Divisão por zero não é permitida.")\n`;
      }
      code += `    return a / b\n\n`;
    }

    if (operations.power) {
      code += `def potencia(base${features.typeHints ? ': float' : ''}, exp${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      code += `    return base ** exp\n\n`;
    }

    if (operations.sqrt) {
      code += `def raiz(n${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.errorHandling) {
        code += `    if n < 0: raise ValueError("Raiz de número negativo.")\n`;
      }
      code += `    return math.sqrt(n)\n\n`;
    }

    if (operations.percentage) {
      code += `def calcular_porcentagem(valor${features.typeHints ? ': float' : ''}, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna o valor percentual de uma quantia (ex: 15% de 200 = 30)."""\n`;
      code += `    return valor * (percentual / 100)\n\n`;

      code += `def aplicar_acrescimo(valor${features.typeHints ? ': float' : ''}, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna o valor original acrescido da porcentagem."""\n`;
      code += `    return valor * (1 + percentual / 100)\n\n`;

      code += `def aplicar_desconto(valor${features.typeHints ? ': float' : ''}, percentual${features.typeHints ? ': float' : ''})${features.typeHints ? ' -> float' : ''}:\n`;
      if (features.docstrings) code += `    """Retorna o valor original deduzido da porcentagem."""\n`;
      code += `    return valor * (1 - percentual / 100)\n\n`;
    }

    code += `if __name__ == "__main__":\n`;
    code += `    print("Demonstração das Funções:")\n`;
    code += `    print("10 + 5 =", somar(10, 5))\n`;
    code += `    print("20 - 8 =", subtrair(20, 8))\n`;
    code += `    print("6 * 7  =", multiplicar(6, 7))\n`;
    code += `    print("15 / 3 =", dividir(15, 3))\n`;
    if (operations.percentage) {
      code += `    print("15% de 200 =", calcular_porcentagem(200, 15))\n`;
    }
    return code;
  }

  // 4. Procedural / Interactive Terminal Menu
  code += `def menu():\n`;
  code += `    print("\\n" + "=" * 36)\n`;
  code += `    print("    ${calculatorTitle.toUpperCase()}")\n`;
  code += `    print("=" * 36)\n`;
  code += `    print("1. Adição (+)")\n`;
  code += `    print("2. Subtração (-)")\n`;
  code += `    print("3. Multiplicação (*)")\n`;
  code += `    print("4. Divisão (/)")\n`;
  let opIdx = 5;
  let powerIdx = -1;
  let sqrtIdx = -1;
  let moduloIdx = -1;
  let percentageIdx = -1;

  if (operations.power) {
    code += `    print("${opIdx}. Potenciação (**)")\n`;
    powerIdx = opIdx;
    opIdx++;
  }
  if (operations.sqrt) {
    code += `    print("${opIdx}. Raiz Quadrada (√)")\n`;
    sqrtIdx = opIdx;
    opIdx++;
  }
  if (operations.modulo) {
    code += `    print("${opIdx}. Resto da Divisão (%)")\n`;
    moduloIdx = opIdx;
    opIdx++;
  }
  if (operations.percentage) {
    code += `    print("${opIdx}. Porcentagem (%)")\n`;
    percentageIdx = opIdx;
    opIdx++;
  }
  code += `    print("0. Sair")\n`;
  code += `    print("=" * 36)\n\n`;

  code += `def main():\n`;
  if (features.keepHistory) {
    code += `    historico = []\n`;
  }
  code += `    while True:\n`;
  code += `        menu()\n`;
  code += `        opcao = input("Selecione uma opção: ").strip()\n`;
  code += `        if opcao == "0":\n`;
  code += `            print("Encerrando calculadora. Até breve!")\n`;
  code += `            break\n\n`;

  if (features.errorHandling) {
    code += `        try:\n`;
    code += `            n1 = float(input("Digite o 1º número: "))\n`;
    code += `            n2 = float(input("Digite o 2º número: "))\n`;
    code += `        except ValueError:\n`;
    code += `            print("Erro: Digite apenas números válidos!")\n`;
    code += `            continue\n\n`;
  } else {
    code += `        n1 = float(input("Digite o 1º número: "))\n`;
    code += `        n2 = float(input("Digite o 2º número: "))\n\n`;
  }

  code += `        if opcao == "1":\n`;
  code += `            res = n1 + n2\n`;
  code += `            print(f"Resultado: {n1} + {n2} = {res}")\n`;
  code += `        elif opcao == "2":\n`;
  code += `            res = n1 - n2\n`;
  code += `            print(f"Resultado: {n1} - {n2} = {res}")\n`;
  code += `        elif opcao == "3":\n`;
  code += `            res = n1 * n2\n`;
  code += `            print(f"Resultado: {n1} * {n2} = {res}")\n`;
  code += `        elif opcao == "4":\n`;
  code += `            if n2 == 0:\n`;
  code += `                print("Erro: Divisão por zero!")\n`;
  code += `            else:\n`;
  code += `                res = n1 / n2\n`;
  code += `                print(f"Resultado: {n1} / {n2} = {res}")\n`;

  if (operations.power && powerIdx !== -1) {
    code += `        elif opcao == "${powerIdx}":\n`;
    code += `            res = n1 ** n2\n`;
    code += `            print(f"Resultado: {n1} ** {n2} = {res}")\n`;
  }

  if (operations.sqrt && sqrtIdx !== -1) {
    code += `        elif opcao == "${sqrtIdx}":\n`;
    code += `            if n1 < 0:\n`;
    code += `                print("Erro: Raiz de número negativo!")\n`;
    code += `            else:\n`;
    code += `                res = math.sqrt(n1)\n`;
    code += `                print(f"Resultado: √{n1} = {res}")\n`;
  }

  if (operations.modulo && moduloIdx !== -1) {
    code += `        elif opcao == "${moduloIdx}":\n`;
    code += `            if n2 == 0:\n`;
    code += `                print("Erro: Divisão por zero no módulo!")\n`;
    code += `            else:\n`;
    code += `                res = n1 % n2\n`;
    code += `                print(f"Resultado: {n1} % {n2} = {res}")\n`;
  }

  if (operations.percentage && percentageIdx !== -1) {
    code += `        elif opcao == "${percentageIdx}":\n`;
    code += `            res = n1 * (n2 / 100)\n`;
    code += `            print(f"Resultado: {n2}% de {n1} = {res}")\n`;
  }

  code += `\nif __name__ == "__main__":\n`;
  code += `    main()\n`;

  return code;
}
