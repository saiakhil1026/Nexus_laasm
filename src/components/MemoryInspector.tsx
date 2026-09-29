import React, { useState } from 'react';
import { Customer, MemoryItem, RecalledMemoryContext } from '../types/support';
import {
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Cpu,
  Split,
  ChevronDown,
  ChevronUp,
  Target,
  Wrench,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Check
} from 'lucide-react';

interface RecallConfidenceMetrics {
  confidencePercent: number;
  level: 'Very High' | 'High' | 'Moderate' | 'Low';
  textColor: string;
  bgColor: string;
  borderColor: string;
  barGradient: string;
  factors: { name: string; score: number; detail: string }[];
}

function calculateRecallConfidence(
  similarityScore: number,
  matchReason?: string,
  mem?: MemoryItem
): RecallConfidenceMetrics {
  const hasHardwareMatch =
    matchReason?.toLowerCase().includes('device') || Boolean(mem?.technicalContext?.device);
  const hasRecurrenceSignal =
    matchReason?.toLowerCase().includes('again') || matchReason?.toLowerCase().includes('same');

  let raw = similarityScore;
  if (hasHardwareMatch) raw += 1;
  if (hasRecurrenceSignal) raw += 1;

  const confidencePercent = Math.min(99, Math.max(55, Math.round(raw)));

  let level: 'Very High' | 'High' | 'Moderate' | 'Low' = 'Low';
  let textColor = 'text-rose-400';
  let bgColor = 'bg-rose-500/10';
  let borderColor = 'border-rose-500/30';
  let barGradient = 'from-rose-500 to-amber-500';

  if (confidencePercent >= 90) {
    level = 'Very High';
    textColor = 'text-emerald-400';
    bgColor = 'bg-emerald-500/10';
    borderColor = 'border-emerald-500/30';
    barGradient = 'from-emerald-500 via-teal-400 to-cyan-400';
  } else if (confidencePercent >= 75) {
    level = 'High';
    textColor = 'text-cyan-400';
    bgColor = 'bg-cyan-500/10';
    borderColor = 'border-cyan-500/30';
    barGradient = 'from-indigo-500 to-cyan-400';
  } else if (confidencePercent >= 60) {
    level = 'Moderate';
    textColor = 'text-amber-400';
    bgColor = 'bg-amber-500/10';
    borderColor = 'border-amber-500/30';
    barGradient = 'from-amber-500 to-yellow-400';
  }

  const factors = [
    {
      name: 'Symptom Match',
      score: similarityScore,
      detail: matchReason || 'Matched past symptom vector',
    },
    {
      name: 'Hardware Match',
      score: hasHardwareMatch ? 99 : 85,
      detail: mem?.technicalContext?.device
        ? `Device: ${mem.technicalContext.device.split(' ')[0]}`
        : 'Hardware profile aligned',
    },
    {
      name: 'Prior Fix Verified',
      score: mem?.outcome === 'resolved' ? 98 : 75,
      detail: mem?.outcome === 'resolved' ? 'Prior fix succeeded' : 'Incident logged',
    },
  ];

  return {
    confidencePercent,
    level,
    textColor,
    bgColor,
    borderColor,
    barGradient,
    factors,
  };
}

