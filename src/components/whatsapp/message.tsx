import { useCallback, useMemo } from "react";
import { GroupMessage, Message as MessageObj } from "../../services/model/GroupMessage";


type MessageProps = {
    group?: GroupMessage
}
export const Message = ({ group }: MessageProps) => {

    const isOutgoing = useCallback((message: MessageObj) => {
        // Ajuste a lógica conforme necessário; aqui, se o fromUser contiver "551150396001", consideramos como saída
        return message.fromUser.includes('551150396001');
    }, []);

    const messages = useMemo(() => [...(group?.messages || [])].reverse(), [group]);

    return (
        <div className="row">
            <div className="col-md-12 col-xl-12" >
                {group ? (
                    <div
                        style={{
                            height: '400px', // Set a fixed height for the container
                            overflowY: 'scroll', // Enable vertical scrolling explicitly
                            paddingRight: '10px', // Add padding to avoid scrollbar overlap
                          
                        }}
                    >
                        {messages && messages?.map(message => (
                            <div
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: isOutgoing(message) ? 'flex-end' : 'flex-start',
                                    marginBottom: '10px'
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: isOutgoing(message) ? '#dcf8c6' : '#fff',
                                        border: '1px solid ' + (isOutgoing(message) ? '#b2e2a3' : '#ccc'),
                                        borderRadius: '15px',
                                        padding: '10px',
                                        maxWidth: '70%',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Carregando conversa...</div>
                )}
            </div>
        </div>
    )
}

export default Message;