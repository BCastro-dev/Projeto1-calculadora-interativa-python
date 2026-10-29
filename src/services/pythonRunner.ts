/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AngleUnit, ExecutionResult } from '../types/calculator';

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('ValueError: factorial() only accepts non-negative integers');
  }
  if (n > 170) {
    throw new Error('OverflowError: int too large to convert to float');
  }
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Greatest Common Divisor
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Combinations nCr
function comb(n: number, k: number): number {
  if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k)) return 0;
  return Math.round(factorial(n) / (factorial(k) * factorial(n - k)));
}

// Standard Math environment for Python
const PYTHON_MATH = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
  sqrt: (x: number) => {
    if (x < 0) throw new Error('ValueError: math domain error (cannot sqrt negative number)');
    return Math.sqrt(x);
  },
  cbrt: Math.cbrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: (x: number) => {
    if (x < -1 || x > 1) throw new Error('ValueError: math domain error for asin()');
    return Math.asin(x);
  },
  acos: (x: number) => {
    if (x < -1 || x > 1) throw new Error('ValueError: math domain error for acos()');
    return Math.acos(x);
  },
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  radians: (deg: number) => (deg * Math.PI) / 180,
  degrees: (rad: number) => (rad * 180) / Math.PI,
  log: (x: number, base?: number) => {
    if (x <= 0) throw new Error('ValueError: math domain error (log of non-positive number)');
    if (base !== undefined) {
      if (base <= 0 || base === 1) throw new Error('ValueError: math domain error (invalid base)');
      return Math.log(x) / Math.log(base);
    }
    return Math.log(x); // Natural log
  },
  log10: (x: number) => {
    if (x <= 0) throw new Error('ValueError: math domain error');
    return Math.log10(x);
  },
  log2: (x: number) => {
    if (x <= 0) throw new Error('ValueError: math domain error');
    return Math.log2(x);
  },
  exp: Math.exp,
  pow: (x: number, y: number) => Math.pow(x, y),
  floor: Math.floor,
  ceil: Math.ceil,
  factorial,
  gcd,
  comb,
  hypot: Math.hypot,
  fabs: Math.abs,
  isclose: (a: number, b: number, rel_tol = 1e-09, abs_tol = 0.0) =>
    Math.abs(a - b) <= Math.max(rel_tol * Math.max(Math.abs(a), Math.abs(b)), abs_tol),
};

// Global memory & state across calculations
const runtimeMemory: Record<string, any> = {
  ans: 0,
  mem: 0,
};

export function setMemoryValue(val: number) {
  runtimeMemory.mem = val;
}

export function getMemoryValue(): number {
  return runtimeMemory.mem ?? 0;
}

export function setAnsValue(val: number) {
  runtimeMemory.ans = val;
}

export function getAnsValue(): number {
  return runtimeMemory.ans ?? 0;
}

/**
 * Transforms percentage expressions into executable math while preserving binary modulo.
 * e.g. "200 + 10%" -> "(200 + (200 * (10 / 100)))"
 *      "200 - 15%" -> "(200 - (200 * (15 / 100)))"
 *      "200 * 15%" -> "200 * (15 / 100)"
 *      "50%"       -> "(50 / 100)"
 *      "(20 + 30)%" -> "(20 + 30) / 100"
 * while "10 % 3" remains "10 % 3" (modulo)
 */
