/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PythonTemplate } from '../types/calculator';

export const PYTHON_TEMPLATES: PythonTemplate[] = [
  {
    id: 'terminal_basica',
    title: 'Calculadora de Terminal (CLI)',
    subtitle: 'Laço interativo com match/case e tratamento de exceções',
    badge: 'Iniciante ao Intermediário',
    filename: 'calculadora_terminal.py',
    description:
      'Uma calculadora interativa para linha de comando com menu textual, validação de entradas com try/except, laço infinito while True e a nova estrutura match/case do Python 3.10+.',
    difficulty: 'Iniciante',
    runnableInEditor: true,
    concepts: [
      {
        name: 'while True & break',
        description: 'Mantém a calculadora rodando até o usuário escolher explicitamente a opção de sair.',
      },
      {
        name: 'match / case (Python 3.10+)',
        description: 'Estrutura moderna de controle de fluxo para selecionar operações de forma legível.',
      },
      {
        name: 'try / except',
        description: 'Captura ValueError (letras em vez de números) e ZeroDivisionError de forma amigável.',
      },
    ],
    code: `"""
Calculadora de Linha de Comando (CLI) em Python
Compatível com Python 3.10+
"""

def exibir_menu():
    print("\\n" + "=" * 32)
    print("      CALCULADORA PYTHON")
    print("=" * 32)
    print("1. Adição (+)")
    print("2. Subtração (-)")
    print("3. Multiplicação (*)")
    print("4. Divisão (/)")
    print("5. Potenciação (**)")
    print("6. Resto da Divisão (%)")
    print("0. Sair")
    print("=" * 32)

def obter_numero(mensagem):
    while True:
        try:
            return float(input(mensagem))
        except ValueError:
            print("❌ Erro: Digite um número válido!")

def main():
    while True:
        exibir_menu()
        opcao = input("Escolha uma opção (0-6): ").strip()

        if opcao == "0":
            print("\\nObrigado por usar a Calculadora Python! Até logo.")
            break

        if opcao not in ("1", "2", "3", "4", "5", "6"):
            print("⚠️ Opção inválida! Escolha entre 0 e 6.")
            continue

        num1 = obter_numero("Digite o primeiro número: ")
        num2 = obter_numero("Digite o segundo número: ")

        resultado = None

        match opcao:
            case "1":
                resultado = num1 + num2
                simbolo = "+"
            case "2":
                resultado = num1 - num2
                simbolo = "-"
            case "3":
                resultado = num1 * num2
                simbolo = "*"
            case "4":
                if num2 == 0:
                    print("❌ Erro: Não é possível dividir por zero!")
                    continue
                resultado = num1 / num2
                simbolo = "/"
            case "5":
                resultado = num1 ** num2
                simbolo = "**"
            case "6":
                if num2 == 0:
                    print("❌ Erro: Divisão por zero no cálculo de resto!")
                    continue
                resultado = num1 % num2
                simbolo = "%"

        print(f"\\n✅ Resultado: {num1} {simbolo} {num2} = {resultado}")

if __name__ == "__main__":
    main()
`,
  },
  {
    id: 'modular_funcoes',
    title: 'Calculadora Modular com Funções',
    subtitle: 'Arquitetura limpa com Type Hints e Docstrings PEP 257',
    badge: 'Boas Práticas & Testes',
    filename: 'calculadora_modular.py',
    description:
      'Código modular focado em funções puras, tipagem estática (Type Hints) e documentação formal. Ideal para quem quer aprender boas práticas de engenharia de software e testes unitários.',
    difficulty: 'Iniciante',
    runnableInEditor: true,
    concepts: [
      {
        name: 'Type Hints (PEP 484)',
        description: 'Especifica tipos de parâmetros e retorno (ex: a: float, b: float) -> float.',
      },
      {
        name: 'Docstrings (PEP 257)',
        description: 'Documenta o propósito, argumentos e exceções lançadas por cada função.',
      },
      {
        name: 'Lançamento de Exceções',
        description: 'Uso de raise ZeroDivisionError para sinalizar problemas matemáticos.',
      },
    ],
    code: `"""
Módulo de Operações Matemáticas (Calculadora Modular)
Demonstra uso de Type Hints, Docstrings e Funções Puras.
"""

def somar(a: float, b: float) -> float:
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Retorna o produto de dois números."""
    return a * b

def dividir(a: float, b: float) -> float:
    """
    Retorna o quociente da divisão de a por b.
    
    Raises:
        ZeroDivisionError: Se b for igual a zero.
    """
    if b == 0:
        raise ZeroDivisionError("Divisão por zero não é permitida.")
    return a / b

def potencia(base: float, expoente: float) -> float:
    """Eleva a base ao expoente fornecido."""
    return base ** expoente

def raiz_quadrada(n: float) -> float:
    """
    Calcula a raiz quadrada de n usando exponenciação fracionária.
    
    Raises:
        ValueError: Se n for um número negativo.
    """
    if n < 0:
        raise ValueError("Não existe raiz quadrada real de número negativo.")
    return n ** 0.5

# Demonstração e testes automáticos:
if __name__ == "__main__":
    print("--- Testes da Calculadora Modular ---")
    x, y = 15.0, 3.0
    print(f"Soma: {x} + {y} = {somar(x, y)}")
    print(f"Subtração: {x} - {y} = {subtrair(x, y)}")
    print(f"Multiplicação: {x} * {y} = {multiplicar(x, y)}")
    print(f"Divisão: {x} / {y} = {dividir(x, y)}")
    print(f"Potência: {x} ** {y} = {potencia(x, y)}")
    print(f"Raiz Quadrada de 144: {raiz_quadrada(144)}")
`,
  },
  {
    id: 'poo_classe',
    title: 'Calculadora Orientada a Objetos (POO)',
    subtitle: 'Classe Calculadora com Memória, Histórico e Desfazer',
    badge: 'Orientação a Objetos',
    filename: 'calculadora_poo.py',
    description:
      'Implementação orientada a objetos com encapsulamento de estado, memória de valor atual, registro de histórico em lista, métodos encadeados e suporte a desfazer a última operação.',
    difficulty: 'Intermediário',
    runnableInEditor: true,
    concepts: [
      {
        name: 'Classes & Atributos',
        description: 'Armazena o valor acumulado atual e o histórico de cálculos realizados.',
      },
      {
        name: 'Métodos Encadeados (Fluent API)',
        description: 'Permite encadear operações: calc.somar(10).multiplicar(2).obter_resultado().',
      },
      {
        name: 'Pilha de Histórico & Desfazer',
        description: 'Armazena estados anteriores para permitir a funcionalidade de Undo.',
      },
    ],
    code: `"""
Calculadora Orientada a Objetos (POO) em Python
Suporta memória, histórico de operações e desfazer (Undo).
"""

from typing import List, Tuple

class Calculadora:
    def __init__(self, valor_inicial: float = 0.0):
        self._valor_atual: float = valor_inicial
        self._historico: List[Tuple[str, float]] = []
        self._memoria: float = 0.0

    @property
    def valor(self) -> float:
        """Propriedade para leitura do valor atual."""
        return self._valor_atual

    def somar(self, numero: float) -> "Calculadora":
        self._historico.append((f"+ {numero}", self._valor_atual))
        self._valor_atual += numero
        return self

    def subtrair(self, numero: float) -> "Calculadora":
        self._historico.append((f"- {numero}", self._valor_atual))
        self._valor_atual -= numero
        return self

    def multiplicar(self, numero: float) -> "Calculadora":
        self._historico.append((f"* {numero}", self._valor_atual))
        self._valor_atual *= numero
        return self

    def dividir(self, numero: float) -> "Calculadora":
        if numero == 0:
            raise ZeroDivisionError("Impossível dividir por zero.")
        self._historico.append((f"/ {numero}", self._valor_atual))
        self._valor_atual /= numero
        return self

    def zerar(self) -> "Calculadora":
        """Reseta o valor atual para 0."""
        self._historico.append(("Zerar", self._valor_atual))
        self._valor_atual = 0.0
        return self

    def desfazer(self) -> bool:
        """Restaura o estado anterior ao último cálculo."""
        if not self._historico:
            return False
        _, estado_anterior = self._historico.pop()
        self._valor_atual = estado_anterior
        return True

    def salvar_em_memoria(self) -> None:
        self._memoria = self._valor_atual

    def recuperar_memoria(self) -> "Calculadora":
        self.somar(self._memoria)
        return self

    def exibir_historico(self) -> None:
        print("\\n--- Histórico de Operações ---")
        for i, (op, val) in enumerate(self._historico, 1):
            print(f" {i}. Antes: {val:<8} Operação: {op}")
        print(f" -> Valor Final: {self._valor_atual}")

    def __str__(self) -> str:
        return f"Calculadora(atual={self._valor_atual})"


# Exemplo de Execução
if __name__ == "__main__":
    calc = Calculadora(10)
    print("Valor inicial:", calc.valor)

    # Chamada fluente encadeada: (10 + 5) * 4 / 2 = 30
    calc.somar(5).multiplicar(4).dividir(2)
    print("Após cálculos:", calc.valor)

    calc.exibir_historico()

    # Desfazer a última operação (a divisão por 2)
    calc.desfazer()
    print("Após desfazer última ação:", calc.valor)
`,
  },
  {
    id: 'cientifica_math',
    title: 'Calculadora Científica com Biblioteca Math',
    subtitle: 'Trigonometria, Logaritmos, Fatorial e Constantes Matemáticas',
    badge: 'Científica Avançada',
    filename: 'calculadora_cientifica.py',
    description:
      'Calculadora completa aproveitando a biblioteca padrão math do Python. Suporta funções trigonométricas em radianos e graus, logaritmo natural e decimal, fatoriais, potências e constantes.',
    difficulty: 'Intermediário',
    runnableInEditor: true,
    concepts: [
      {
        name: 'Módulo math do Python',
        description: 'Acesso a rotinas C de altíssima precisão e velocidade.',
      },
      {
        name: 'Graus vs Radianos',
        description: 'Conversão com math.radians() e math.degrees() para trigonometria.',
      },
      {
        name: 'Constantes Numéricas',
        description: 'math.pi, math.e e math.tau disponíveis diretamente no Python.',
      },
    ],
    code: `"""
Calculadora Científica em Python
Utiliza o módulo padrão 'math'
"""

import math

class CalculadoraCientifica:
    @staticmethod
    def seno(angulo_graus: float) -> float:
        rad = math.radians(angulo_graus)
        return math.sin(rad)

    @staticmethod
    def cosseno(angulo_graus: float) -> float:
        rad = math.radians(angulo_graus)
        return math.cos(rad)

    @staticmethod
    def tangente(angulo_graus: float) -> float:
        rad = math.radians(angulo_graus)
        return math.tan(rad)

    @staticmethod
    def logaritmo_natural(x: float) -> float:
        if x <= 0:
            raise ValueError("Logaritmo exige número estritamente positivo.")
        return math.log(x)

    @staticmethod
    def logaritmo_base10(x: float) -> float:
        if x <= 0:
            raise ValueError("Logaritmo exige número estritamente positivo.")
        return math.log10(x)

    @staticmethod
    def fatorial(n: int) -> int:
        return math.factorial(n)

    @staticmethod
    def hipotenusa(cateto_a: float, cateto_b: float) -> float:
        return math.hypot(cateto_a, cateto_b)

    @staticmethod
    def raiz_n_esima(x: float, n: float) -> float:
        if x < 0 and n % 2 == 0:
            raise ValueError("Índice par de radicando negativo não é real.")
        return x ** (1.0 / n)


# Demonstração de cálculos científicos:
if __name__ == "__main__":
    calc = CalculadoraCientifica()
    print("=" * 40)
    print("   DEMONSTRAÇÃO CALCULADORA CIENTÍFICA")
    print("=" * 40)
    print(f"PI (π):               {math.pi:.8f}")
    print(f"Número de Euler (e):  {math.e:.8f}")
    print(f"sen(30°):             {calc.seno(30):.4f}")
    print(f"cos(60°):             {calc.cosseno(60):.4f}")
    print(f"tan(45°):             {calc.tangente(45):.4f}")
    print(f"ln(e):                {calc.logaritmo_natural(math.e):.4f}")
    print(f"log10(1000):          {calc.logaritmo_base10(1000):.4f}")
    print(f"Fatorial de 5 (5!):   {calc.fatorial(5)}")
    print(f"Hipotenusa (3, 4):    {calc.hipotenusa(3, 4)}")
    print(f"Raiz cúbica de 27:    {calc.raiz_n_esima(27, 3)}")
`,
  },
  {
    id: 'tkinter_desktop',
    title: 'Calculadora Gráfica Desktop (Tkinter)',
    subtitle: 'Interface gráfica nativa do Python, sem necessidade de pip install',
    badge: 'Desktop GUI',
    filename: 'calculadora_gui_tkinter.py',
    description:
      'Uma aplicação desktop completa com janela gráfica em Tkinter (biblioteca nativa que vem com o Python). Possui display digital, teclado com grade responsiva, suporte ao teclado físico e tema escuro.',
    difficulty: 'Avançado',
    runnableInEditor: false,
    concepts: [
      {
        name: 'Tkinter (GUI nativa)',
        description: 'Cria janelas, botões, labels e entradas visuais sem bibliotecas externas.',
      },
      {
        name: 'Gerenciador de Layout Grid',
        description: 'Organiza botões em linhas e colunas organizadas como uma calculadora real.',
      },
      {
        name: 'Event Binding',
        description: 'Captura pressionamento de teclas físicas (0-9, Enter, Backspace).',
      },
    ],
    code: `"""
Calculadora Gráfica Moderna em Python com Tkinter
Não requer nenhuma biblioteca externa (Tkinter já vem com o Python).
Para executar no seu computador:
python calculadora_gui_tkinter.py
"""

import tkinter as tk
from tkinter import ttk, messagebox
import math

class CalculadoraTkinter:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("340x500")
        self.root.resizable(False, False)
        self.root.configure(bg="#1E293B")

        self.expressao = ""

        # Display de Texto
        self.display_var = tk.StringVar(value="0")
        self.criar_display()
        self.criar_botoes()
        self.configurar_teclado()

    def criar_display(self):
        frame_display = tk.Frame(self.root, bg="#0F172A", padx=16, pady=20)
        frame_display.pack(fill=tk.BOTH, padx=14, pady=(16, 8))

        lbl_display = tk.Label(
            frame_display,
            textvariable=self.display_var,
            font=("Consolas", 28, "bold"),
            bg="#0F172A",
            fg="#F8FAFC",
            anchor="e"
        )
        lbl_display.pack(fill=tk.BOTH)

    def criar_botoes(self):
        botoes = [
            ("C", 1, 0, "#EF4444"), ("(", 1, 1, "#475569"), (")", 1, 2, "#475569"), ("/", 1, 3, "#3B82F6"),
            ("7", 2, 0, "#334155"), ("8", 2, 1, "#334155"), ("9", 2, 2, "#334155"), ("*", 2, 3, "#3B82F6"),
            ("4", 3, 0, "#334155"), ("5", 3, 1, "#334155"), ("6", 3, 2, "#334155"), ("-", 3, 3, "#3B82F6"),
            ("1", 4, 0, "#334155"), ("2", 4, 1, "#334155"), ("3", 4, 2, "#334155"), ("+", 4, 3, "#3B82F6"),
            ("0", 5, 0, "#334155"), (".", 5, 1, "#334155"), ("⌫", 5, 2, "#64748B"), ("=", 5, 3, "#10B981"),
        ]

        frame_grade = tk.Frame(self.root, bg="#1E293B", padx=10, pady=8)
        frame_grade.pack(fill=tk.BOTH, expand=True)

        for texto, linha, coluna, cor_fundo in botoes:
            btn = tk.Button(
                frame_grade,
                text=texto,
                font=("Segoe UI", 14, "bold"),
                bg=cor_fundo,
                fg="#FFFFFF",
                activebackground="#1E293B",
                activeforeground="#FFFFFF",
                bd=0,
                cursor="hand2",
                command=lambda t=texto: self.ao_clicar(t)
            )
            btn.grid(row=linha, column=coluna, padx=4, pady=4, sticky="nsew")

        for r in range(1, 6):
            frame_grade.rowconfigure(r, weight=1)
        for c in range(4):
            frame_grade.columnconfigure(c, weight=1)

    def ao_clicar(self, valor: str):
        if valor == "C":
            self.expressao = ""
            self.display_var.set("0")
        elif valor == "⌫":
            self.expressao = self.expressao[:-1]
            self.display_var.set(self.expressao if self.expressao else "0")
        elif valor == "=":
            self.calcular()
        else:
            self.expressao += valor
            self.display_var.set(self.expressao)

    def calcular(self):
        if not self.expressao:
            return
        try:
            # Validação segura dos caracteres antes de avaliar
            permitidos = "0123456789+-*/.()"
            if any(c not in permitidos for c in self.expressao):
                raise ValueError("Caracteres inválidos")
            
            # Avalia a expressão com escopo limpo
            resultado = eval(self.expressao, {"__builtins__": {}}, {})
            
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
                
            self.display_var.set(str(resultado))
            self.expressao = str(resultado)
        except ZeroDivisionError:
            messagebox.showerror("Erro", "Divisão por zero!")
            self.expressao = ""
            self.display_var.set("Erro")
        except Exception:
            messagebox.showerror("Erro", "Expressão inválida!")
            self.expressao = ""
            self.display_var.set("Erro")

    def configurar_teclado(self):
        self.root.bind("<Return>", lambda e: self.calcular())
        self.root.bind("<BackSpace>", lambda e: self.ao_clicar("⌫"))
        self.root.bind("<Escape>", lambda e: self.ao_clicar("C"))
        for digito in "0123456789+-*/.()":
            self.root.bind(digito, lambda e, d=digito: self.ao_clicar(d))

if __name__ == "__main__":
    root = tk.Tk()
    app = CalculadoraTkinter(root)
    root.mainloop()
`,
  },
  {
    id: 'financeira_juros',
    title: 'Calculadora Financeira em Python',
    subtitle: 'Juros Compostos, Parcelamento Tabela Price e Rendimento',
    badge: 'Prática de Mercado',
    filename: 'calculadora_financeira.py',
    description:
      'Calculadora aplicada ao mercado financeiro: calcula montante com aportes mensais em juros compostos, valor de parcelas de empréstimo/financiamento (coeficiente Price) e inflação acumulada.',
    difficulty: 'Intermediário',
    runnableInEditor: true,
    concepts: [
      {
        name: 'Fórmula de Juros Compostos',
        description: 'M = P * (1 + i)^n com amortizações e aportes recorrentes.',
      },
      {
        name: 'Sistema Francês (Tabela Price)',
        description: 'Cálculo de prestações fixas de financiamentos imobiliários e veiculares.',
      },
      {
        name: 'Formatação Monetária',
        description: 'Exibição elegante em formato brasileiro R$ 1.234,56.',
      },
    ],
    code: `"""
Calculadora Financeira em Python
Cálculo de Juros Compostos e Financiamentos (Tabela Price)
"""

def juros_compostos(capital_inicial: float, taxa_mensal_percentual: float, meses: int, aporte_mensal: float = 0.0) -> dict:
    """Calcula a evolução de juros compostos com aportes mensais."""
    taxa = taxa_mensal_percentual / 100.0
    saldo = capital_inicial
    total_investido = capital_inicial

    for _ in range(meses):
        saldo += saldo * taxa
        saldo += aporte_mensal
        total_investido += aporte_mensal

    juros_totais = saldo - total_investido

    return {
        "saldo_final": round(saldo, 2),
        "total_investido": round(total_investido, 2),
        "juros_acumulados": round(juros_totais, 2),
    }

def parcela_financiamento_price(valor_financiado: float, taxa_mensal_percentual: float, parcelas: int) -> float:
    """
    Calcula a parcela fixa de um financiamento pela Tabela Price.
    Fórmula: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
    """
    i = taxa_mensal_percentual / 100.0
    fator = (1 + i) ** parcelas
    parcela = valor_financiado * (i * fator) / (fator - 1)
    return round(parcela, 2)


# Demonstração Prática
if __name__ == "__main__":
    print("=" * 48)
    print("         CALCULADORA FINANCEIRA PYTHON")
    print("=" * 48)

    # Simulação 1: Investimento
    inicial = 5000.0
    aporte = 500.0
    taxa = 0.85  # 0.85% ao mês (aprox 10.7% ao ano)
    periodo = 60  # 5 anos (60 meses)

    resultado = juros_compostos(inicial, taxa, periodo, aporte)
    print(f"Investimento inicial: R$ {inicial:,.2f}")
    print(f"Aporte mensal:        R$ {aporte:,.2f}")
    print(f"Taxa mensal:          {taxa}% ao mês")
    print(f"Prazo:                {periodo} meses")
    print("-" * 48)
    print(f"Total Investido:      R$ {resultado['total_investido']:,.2f}")
    print(f"Juros Acumulados:     R$ {resultado['juros_acumulados']:,.2f}")
    print(f"Patrimônio Final:     R$ {resultado['saldo_final']:,.2f}")

    print("\\n" + "=" * 48)
    # Simulação 2: Financiamento de Carro ou Imóvel
    valor_bem = 45000.0
    taxa_fin = 1.39  # 1.39% ao mês
    meses_fin = 48   # 4 anos

    prestacao = parcela_financiamento_price(valor_bem, taxa_fin, meses_fin)
    custo_total = prestacao * meses_fin
    juros_pagos = custo_total - valor_bem

    print("Simulação Financiamento (Tabela Price):")
    print(f"Valor financiado:     R$ {valor_bem:,.2f}")
    print(f"Prestação mensal:     {meses_fin}x de R$ {prestacao:,.2f}")
    print(f"Custo total:          R$ {custo_total:,.2f}")
    print(f"Total em juros:       R$ {juros_pagos:,.2f}")
`,
  },
];
