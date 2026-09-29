import React, { useState, useRef, useEffect } from 'react';
import { Customer, ChatMessage } from '../types/support';
import {
  Send,
  User,
  Brain,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Wrench,
  DollarSign,
  Play
} from 'lucide-react';

interface ChatInterfaceProps {
  customer: Customer;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  currentStage: 1 | 2 | 3;
  suggestedPrompt: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  customer,
  messages,
  onSendMessage,
  isLoading,
  currentStage,
  suggestedPrompt,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleRunSuggested = () => {
    onSendMessage(suggestedPrompt);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-100">{customer.name}</h2>
              <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {customer.plan.split('(')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
              Hardware: <span className="text-slate-300 font-mono text-[11px]">{customer.device}</span>
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-[11px] font-mono text-indigo-400 font-semibold">
            {customer.location}
          </div>
          <div className="text-[10px] text-slate-500">
            Account: {customer.accountAge}
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950/50 via-slate-900/40 to-slate-950/70">
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-1">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full shadow-sm">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isCustomer ? 'justify-end' : 'justify-start'}`}
            >
              {/* Agent Avatar */}
              {!isCustomer && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/40">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-lg ${
                  isCustomer
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/95 border border-slate-700/80 text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Header tag for Agent */}
                {!isCustomer && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-indigo-300">Hindsight AI Agent</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-400/20 font-mono">
                        Memory Recall Engine
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Escalation Work Order Card (for Ticket #3) */}
                {msg.escalationNotice && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 text-amber-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                        Autonomous Escalation Work Order
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-slate-400 block">Ticket Created:</span>
                        <span className="font-mono font-bold text-amber-300">{msg.escalationNotice.ticketNumber}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-slate-400 block">Assigned Tier:</span>
                        <span className="font-semibold text-slate-200">{msg.escalationNotice.tier}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-slate-950/60 p-2 rounded-lg border border-amber-500/20">
                      <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300">{msg.escalationNotice.actionTaken}</span>
                    </div>

                    {msg.escalationNotice.compensation && (
                      <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{msg.escalationNotice.compensation}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Timestamp */}
                {isCustomer && (
                  <div className="text-[10px] text-indigo-200 text-right mt-1.5 opacity-80">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {/* Customer Avatar */}
              {isCustomer && (
                <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center shrink-0 ring-1 ring-indigo-400/40">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 animate-pulse">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-3 shadow-md flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              </div>
              <span className="text-xs text-indigo-300 font-mono">
                Hindsight: Retrieving customer episodic memory &amp; evaluating recurrence...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Bar */}
      <div className="px-4 py-2.5 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-semibold text-slate-200 shrink-0">Stage #{currentStage} Prompt:</span>
          <span className="text-slate-400 italic truncate max-w-[260px] sm:max-w-xs">
            &ldquo;{suggestedPrompt}&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setInputText(suggestedPrompt)}
            className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded-md transition-all font-medium"
          >
            Insert
          </button>
          <button
            onClick={handleRunSuggested}
            disabled={isLoading}
            className="text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-2.5 py-1 rounded-md transition-all font-semibold flex items-center gap-1 shadow-sm"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Send Now</span>
          </button>
        </div>
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message support as ${customer.name}...`}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0 active:scale-95"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
