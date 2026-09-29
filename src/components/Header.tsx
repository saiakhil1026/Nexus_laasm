import React from 'react';
import { Customer } from '../types/support';
import { Brain, Cpu, RefreshCw, Sparkles, Shield, ToggleLeft, ToggleRight, User } from 'lucide-react';

interface HeaderProps {
  customers: Customer[];
  selectedCustomer: Customer;
  onSelectCustomer: (customer: Customer) => void;
  memoryEnabled: boolean;
  onToggleMemory: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  memoryEnabled,
  onToggleMemory,
  onResetDemo,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/30">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Hindsight Support
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Episodic Memory AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI agent that remembers past customer issues, attempted fixes &amp; escalates recurring loops
            </p>
          </div>
        </div>

        {/* Customer Persona Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg p-1.5 shadow-inner">
            <User className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <span className="text-xs font-medium text-slate-400 hidden md:inline">Customer:</span>
            <div className="flex gap-1">
              {customers.map((c) => {
                const isSelected = c.id === selectedCustomer.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCustomer(c)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate max-w-[90px]">{c.name.split(' ')[0]}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory Engine Switch (A/B Test for Judges) */}
          <button
            onClick={onToggleMemory}
            title={memoryEnabled ? 'Click to disable memory and simulate a generic dumb bot' : 'Click to enable Hindsight memory'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              memoryEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
          >
            {memoryEnabled ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Hindsight:</span>
                <span className="text-emerald-300 font-bold">ACTIVE</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Hindsight:</span>
                <span className="text-rose-300 font-bold">BYPASS (No Memory)</span>
              </>
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all"
            title="Reset customer memories and ticket stage back to Ticket #1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
