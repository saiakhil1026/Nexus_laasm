import React from 'react';
import { Customer, Ticket } from '../types/support';
import { CheckCircle2, Play, Sparkles, Clock, AlertTriangle, ArrowRight, Zap, ShieldAlert } from 'lucide-react';

interface DemoScriptBarProps {
  customer: Customer;
  currentStage: 1 | 2 | 3;
  onSelectStage: (stage: 1 | 2 | 3) => void;
  onRunCurrentTicket: () => void;
  isLoading: boolean;
}

export const DemoScriptBar: React.FC<DemoScriptBarProps> = ({
  customer,
  currentStage,
  onSelectStage,
  onRunCurrentTicket,
  isLoading,
}) => {
  const currentTicket = customer.tickets.find((t) => t.stage === currentStage) || customer.tickets[0];

  const stagesMeta = [
    {
      stage: 1 as const,
      label: 'Ticket #1: First Occurrence',
      subtitle: 'Standard Tier-1 Triage',
      icon: Clock,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      activeColor: 'ring-blue-500/50 bg-blue-950/40 border-blue-500/40',
      description: 'Agent has zero prior memory. Performs standard cable & reboot diagnostics and records fix.'
    },
    {
      stage: 2 as const,
      label: 'Ticket #2: 4 Weeks Later',
      subtitle: 'Instant Memory Recall',
      icon: Zap,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeColor: 'ring-emerald-500/50 bg-emerald-950/40 border-emerald-500/40',
      description: 'Agent remembers past incident immediately: "You had this last month - restarting fixed it. Want to try that again?"'
    },
    {
      stage: 3 as const,
      label: 'Ticket #3: 2 Weeks Later',
      subtitle: 'Chronic Loop & Proactive Escalation',
      icon: ShieldAlert,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      activeColor: 'ring-amber-500/50 bg-amber-950/40 border-amber-500/40',
      description: 'Agent notices repeated 3rd occurrence, stops reboot band-aid, escalates to Tier-2 Engineering and books a technician.'
    }
  ];

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Stage Steppers */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Demo Script
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Select a stage or click &quot;Run This Ticket&quot; to see Hindsight get smarter
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {stagesMeta.map((s) => {
              const isActive = currentStage === s.stage;
              const isPast = currentStage > s.stage;
              const Icon = s.icon;

              return (
                <button
                  key={s.stage}
                  onClick={() => onSelectStage(s.stage)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all relative overflow-hidden ${
                    isActive
                      ? `${s.activeColor} shadow-md`
                      : isPast
                      ? 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                      : 'border-slate-800/80 bg-slate-950/20 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-white text-slate-950'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : s.stage}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate text-slate-200">{s.label.split(':')[0]}</div>
                      <div className="text-[10px] text-slate-400 truncate hidden md:block">{s.subtitle}</div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Scenario Card */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800/90 p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Context: Customer & Symptom */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {currentTicket.ticketNumber}
              </span>
              <span className="text-xs text-slate-400">• {currentTicket.createdAt}</span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${stagesMeta[currentStage - 1].badgeColor}`}>
                {stagesMeta[currentStage - 1].subtitle}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">Customer Prompt to send:</p>
              <p className="text-sm font-medium text-slate-200 italic bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 mt-1">
                &ldquo;{currentTicket.suggestedPrompt}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1.5 rounded-md">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>
                <strong className="text-emerald-300 font-semibold">Judge&apos;s Focus: </strong>
                {currentTicket.whyJudgesCare}
              </span>
            </div>
          </div>

          {/* Right Action: Run This Ticket Scenario */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-end gap-2">
            <button
              onClick={onRunCurrentTicket}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isLoading ? 'Agent Synthesizing Memory...' : `Run Ticket #${currentStage} Demo`}</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <span>Customer:</span>
              <span className="font-semibold text-slate-200">{customer.name}</span>
              <span className="text-slate-600">|</span>
              <span className="truncate max-w-[130px]">{customer.device.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
