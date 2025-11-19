import React, { useState, useEffect, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import './ChatComponent.css';

const ChatComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sdkRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    const sdk = new RetellWebClient();
    sdkRef.current = sdk;

    sdk.on("call_started", () => {
      console.log("Conversação iniciada");
      setIsConnected(true);
      setError(null);
    });

    sdk.on("update", (update) => {
      if (update && update.transcript) {
        setTranscript(prev => [...prev, update.transcript]);
      }
    });

    sdk.on("agent_start_talking", () => {
      setIsSpeaking(true);
    });

    sdk.on("agent_stop_talking", () => {
      setIsSpeaking(false);
    });

    sdk.on("call_ended", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });

    sdk.on("error", (error) => {
      setError(`Erro: ${error.message || 'Erro desconhecido'}`);
      setIsConnected(false);
      setIsSpeaking(false);
    });

    return () => {
      if (sdkRef.current) {
        sdkRef.current.stopCall();
      }
    };
  }, []);

  const startConversation = async () => {
    if (!sdkRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: import.meta.env.VITE_RETELL_AGENT_ID || 'agent_default' })
      });
      if (!response.ok) throw new Error('Falha ao registrar chamada');
      const { accessToken } = await response.json();
      await sdkRef.current.startCall({ accessToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const stopConversation = () => {
    if (sdkRef.current) {
      sdkRef.current.stopCall();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Assistente DecorAR</h3>
        <div className="status-indicator">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </div>
      <div className="chat-content">
        <div className="transcript-container">
          <div className="transcript-header">
            <h4>Conversa</h4>
            <button onClick={() => setTranscript([])} className="clear-btn">Limpar</button>
          </div>
          <div className="transcript-messages">
            {transcript.length === 0 ? (
              <p className="empty-transcript">Nenhuma mensagem ainda. Inicie uma conversa!</p>
            ) : (
              transcript.map((message, index) => (
                <div key={index} className="message">{message}</div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="chat-controls">
        {error && <div className="error-message">{error}</div>}
        {!isConnected ? (
          <button onClick={startConversation} disabled={isLoading} className="start-btn">
            {isLoading ? 'A iniciar...' : 'Iniciar Conversa'}
          </button>
        ) : (
          <button onClick={stopConversation} className="stop-btn">Terminar Conversa</button>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;