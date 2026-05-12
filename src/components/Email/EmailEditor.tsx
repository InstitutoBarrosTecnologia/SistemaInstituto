import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';
import './EmailEditor.css';

// Importação lazy do ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface EmailEditorProps {
  /** Valor atual do conteúdo HTML */
  value: string;
  /** Callback quando o conteúdo muda */
  onChange: (value: string) => void;
  /** Placeholder do editor */
  placeholder?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Se o campo é obrigatório */
  required?: boolean;
  /** Modo inicial do editor: 'visual' ou 'html' */
  defaultMode?: 'visual' | 'html';
  /** Se deve forçar modo HTML (desabilita toggle para visual) */
  forceHtmlMode?: boolean;
}

/**
 * Editor de email com toggle entre modo Visual (WYSIWYG) e HTML
 * Usa React Quill para o modo visual
 */
export default function EmailEditor({
  value,
  onChange,
  placeholder = 'Digite o conteúdo do email aqui...',
  className = '',
  required = false,
  defaultMode = 'visual',
  forceHtmlMode = false,
}: EmailEditorProps) {
  
  // Estado para controlar modo do editor: 'visual' ou 'html'
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>(forceHtmlMode ? 'html' : defaultMode);
  
  // Estado local para o textarea HTML (para evitar problemas de sincronização)
  const [htmlValue, setHtmlValue] = useState(value);

  // Sincroniza htmlValue quando value externo muda
  useEffect(() => {
    setHtmlValue(value);
  }, [value]);

  // Força modo HTML quando forceHtmlMode é true
  useEffect(() => {
    if (forceHtmlMode && editorMode === 'visual') {
      setEditorMode('html');
    }
  }, [forceHtmlMode, editorMode]);

  // Configuração da toolbar do Quill
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  // Formatos permitidos no Quill
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  // Handler para mudanças no Quill (modo visual)
  const handleQuillChange = (content: string) => {
    onChange(content);
  };

  // Handler para mudanças no textarea (modo HTML)
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setHtmlValue(newValue);
    onChange(newValue);
  };

  // Handler para alternar modo
  const toggleMode = () => {
    setEditorMode((prev) => prev === 'visual' ? 'html' : 'visual');
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header com toggle */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Modo de Edição:
          </span>
          <div className="inline-flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              disabled={forceHtmlMode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                editorMode === 'visual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              } ${forceHtmlMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Visual
              </span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('html')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                editorMode === 'html'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                HTML
              </span>
            </button>
          </div>
        </div>

        {/* Info sobre modo atual */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {editorMode === 'visual' ? '🎨 Editor visual ativo' : forceHtmlMode ? '⚠️ Template requer modo HTML' : '💻 Código HTML'}
        </span>
      </div>

      {/* Editor */}
      <div className="relative">
        {editorMode === 'visual' ? (
          // Modo Visual: React Quill (com Suspense para lazy loading)
          <Suspense fallback={
            <div className="min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <svg className="size-8 animate-spin mx-auto mb-2 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">Carregando editor...</p>
              </div>
            </div>
          }>
            <div className="email-editor-container">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={handleQuillChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder={placeholder}
                className="bg-white dark:bg-gray-800 rounded-lg"
              />
            </div>
          </Suspense>
        ) : (
          // Modo HTML: Textarea
          <textarea
            value={htmlValue}
            onChange={handleHtmlChange}
            placeholder={placeholder}
            required={required}
            className="w-full min-h-[300px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 font-mono resize-y outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            spellCheck={false}
          />
        )}
      </div>

      {/* Footer com dicas */}
      <div className="mt-2 px-1">
        {forceHtmlMode && (
          <div className="mb-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/10 dark:border-orange-800">
            <p className="text-xs text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
              <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <strong>Template complexo detectado:</strong> Este template contém estilos avançados. Edite apenas no modo HTML.
            </p>
          </div>
        )}
        {editorMode === 'visual' ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Use a barra de ferramentas acima para formatar o texto. Alterne para HTML para edição avançada.
          </p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Cole ou edite HTML diretamente. Use variáveis como{' '}
            <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              {'{{nome_cliente}}'}
            </code>{' '}
            para personalização.
          </p>
        )}
      </div>
    </div>
  );
}