export function transformPercentageExpression(expr: string): string {
  let res = expr;
  // 1. A + B% or A - B% -> e.g. 200 + 10% -> (200 + (200 * (10 / 100)))
  res = res.replace(
    /(\b\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)\s*%(?!\s*[\d\w(])/g,
    '($1 $2 ($1 * ($3 / 100)))'
  );
  // 2. Numbers followed by % e.g. 15% -> (15 / 100)
  res = res.replace(/(\b\d+(?:\.\d+)?)\s*%(?!\s*[\d\w(])/g, '($1 / 100)');
  // 3. Parentheses followed by % e.g. (20 + 30)% -> (20 + 30) / 100
  res = res.replace(/\)\s*%(?!\s*[\d\w(])/g, ') / 100');
  return res;
}

/**
 * Checks whether an expression contains a percentage calculation syntax
 */
export function isPercentageExpression(expr: string): boolean {
  return /(\b\d+(?:\.\d+)?|\))\s*%(?!\s*[\d\w(])/.test(expr);
}

/**
 * Evaluates a single Python math expression string (e.g. "12 + math.sqrt(64) * 2**3")
 */
export function evaluatePythonExpression(
  expression: string,
  angleUnit: AngleUnit = 'deg'
): { success: boolean; result: string; numericValue?: number; error?: string } {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { success: true, result: '0', numericValue: 0 };
  }

  try {
    // Check for division by zero patterns like "/ 0" or "// 0" or "% 0"
    if (/\/(?:\s*)0(?![.0-9])|\/\/(?:\s*)0(?![.0-9])|%(?:\s*)0(?![.0-9])/.test(trimmed)) {
      throw new Error('ZeroDivisionError: division by zero');
    }

    // Prepare sandbox
    const scope: Record<string, any> = {
      math: { ...PYTHON_MATH },
      ans: runtimeMemory.ans,
      mem: runtimeMemory.mem,
      abs: Math.abs,
      round: (val: number, digits = 0) => {
        const factor = Math.pow(10, digits);
        return Math.round(val * factor) / factor;
      },
      sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
      min: (...args: any[]) => {
        const flat = Array.isArray(args[0]) ? args[0] : args;
        return Math.min(...flat);
      },
      max: (...args: any[]) => {
        const flat = Array.isArray(args[0]) ? args[0] : args;
        return Math.max(...flat);
      },
      pow: Math.pow,
      len: (x: any) => (x && typeof x.length === 'number' ? x.length : 0),
      int: (x: any) => parseInt(x, 10),
      float: (x: any) => parseFloat(x),
      str: (x: any) => String(x),
      bin: (x: number) => '0b' + (Number(x) >>> 0).toString(2),
      hex: (x: number) => '0x' + (Number(x) >>> 0).toString(16),
      oct: (x: number) => '0o' + (Number(x) >>> 0).toString(8),
      porcentagem: (valor: number, perc: number) => (valor * perc) / 100,
      percent: (val: number) => val / 100,
    };

    // Transform percentage syntax (e.g. 200 * 15% -> 200 * (15 / 100))
    // Replace Python integer division '//' with Math.floor(a / b)
    // and '^' if user entered it into power '**'
    let trans = transformPercentageExpression(trimmed)
      .replace(/\^/g, '**')
      .replace(/(\w+|\d+(?:\.\d+)?|\))\s*\/\/\s*(\w+|\d+(?:\.\d+)?|\()/g, 'Math.floor($1 / $2)');

    // In DEG mode, if raw sin(X) is called without math.radians, adjust if needed
    if (angleUnit === 'deg') {
      // If sin/cos/tan is called directly without math.radians:
      scope.sin_deg = (x: number) => Math.sin(PYTHON_MATH.radians(x));
      scope.cos_deg = (x: number) => Math.cos(PYTHON_MATH.radians(x));
      scope.tan_deg = (x: number) => {
        const mod = Math.abs(x % 180);
        if (Math.abs(mod - 90) < 1e-9) throw new Error('ValueError: tan() undefined for 90° + k*180°');
        return Math.tan(PYTHON_MATH.radians(x));
      };
    }

    // Safely evaluate using Function constructor inside controlled sandbox
    const keys = Object.keys(scope);
    const vals = Object.values(scope);
    const evaluator = new Function(...keys, `return (${trans});`);
    const rawResult = evaluator(...vals);

    if (rawResult === undefined || rawResult === null) {
      return { success: true, result: 'None', numericValue: 0 };
    }

    if (typeof rawResult === 'number') {
      if (!isFinite(rawResult)) {
        if (isNaN(rawResult)) {
          throw new Error('ValueError: Result is undefined (NaN)');
        }
        throw new Error('OverflowError: math range error (Infinity)');
      }

      // Format clean float
      let formatted: string;
      if (Number.isInteger(rawResult)) {
        formatted = rawResult.toString();
      } else {
        const str = rawResult.toPrecision(12);
        formatted = parseFloat(str).toString();
      }

      runtimeMemory.ans = rawResult;
      return { success: true, result: formatted, numericValue: rawResult };
    }

    // If result is string, array or object
    return {
      success: true,
      result: typeof rawResult === 'object' ? JSON.stringify(rawResult) : String(rawResult),
    };
  } catch (err: any) {
    let msg = err?.message || 'SyntaxError: invalid syntax';
    if (msg.includes('is not defined')) {
      const match = msg.match(/(\w+) is not defined/);
      msg = `NameError: name '${match ? match[1] : 'identifier'}' is not defined`;
    } else if (msg.includes('Unexpected token') || msg.includes('Unexpected number')) {
      msg = 'SyntaxError: invalid syntax';
    }
    return { success: false, result: 'Erro', error: msg };
  }
}

/**
 * Runs a multi-line Python script inside browser sandbox, capturing stdout & variables
 */
export async function executePythonScript(code: string): Promise<ExecutionResult> {
  const start = performance.now();
  const stdout: string[] = [];
  const trackedVars: Record<string, string> = {};

  try {
    const lines = code.split('\n');

    // Context scope
    const scope: Record<string, any> = {
      math: { ...PYTHON_MATH },
      ans: runtimeMemory.ans,
      mem: runtimeMemory.mem,
      abs: Math.abs,
      round: (val: number, d = 0) => Math.round(val * Math.pow(10, d)) / Math.pow(10, d),
      sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
      min: (...args: any[]) => Math.min(...(Array.isArray(args[0]) ? args[0] : args)),
      max: (...args: any[]) => Math.max(...(Array.isArray(args[0]) ? args[0] : args)),
      pow: Math.pow,
      len: (x: any) => (x?.length ?? 0),
      int: (x: any) => parseInt(x, 10),
      float: (x: any) => parseFloat(x),
      str: (x: any) => String(x),
      bool: (x: any) => Boolean(x),
      porcentagem: (valor: number, perc: number) => (valor * perc) / 100,
      percent: (val: number) => val / 100,
      range: (start: number, stop?: number, step = 1) => {
        if (stop === undefined) {
          stop = start;
          start = 0;
        }
        const res: number[] = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
          if (res.length > 2000) break;
          res.push(i);
        }
        return res;
      },
      print: (...args: any[]) => {
        const text = args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
          .join(' ');
        stdout.push(text);
      },
      input: (promptMsg?: string) => {
        if (promptMsg) stdout.push(promptMsg);
        // Default simulated response
        return '10';
      },
    };

    // Transpile lightweight Python code to JS for in-browser execution
    // Handle Python print(), def, variables, loops, f-strings, comments
    let jsCode = '';
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Trim carriage return
      line = line.replace(/\r$/, '');

      // Check comments
      const commentIdx = line.indexOf('#');
      let codePart = commentIdx !== -1 ? line.substring(0, commentIdx) : line;

      // Handle python f-strings: f"Resultado: {resultado}" -> `Resultado: ${resultado}`
      codePart = codePart.replace(/f"([^"]*)"/g, (_, content) => {
        return '`' + content.replace(/\{([^}]+)\}/g, '${$1}') + '`';
      });
      codePart = codePart.replace(/f'([^']*)'/g, (_, content) => {
        return '`' + content.replace(/\{([^}]+)\}/g, '${$1}') + '`';
      });

      // Handle ** power
      codePart = codePart.replace(/\*\*/g, '**');

      // Handle Python boolean and None
      codePart = codePart
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null');

      // Handle elif / if / else
      codePart = codePart
        .replace(/\belif\s+([^:]+):/, '} else if ($1) {')
        .replace(/\bif\s+([^:]+):/, 'if ($1) {')
        .replace(/\belse\s*:/, '} else {');

      // Handle for x in range(...):
      codePart = codePart.replace(
        /for\s+([a-zA-Z_]\w*)\s+in\s+range\(([^)]+)\):/,
        'for (let $1 of range($2)) {'
      );

      // Handle for x in iterable:
      codePart = codePart.replace(
        /for\s+([a-zA-Z_]\w*)\s+in\s+([^:]+):/,
        'for (let $1 of ($2)) {'
      );

      // Handle while condition:
      codePart = codePart.replace(/while\s+([^:]+):/, 'while ($1) {');

      // Handle def func(args):
      codePart = codePart.replace(/def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\):/, 'function $1($2) {');

      // Handle import math
      if (/^\s*import\s+math\b/.test(codePart) || /^\s*from\s+math\s+import\b/.test(codePart)) {
        codePart = '// ' + codePart;
      }

      jsCode += codePart + '\n';
    }

    // Auto-close open braces based on indentation or wrap execution safely
    // Let's create an executor function
    const keys = Object.keys(scope);
    const vals = Object.values(scope);

    // Safeguard loop iterations
    const safeScript = `
      "use strict";
      let __iters = 0;
      function __tick() {
        if (++__iters > 50000) throw new Error("RuntimeError: Execution limit exceeded (potential infinite loop)");
      }
      ${jsCode}
    `;

    try {
      const runner = new Function(...keys, safeScript);
      const ret = runner(...vals);

      const elapsed = Math.round(performance.now() - start);

      return {
        stdout,
        returnValue: ret !== undefined && ret !== null ? String(ret) : null,
        error: null,
        executionTimeMs: elapsed,
        variables: trackedVars,
      };
    } catch (innerErr: any) {
      // If JS transpile fails, attempt a line-by-line fallback evaluator
      const fallbackResult = fallbackEvaluateScript(code, scope, stdout);
      const elapsed = Math.round(performance.now() - start);
      if (fallbackResult.error) {
        return {
          stdout,
          returnValue: null,
          error: fallbackResult.error,
          executionTimeMs: elapsed,
          variables: trackedVars,
        };
      }
      return {
        stdout: fallbackResult.stdout,
        returnValue: fallbackResult.returnValue,
        error: null,
        executionTimeMs: elapsed,
        variables: trackedVars,
      };
    }
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - start);
    return {
      stdout,
      returnValue: null,
      error: `Traceback (most recent call last):\n  ${err?.message || 'Error: Execution failed'}`,
      executionTimeMs: elapsed,
      variables: trackedVars,
    };
  }
}