interface MemoryInspectorProps {
  customer: Customer;
  recallContext: RecalledMemoryContext | null;
  memoryEnabled: boolean;
  currentStage: 1 | 2 | 3;
  onSelectStage?: (stage: 1 | 2 | 3) => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  customer,
  recallContext,
  memoryEnabled,
  currentStage,
  onSelectStage,
}) => {
  const [activeTab, setActiveTab] = useState<'bigPicture' | 'compare' | 'timeline'>('bigPicture');
  const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMemoryId(expandedMemoryId === id ? null : id);
  };

  const topRecalled = recallContext?.recalledMemories[0];
  const topConfidence = topRecalled
    ? calculateRecallConfidence(topRecalled.similarityScore, topRecalled.matchReason, topRecalled.memory)
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-slate-950/95 border-b border-slate-800 p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Brain className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-2">
                Hindsight Memory Inspector
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  THE BIG PICTURE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Observability window: what the agent remembers &amp; how it gets smarter
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  memoryEnabled ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              <span className={memoryEnabled ? 'text-emerald-400' : 'text-rose-400'}>
                {memoryEnabled ? 'Memory: ACTIVE' : 'Memory: BYPASSED'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {customer.memories.length} historical episodes stored
            </span>
          </div>
        </div>

        {/* ALWAYS-VISIBLE BIG PICTURE ARC (The 3-Ticket Progression) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-300 uppercase tracking-wider text-[10px]">
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              The Big Picture Arc ({customer.name})
            </span>
            <span className="text-slate-400 text-[10px]">
              Click any stage to run
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {/* Step 1 */}
            <button
              onClick={() => onSelectStage?.(1)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                currentStage === 1
                  ? 'bg-blue-500/15 border-blue-500/50 text-blue-200 ring-2 ring-blue-500/40 shadow-md'
                  : currentStage > 1
                  ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-[10px] uppercase mb-0.5">
                {currentStage > 1 ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                    1
                  </span>
                )}
                <span className="truncate">TKT 1: Baseline</span>
              </div>
              <p className="text-[10px] leading-tight text-slate-300 truncate">
                Cold reboot fixed it
              </p>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => onSelectStage?.(2)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                currentStage === 2
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 ring-2 ring-emerald-500/40 shadow-md'
                  : currentStage > 2
                  ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-[10px] uppercase mb-0.5">
                {currentStage > 2 ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                    2
                  </span>
                )}
                <span className="truncate">TKT 2: Recall</span>
              </div>
              <p className="text-[10px] leading-tight text-slate-300 truncate">
                Suggests prior fix (98%)
              </p>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => onSelectStage?.(3)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                currentStage === 3
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 ring-2 ring-amber-500/40 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-[10px] uppercase mb-0.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[8px] font-bold shrink-0">
                  3
                </span>
                <span className="truncate">TKT 3: Escalation</span>
              </div>
              <p className="text-[10px] leading-tight text-slate-300 truncate">
                Halts loop ➔ Field Tech
              </p>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('bigPicture')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'bigPicture'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>What Agent Remembered</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Judge A/B Contrast</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Episodic Vault</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: WHAT AGENT REMEMBERED (BIG PICTURE HERO) */}
        {activeTab === 'bigPicture' && (
          <div className="space-y-4">
            {!memoryEnabled ? (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="text-sm font-bold text-rose-300">Hindsight Memory Engine Bypassed</h3>
                <p className="text-xs text-rose-200/80 leading-relaxed max-w-sm mx-auto">
                  Recall is turned OFF. The agent has no memory of {customer.name}&apos;s previous tickets or fixes, and will force them into a standard, repetitive diagnostic loop.
                </p>
              </div>
            ) : currentStage === 1 && customer.memories.length === 0 ? (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Ticket #1: Clean Baseline (No Prior Memory)</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    This is {customer.name}&apos;s first support ticket. The agent performs standard diagnostic triage, tests the ONT power cycle, and saves the successful fix into Hindsight memory.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 font-mono">
                  <span>Hindsight Store: Initializing episodic graph for {customer.name}</span>
                </div>
              </div>
            ) : (
              <>
                {/* BIG PICTURE HERO CARD: WHAT WAS JUST REMEMBERED */}
                <div
                  className={`p-4 rounded-xl border relative overflow-hidden shadow-lg ${
                    recallContext?.isChronic
                      ? 'bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border-amber-500/40 text-amber-200'
                      : 'bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  {/* Card Header with Confidence Dial */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                            recallContext?.isChronic
                              ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {recallContext?.isChronic
                            ? '🚨 Pattern: 3rd Occurrence Detected'
                            : '💡 Hindsight Memory Retrieved'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        {recallContext?.isChronic
                          ? 'Chronic Loop Triggered: Bypassing Reboot Advice'
                          : 'Agent Retrieved Past Working Fix from Memory'}
                      </h3>
                    </div>

                    {/* Prominent Recall Confidence Badge */}
                    {topConfidence && (
                      <div
                        className={`text-right px-3 py-2 rounded-xl border bg-slate-950/80 shadow-md ${topConfidence.borderColor}`}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Target className={`w-4 h-4 ${topConfidence.textColor}`} />
                          <span className={`text-xl font-extrabold font-mono ${topConfidence.textColor}`}>
                            {topConfidence.confidencePercent}%
                          </span>
                        </div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Recall Confidence
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Main Extracted Facts Highlight */}
                  <div className="space-y-2.5">
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Prior Incident Remembered:</span>
                        <span className="font-mono text-indigo-400 font-bold text-[11px]">
                          {topRecalled?.memory.ticketId} • {topRecalled?.memory.date}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">
                        &ldquo;{topRecalled?.memory.issueReported}&rdquo;
                      </p>

                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Working Resolution Retrieved:</span>
                        </div>
                        <p className="text-xs font-medium text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                          {topRecalled?.memory.successfulFix}
                        </p>
                      </div>
                    </div>

                    {/* Action Taken by Agent */}
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="text-slate-200 block">
                          Autonomous Agent Strategy:
                        </strong>
                        <p className="text-slate-400">
                          {recallContext?.isChronic
                            ? 'Stops repeating temporary power cycle advice. Escalated to Tier-2 Engineering (Ticket #ENG-9042), dispatched on-site optical technician, and issued $25 courtesy credit.'
                            : 'Welcomes customer by name, cites August 14th ticket, and asks if they want to apply the known working 60s ONT power cycle immediately.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cognitive Decision Trace (Step-by-step) */}
                <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Hindsight Cognitive Reasoning Trace
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Policy HIN-802
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    {recallContext?.reasoningSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                        <span className={step.includes('🚨') ? 'text-amber-300 font-semibold' : ''}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recalled Memory Items Expandable */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Indexed Historical Incidents ({customer.memories.length})
                  </span>

                  {customer.memories.map((mem) => {
                    const isExpanded = expandedMemoryId === mem.id;
                    const confidence = calculateRecallConfidence(96, 'Direct customer historical record', mem);

                    return (
                      <div
                        key={mem.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm"
                      >
                        <button
                          onClick={() => toggleExpand(mem.id)}
                          className="w-full p-3 text-left flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                {mem.ticketId}
                              </span>
                              <span className="text-xs font-semibold text-slate-200 truncate">
                                {mem.date}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {mem.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {confidence.confidencePercent}%
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-slate-900/50 text-xs space-y-2">
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold">Reported Issue:</span>
                                <span className="text-slate-200">{mem.issueReported}</span>
                              </div>
                              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-emerald-400 block font-semibold">What Fixed It:</span>
                                <span className="text-emerald-300 font-medium">{mem.successfulFix}</span>
                              </div>
                            </div>
                            {mem.technicalContext?.telemetryNotes && (
                              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300">
                                Telemetry: {mem.technicalContext.telemetryNotes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: JUDGE A/B CONTRAST */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-200 block">The Big Picture Business Value:</strong>
                Why judges and enterprises care: forgetful bots cost millions in customer churn and wasted support hours. Hindsight remembers past fixes and prevents frustrating groundhog-day loops.
              </div>
            </div>

            {/* Side by side comparison cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Without Memory (Generic Bot)
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                    Groundhog Day Loop
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 italic bg-slate-950/80 p-2.5 rounded-lg border border-rose-500/20 leading-relaxed">
                  {recallContext?.genericBotComparisonText}
                </p>
                <div className="text-[11px] text-rose-300/80 flex items-center gap-1.5">
                  <span>❌ Forces customer to re-explain problem &amp; repeats ineffective reboot advice</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> With Hindsight Memory
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Smart &amp; Proactive
                  </span>
                </div>
                <div className="text-xs text-emerald-200/90 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                  {currentStage === 1 && (
                    <p>Standard friendly onboarding, logs hardware specs and working fix into episodic memory.</p>
                  )}
                  {currentStage === 2 && (
                    <p>&ldquo;Welcome back Alex! You had this exact issue last month - restarting fixed it. Want to try that again?&rdquo; (Resolves in 30 seconds)</p>
                  )}
                  {currentStage === 3 && (
                    <p>&ldquo;This is the 3rd time in 6 weeks. Restarting is just a temporary band-aid. Proactively escalating to Tier 2 Engineering and dispatching a field technician tomorrow at 10 AM!&rdquo;</p>
                  )}
                </div>
                <div className="text-[11px] text-emerald-300/80 flex items-center gap-1.5">
                  <span>✅ Instant recall, recognizes chronic loops, takes autonomous proactive action</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EPISODIC VAULT & TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Customer Historical Episodes ({customer.name})
              </span>
              <span className="text-indigo-400 font-mono font-semibold">
                Equipment: {customer.device.split(' ')[0]}
              </span>
            </div>

            <div className="relative border-l-2 border-indigo-500/30 ml-3 pl-4 space-y-5">
              {customer.tickets.map((t) => {
                const isCurrent = t.stage === currentStage;
                const isPast = t.stage < currentStage;

                return (
                  <div key={t.id} className="relative group">
                    <div
                      className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'bg-indigo-500 border-white ring-4 ring-indigo-500/30'
                          : isPast
                          ? 'bg-emerald-500 border-slate-900'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    />

                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-300">
                            {t.ticketNumber}
                          </span>
                          <span className="text-xs text-slate-400">• {t.createdAt}</span>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'open'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 mb-1">{t.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{t.summary}</p>

                      <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300">
                        <span className="text-indigo-400 font-semibold block mb-0.5">
                          Agent Action:
                        </span>
                        {t.expectedAgentBehavior}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
