import { useMemo } from 'react';
import { replaceVariables, EmailVariables, DEFAULT_VARIABLES } from '../../utils/emailVariables';

interface EmailPreviewProps {
  /** HTML do template ou corpo do email */
  htmlContent: string;
  /** Variáveis customizadas para substituir no template */
  variables?: EmailVariables;
  /** Título para exibir no topo do preview */
  title?: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente de preview de email em tempo real
 * Renderiza o HTML do email com variáveis substituídas em um iframe seguro
 */
export default function EmailPreview({ 
  htmlContent, 
  variables = {}, 
  title = "Preview do Email",
  className = "" 
}: EmailPreviewProps) {
  
  // Mescla variáveis fornecidas com defaults e substitui no HTML
  const previewHtml = useMemo(() => {
    const mergedVars = { ...DEFAULT_VARIABLES, ...variables };
    return replaceVariables(htmlContent, mergedVars, true);
  }, [htmlContent, variables]);

  // Verifica se há conteúdo para mostrar
  const hasContent = htmlContent && htmlContent.trim().length > 0;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header do Preview */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <svg 
            className="size-6 text-blue-600 dark:text-blue-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
            />
          </svg>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
        
        {/* Badge de status */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <span className="size-2 rounded-full bg-white animate-pulse" />
          Tempo Real
        </span>
      </div>

      {/* Container do Preview com scroll */}
      <div className="flex-1 overflow-auto p-6" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}>
        {!hasContent ? (
          // Estado vazio
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-700">
                <svg 
                  className="size-16 text-blue-600 dark:text-blue-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce">
                ✨
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Selecione um Template
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed mb-6">
              Escolha um dos nossos <strong className="text-blue-600 dark:text-blue-400">3 templates profissionais</strong> ou digite seu próprio conteúdo HTML para ver o preview em tempo real
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <span className="text-2xl">📧</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Newsletter</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <span className="text-2xl">🎁</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Promocional</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <span className="text-2xl">✅</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Confirmação</span>
              </div>
            </div>
          </div>
        ) : (
          // Preview do email em iframe
          <div className="w-full">
            <iframe
              title="Email Preview"
              srcDoc={previewHtml}
              className="w-full border-0 rounded-lg"
              style={{ 
                minHeight: '800px',
                height: 'auto',
                background: 'transparent',
              }}
              sandbox="allow-same-origin"
              onLoad={(e) => {
                const iframe = e.target as HTMLIFrameElement;
                if (iframe.contentWindow?.document.body) {
                  const height = iframe.contentWindow.document.body.scrollHeight;
                  iframe.style.height = `${height + 40}px`;
                }
              }}
            />
            
            {/* Aviso sobre variáveis */}
            <div className="mt-6 px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800 max-w-3xl mx-auto shadow-lg">
              <div className="flex gap-3">
                <svg 
                  className="size-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center gap-2">
                    ✨ Preview com Dados de Exemplo
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    As variáveis como <code className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded text-xs font-mono border border-blue-300">{'{{nome_cliente}}'}</code> serão substituídas pelos <strong>dados reais</strong> de cada destinatário ao enviar o email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer com dica */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
          <span className="text-lg">💡</span>
          <strong>Dica:</strong> Use variáveis como <code className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono border border-gray-300 dark:border-gray-600">
            {'{{nome_cliente}}'}
          </code> para personalizar
        </p>
      </div>
    </div>
  );
}