/**
 * Line by line fallback interpreter for Python calculator scripts
 */
function fallbackEvaluateScript(
  code: string,
  scope: Record<string, any>,
  stdout: string[]
): { stdout: string[]; returnValue: string | null; error: string | null } {
  try {
    const lines = code.split('\n');
    let lastValue: any = null;

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      // Handle print(...)
      const printMatch = line.match(/^print\((.*)\)$/);
      if (printMatch) {
        const inner = printMatch[1];
        // Check f-string
        if (inner.startsWith('f"') || inner.startsWith("f'")) {
          const stripped = inner.substring(2, inner.length - 1);
          const resolved = stripped.replace(/\{([^}]+)\}/g, (_, expr) => {
            try {
              const keys = Object.keys(scope);
              const vals = Object.values(scope);
              return new Function(...keys, `return (${expr})`)(...vals);
            } catch {
              return expr;
            }
          });
          stdout.push(resolved);
        } else {
          try {
            const keys = Object.keys(scope);
            const vals = Object.values(scope);
            const val = new Function(...keys, `return (${inner})`)(...vals);
            stdout.push(String(val));
          } catch {
            stdout.push(inner.replace(/^["']|["']$/g, ''));
          }
        }
        continue;
      }

      // Handle variable assignment: var = expr
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        let valExpr = assignMatch[2];
        try {
          const keys = Object.keys(scope);
          const vals = Object.values(scope);
          const val = new Function(...keys, `return (${valExpr})`)(...vals);
          scope[varName] = val;
          lastValue = val;
        } catch {
          // Ignore
        }
        continue;
      }

      // Standalone expression
      try {
        const keys = Object.keys(scope);
        const vals = Object.values(scope);
        lastValue = new Function(...keys, `return (${line})`)(...vals);
      } catch {
        // Continue
      }
    }

    return {
      stdout,
      returnValue: lastValue !== null && lastValue !== undefined ? String(lastValue) : null,
      error: null,
    };
  } catch (err: any) {
    return {
      stdout,
      returnValue: null,
      error: `SyntaxError: ${err?.message || 'Could not parse Python script'}`,
    };
  }
}

