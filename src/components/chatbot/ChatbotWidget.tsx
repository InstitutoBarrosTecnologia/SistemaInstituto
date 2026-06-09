import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatbotService, type ChatbotResponse, type ChatbotRequest } from '../../services/ChatbotService';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS INTERNOS
// ─────────────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  title?: string;
  type?: string;
  data?: unknown;
  suggestions?: string[];
  timestamp: Date;
  loading?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_COMMANDS = [
  { label: '💰 Faturamento', command: 'faturamento' },
  { label: '📉 Gastos', command: 'gastos' },
  { label: '📊 Sessões', command: 'sessões' },
  { label: '🧑‍⚕️ Pacientes', command: 'pacientes ativos' },
  { label: '📅 Agendamentos', command: 'agendamentos' },
  { label: '🎯 Resumo', command: 'resumo' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FORMATAÇÃO DE DADOS
// ─────────────────────────────────────────────────────────────────────────────

function formatBoldMarkdown(text: string): string {
  // Converte **texto** para <strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

function renderDataPreview(type: string, data: unknown): string | null {
  if (!data) return null;
  try {
    const d = data as Record<string, unknown>;
    if (type === 'faturamento') {
      const real = d.faturamentoReal ?? d.FaturamentoReal;
      const esperado = d.faturamentoEsperado ?? d.FaturamentoEsperado;
      const pct = d.percentualRecebido ?? d.PercentualRecebido;
      if (real !== undefined) {
        return `Real: R$ ${Number(real).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Esperado: R$ ${Number(esperado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | ${Number(pct).toFixed(1)}%`;
      }
    }
    if (type === 'despesas') {
      const total = d.totalDespesas ?? d.TotalDespesas;
      const pago = d.totalPago ?? d.TotalPago;
      const pend = d.totalPendente ?? d.TotalPendente;
      if (total !== undefined) {
        return `Total: R$ ${Number(total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Pago: R$ ${Number(pago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Pendente: R$ ${Number(pend).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
    }
  } catch {
    // silencioso
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Olá! Sou o assistente de indicadores do Instituto Barros. Digite um comando ou escolha uma opção abaixo.',
      title: '🤖 Assistente de Indicadores',
      type: 'welcome',
      suggestions: QUICK_COMMANDS.map(q => q.command),
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const sendCommand = async (command: string) => {
    if (!command.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: command,
      timestamp: new Date(),
    };

    const loadingMsg: ChatMessage = {
      id: `l-${Date.now()}`,
      role: 'bot',
      text: 'Consultando dados...',
      loading: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      const req: ChatbotRequest = { command, periodo };
      const resp: ChatbotResponse = await ChatbotService.processCommand(req);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: resp.text,
        title: resp.title,
        type: resp.type,
        data: resp.data,
        suggestions: resp.suggestions,
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(m => !m.loading).concat(botMsg));
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'bot',
        text: 'Erro ao consultar os dados. Verifique a conexão com o servidor.',
        title: '⚠️ Erro',
        type: 'erro',
        timestamp: new Date(),
      };
      setMessages(prev => prev.filter(m => !m.loading).concat(errMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'bot',
        text: 'Chat limpo! Como posso ajudar?',
        title: '🤖 Assistente de Indicadores',
        type: 'welcome',
        suggestions: QUICK_COMMANDS.map(q => q.command),
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── BOTÃO FLUTUANTE ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Assistente de Indicadores"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(29,78,216,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          color: '#fff',
          fontSize: '24px',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* ── PAINEL DO CHAT ───────────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            zIndex: 9998,
            width: '380px',
            maxHeight: '600px',
            borderRadius: '16px',
            background: '#fff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)',
              color: '#fff',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Assistente de Indicadores</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Instituto Barros</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Seletor de período */}
              <select
                value={periodo}
                onChange={e => setPeriodo(e.target.value as typeof periodo)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '3px 6px',
                  cursor: 'pointer',
                }}
              >
                <option value="dia" style={{ color: '#000' }}>Hoje</option>
                <option value="semana" style={{ color: '#000' }}>Semana</option>
                <option value="mes" style={{ color: '#000' }}>Mês</option>
                <option value="ano" style={{ color: '#000' }}>Ano</option>
              </select>
              <button
                onClick={clearChat}
                title="Limpar chat"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                }}
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Quick commands */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              padding: '8px 12px',
              borderBottom: '1px solid #f0f0f0',
              flexShrink: 0,
            }}
          >
            {QUICK_COMMANDS.map(qc => (
              <button
                key={qc.command}
                onClick={() => sendCommand(qc.command)}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
              >
                {qc.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} onSuggestionClick={sendCommand} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #F3F4F6',
              display: 'flex',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite um comando... (ex: faturamento)"
              disabled={loading}
              style={{
                flex: 1,
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.15s',
                background: loading ? '#F9FAFB' : '#fff',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1D4ED8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
            />
            <button
              onClick={() => sendCommand(input)}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)'
                  : '#E5E7EB',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                color: input.trim() && !loading ? '#fff' : '#9CA3AF',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: '16px',
                transition: 'background 0.15s',
              }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  onSuggestionClick: (cmd: string) => void;
}

function MessageBubble({ message, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (message.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div
          style={{
            background: '#F3F4F6',
            borderRadius: '12px 12px 12px 2px',
            padding: '10px 14px',
            maxWidth: '75%',
            fontSize: '13px',
            color: '#6B7280',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          ⏳ Consultando dados...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Bubble */}
        <div
          style={{
            background: isUser
              ? 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)'
              : '#F3F4F6',
            color: isUser ? '#fff' : '#111827',
            borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
            padding: '10px 14px',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          {/* Title (bot only) */}
          {!isUser && message.title && (
            <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '13px' }}>
              {message.title}
            </div>
          )}

          {/* Text with markdown bold */}
          <div
            dangerouslySetInnerHTML={{ __html: formatBoldMarkdown(message.text) }}
          />

          {/* Data preview (faturamento/despesas) */}
          {!isUser && message.type && message.data && (() => {
            const preview = renderDataPreview(message.type!, message.data);
            return preview ? (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#374151',
                  fontFamily: 'monospace',
                }}
              >
                {preview}
              </div>
            ) : null;
          })()}
        </div>

        {/* Suggestions */}
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {message.suggestions.map(s => (
              <button
                key={s}
                onClick={() => onSuggestionClick(s)}
                style={{
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: '#4338CA',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C7D2FE'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: isUser ? 'right' : 'left', marginTop: '1px' }}>
          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default ChatbotWidget;
