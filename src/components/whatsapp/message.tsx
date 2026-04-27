import { useMemo } from "react";
import type { WhatsappMessageResponseDto } from "../../services/model/WhatsappTypes";

type MessageProps = {
  messages?: WhatsappMessageResponseDto[];
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const Message = ({ messages = [] }: MessageProps) => {
  // Group messages by date for date separators
  const grouped = useMemo(() => {
    const result: { date: string; msgs: WhatsappMessageResponseDto[] }[] = [];
    let lastDate = "";

    for (const msg of messages) {
      const date = formatDateSeparator(msg.dataMensagem);
      if (date !== lastDate) {
        result.push({ date, msgs: [] });
        lastDate = date;
      }
      result[result.length - 1].msgs.push(msg);
    }

    return result;
  }, [messages]);

  return (
    <div className="row">
      <div className="col-md-12 col-xl-12">
        {messages.length > 0 ? (
          <div
            style={{
              height: "400px",
              overflowY: "scroll",
              paddingRight: "10px",
            }}
          >
            {grouped.map(({ date, msgs }) => (
              <div key={date}>
                {/* Date separator */}
                <div
                  style={{
                    textAlign: "center",
                    color: "#888",
                    fontSize: "0.75rem",
                    margin: "12px 0",
                  }}
                >
                  {date}
                </div>

                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.enviadaPelaClinica
                        ? "flex-end"
                        : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: msg.enviadaPelaClinica
                          ? "#dcf8c6"
                          : "#fff",
                        border:
                          "1px solid " +
                          (msg.enviadaPelaClinica ? "#b2e2a3" : "#ccc"),
                        borderRadius: "15px",
                        padding: "10px",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.tipoMidia && msg.tipoMidia !== "text" && msg.urlMidia ? (
                        <div style={{ marginBottom: "4px" }}>
                          {msg.tipoMidia === "image" ? (
                            <img
                              src={msg.urlMidia}
                              alt="imagem"
                              style={{ maxWidth: "100%", borderRadius: "8px" }}
                            />
                          ) : (
                            <a
                              href={msg.urlMidia}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: "0.8rem", color: "#1a73e8" }}
                            >
                              {msg.tipoMidia === "audio"
                                ? "🎤 Áudio"
                                : "📎 Arquivo"}
                            </a>
                          )}
                        </div>
                      ) : null}

                      {msg.conteudo}

                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "#999",
                          marginTop: "4px",
                          textAlign: "right",
                        }}
                      >
                        {formatTime(msg.dataMensagem)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div>Carregando conversa...</div>
        )}
      </div>
    </div>
  );
};

export default Message;
