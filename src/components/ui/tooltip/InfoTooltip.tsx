import { useState } from "react";

interface InfoTooltipProps {
  text: string;
}

/**
 * Ícone "i" pequeno que exibe um tooltip com a regra do indicador ao hover.
 * Posicionamento: superior-esquerdo do card pai (use relative no pai).
 */
export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Ícone i */}
      <button
        type="button"
        aria-label="Informações sobre o indicador"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors cursor-default focus:outline-none"
      >
        <span className="text-[9px] font-bold leading-none select-none">i</span>
      </button>

      {/* Tooltip */}
      {visible && (
        <div
          role="tooltip"
          className="absolute z-50 right-0 top-6 w-56 rounded-lg bg-gray-800 dark:bg-gray-900 text-white text-xs leading-relaxed px-3 py-2 shadow-xl border border-gray-700"
        >
          {/* Seta */}
          <span className="absolute -top-1.5 right-1.5 w-3 h-3 bg-gray-800 dark:bg-gray-900 border-r border-t border-gray-700 rotate-45" />
          {text}
        </div>
      )}
    </div>
  );
}
