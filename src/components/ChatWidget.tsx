import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Building,
  CheckCheck,
  User,
  Phone,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Property, Conversation, ConversationMessage } from "../types";
import { sendMessage, subscribeToConversations } from "../services/dbService";
import { getSafeLocalStorage, setSafeLocalStorage, formatCurrency } from "../utils/formatters";
import { WHATSAPP_LINK } from "../constants/config";

interface ChatWidgetProps {
  attachedProperty: Property | null;
  onClearAttachedProperty: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  currentTheme?: "dark" | "light";
}

const CHAT_CLIENT_STORAGE_KEY = "nwani_chat_client_info";

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  attachedProperty,
  onClearAttachedProperty,
  isOpen,
  onToggleOpen,
  currentTheme = "dark",
}) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isIdentified, setIsIdentified] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load client info on mount
  useEffect(() => {
    const saved = getSafeLocalStorage<{ name: string; phone: string; convId: string } | null>(
      CHAT_CLIENT_STORAGE_KEY,
      null
    );
    if (saved && saved.name && saved.phone) {
      setClientName(saved.name);
      setClientPhone(saved.phone);
      setConversationId(saved.convId || `conv-${Date.now()}`);
      setIsIdentified(true);
    } else {
      setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
    }
  }, []);

  // Listen to conversation messages
  useEffect(() => {
    if (!conversationId) return;

    const unsub = subscribeToConversations((allConvs) => {
      const myConv = allConvs.find((c) => c.id === conversationId);
      if (myConv && myConv.messages) {
        setMessages(myConv.messages);
      }
    });

    return () => unsub();
  }, [conversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Show emergency WhatsApp fallback if user sends a message and waits > 8 seconds without admin reply
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "client") {
      const timer = setTimeout(() => {
        setShowWhatsAppFallback(true);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setShowWhatsAppFallback(false);
    }
  }, [messages]);

  const handleIdentificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setIsIdentified(true);
    setSafeLocalStorage(CHAT_CLIENT_STORAGE_KEY, {
      name: clientName.trim(),
      phone: clientPhone.trim(),
      convId: conversationId,
    });

    // Send an automatic greeting / inquiry
    const firstText = attachedProperty
      ? `Olá, tenho interesse no imóvel ${attachedProperty.title} (${attachedProperty.code}).`
      : `Olá, gostaria de obter informações sobre os imóveis da Nwani Imóveis.`;

    sendMessage(conversationId, firstText, "client", {
      name: clientName.trim(),
      phone: clientPhone.trim(),
      property: attachedProperty
        ? {
            code: attachedProperty.code,
            title: attachedProperty.title,
            price: formatCurrency(attachedProperty.price, attachedProperty.currency),
          }
        : undefined,
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      await sendMessage(conversationId, text, "client", {
        name: clientName || "Visitante",
        phone: clientPhone || "",
        property: attachedProperty
          ? {
              code: attachedProperty.code,
              title: attachedProperty.title,
              price: formatCurrency(attachedProperty.price, attachedProperty.currency),
            }
          : undefined,
      });
    } catch (err) {
      console.error("Error sending chat message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="nwani-live-chat-widget" className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button with Pulsing Online Dot */}
      {!isOpen && (
        <button
          id="chat-open-btn"
          onClick={onToggleOpen}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-2xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Abrir Chat Online"
        >
          {/* Pulsing Green Online Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>

          <MessageCircle className="w-5 h-5" />
          <span className="tracking-wide">Atendimento Online</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          id="chat-window-container"
          className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 text-stone-100 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-serif-luxury">
                  N
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-950" />
              </div>
              <div>
                <span className="font-serif-luxury text-sm font-bold text-stone-100 block leading-tight">
                  Nwani Imóveis
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Corretores Online
                </span>
              </div>
            </div>

            <button
              id="chat-close-btn"
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Attached Property Card in Chat */}
          {attachedProperty && (
            <div className="px-3 py-2 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <Building className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate text-xs">
                  <span className="font-bold text-amber-300 mr-1">{attachedProperty.code}:</span>
                  <span className="text-stone-300">{attachedProperty.title}</span>
                </div>
              </div>
              <button
                onClick={onClearAttachedProperty}
                className="text-stone-500 hover:text-stone-300 p-1"
                title="Desanexar imóvel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Content Area: Form if not identified, or Messages thread */}
          {!isIdentified ? (
            <div className="flex-1 p-6 flex flex-col justify-center text-center space-y-4 overflow-y-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif-luxury text-stone-100">Iniciar Atendimento</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Informe o seu nome e telefone para falar diretamente com os nossos consultores imobiliários.
                </p>
              </div>

              <form onSubmit={handleIdentificationSubmit} className="space-y-3 pt-2">
                <div className="relative text-left">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="chat-input-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu Nome *"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="relative text-left">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="chat-input-phone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Seu WhatsApp / Telefone *"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  id="chat-btn-start"
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Entrar no Chat
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {/* Initial Welcome Bubble */}
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                  N
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-stone-800 text-xs text-stone-200 leading-relaxed border border-stone-700/60">
                  Olá, {clientName}! Bem-vindo ao atendimento da <strong>Nwani Imóveis</strong>. Como podemos ajudá-lo hoje?
                </div>
              </div>

              {/* Messages list */}
              {messages.map((m) => {
                const isMe = m.sender === "client";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? "bg-amber-500 text-stone-950 font-medium rounded-br-none shadow-md"
                          : "bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700/60"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          isMe ? "text-stone-800" : "text-stone-400"
                        }`}
                      >
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Emergency WhatsApp Button prompt */}
              {showWhatsAppFallback && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-center space-y-2 mt-2">
                  <p className="text-[11px] text-emerald-300">
                    Deseja falar diretamente no WhatsApp oficial para uma resposta imediata?
                  </p>
                  <a
                    id="chat-emergency-whatsapp-btn"
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Falar no WhatsApp</span>
                  </a>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input form */}
          {isIdentified && (
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2 shrink-0"
            >
              <input
                id="chat-input-message"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite a sua mensagem..."
                className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                id="chat-btn-send"
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