/**
 * Converts user calculation tokens into authentic, idiomatic Python code
 */
export function generatePythonEquivalent(
  expression: string,
  result: string,
  angleUnit: AngleUnit = 'deg'
): string {
  let expr = expression.trim();
  if (!expr) expr = '0';

  const needsMathImport =
    expr.includes('math.') ||
    expr.includes('sqrt') ||
    expr.includes('sin') ||
    expr.includes('cos') ||
    expr.includes('tan') ||
    expr.includes('pi') ||
    expr.includes('factorial');

  let code = '';
  if (needsMathImport) {
    code += `import math\n\n`;
  }

  // Se a expressão usa sintaxe de porcentagem, ensina como calcular em Python
  if (isPercentageExpression(expr)) {
    const pythonExpr = transformPercentageExpression(expr);
    code += `# Em Python, o operador '%' é o resto da divisão (módulo).\n`;
    code += `# Para calcular porcentagem, dividimos por 100: ex: 15% => (15 / 100)\n`;
    code += `expressao_original = "${expr}"\n`;
    code += `resultado = ${pythonExpr}\n\n`;
    code += `print(f"Cálculo: {expressao_original}")\n`;
    code += `print(f"Resultado em Python: {resultado}")  # => ${result}\n`;
    return code;
  }

  code += `# Expressão calculada:\n`;
  code += `expressao = "${expr}"\n`;
  code += `resultado = ${expr}\n\n`;
  code += `print(f"Resultado em Python: {resultado}")  # => ${result}\n`;

  return code;
}
