import React, { useState, useEffect } from 'react';
import { Customer, ChatMessage, RecalledMemoryContext } from './types/support';
import { DEFAULT_CUSTOMERS, INITIAL_MEMORIES_FOR_STAGE } from './data/defaultCustomers';
import { Header } from './components/Header';
import { DemoScriptBar } from './components/DemoScriptBar';
import { ChatInterface } from './components/ChatInterface';
import { MemoryInspector } from './components/MemoryInspector';
import { recallCustomerMemory, generateScriptedResponse } from './lib/hindsightEngine';
import { Sparkles, CheckCircle2, AlertCircle, PlayCircle, Info } from 'lucide-react';

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-alex-rivera');
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recallContext, setRecallContext] = useState<RecalledMemoryContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(true);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Helper to load appropriate memories for the customer based on stage
  const getCustomerWithStageMemories = (cust: Customer, stage: 1 | 2 | 3): Customer => {
    const stageMemMap = INITIAL_MEMORIES_FOR_STAGE[cust.id];
    let stageMemories: any[] = [];
    if (stageMemMap) {
      if (stage === 1) stageMemories = stageMemMap.stage1 || [];
      else if (stage === 2) stageMemories = stageMemMap.stage2 || [];
      else if (stage === 3) stageMemories = stageMemMap.stage3 || [];
    }

    return {
      ...cust,
      currentTicketStage: stage,
      memories: stageMemories,
    };
  };

  // Unified runner that guarantees the exact customer stage memories are loaded and executed
  const runStage = async (stage: 1 | 2 | 3, custToUse?: Customer) => {
    const baseCust = custToUse || selectedCustomer;
    const updatedCust = getCustomerWithStageMemories(baseCust, stage);

    setCurrentStage(stage);
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCust.id ? updatedCust : c))
    );

    const currentTicket = updatedCust.tickets.find((t) => t.stage === stage) || updatedCust.tickets[0];
    const promptText = currentTicket.suggestedPrompt;

    // Immediately calculate and show the accurate recall context for this stage
    const initialRecall = recallCustomerMemory(updatedCust, promptText, memoryEnabled);
    setRecallContext(initialRecall);

    const sessionMsg: ChatMessage = {
      id: `sys-${Date.now()}-start`,
      sender: 'system',
      text: `Loaded ${currentTicket.ticketNumber}: "${currentTicket.title}" (${currentTicket.createdAt})`,
      timestamp: 'Just now',
    };

    const customerMsg: ChatMessage = {
      id: `msg-cust-${Date.now()}`,
      sender: 'customer',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([sessionMsg, customerMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: updatedCust,
          prompt: promptText,
          stage,
          memoryEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        escalationNotice: data.escalationNotice,
        recalledMemoryIds: initialRecall.recalledMemories.map((m) => m.memory.id),
      };

      setMessages((prev) => [...prev, agentMsg]);
      if (data.recallContext) {
        setRecallContext(data.recallContext);
      }
    } catch (err) {
      console.warn('Network call failed, utilizing client-side Hindsight precision engine:', err);
      const fallback = generateScriptedResponse(updatedCust, stage, promptText);
      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        escalationNotice: fallback.escalationNotice,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch customer persona
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    runStage(1, customer);
  };

  // Toggle memory engine on/off
  const handleToggleMemory = () => {
    setMemoryEnabled((prev) => {
      const next = !prev;
      const currentTicket = selectedCustomer.tickets.find((t) => t.stage === currentStage) || selectedCustomer.tickets[0];
      const updatedRecall = recallCustomerMemory(selectedCustomer, currentTicket.suggestedPrompt, next);
      setRecallContext(updatedRecall);
      return next;
    });
  };

  // Reset entire demo
  const handleResetDemo = () => {
    const resetCustomers = DEFAULT_CUSTOMERS.map((c) => getCustomerWithStageMemories(c, 1));
    setCustomers(resetCustomers);
    setSelectedCustomerId('cust-alex-rivera');
    setMemoryEnabled(true);
    runStage(1, resetCustomers[0]);
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    const currentCustWithMem = getCustomerWithStageMemories(selectedCustomer, currentStage);
    const customerMsg: ChatMessage = {
      id: `msg-cust-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, customerMsg]);
    setIsLoading(true);

    // Compute Hindsight recall context
    const currentRecall = recallCustomerMemory(currentCustWithMem, text, memoryEnabled);
    setRecallContext(currentRecall);

    try {
      // Call backend API /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: currentCustWithMem,
          prompt: text,
          stage: currentStage,
          memoryEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        escalationNotice: data.escalationNotice,
        recalledMemoryIds: currentRecall.recalledMemories.map((m) => m.memory.id),
      };

      setMessages((prev) => [...prev, agentMsg]);
      if (data.recallContext) {
        setRecallContext(data.recallContext);
      }
    } catch (err) {
      console.warn('Network call failed, utilizing client-side Hindsight precision engine:', err);
      // Fallback to local Hindsight scripted precision response
      const fallback = generateScriptedResponse(currentCustWithMem, currentStage, text);
      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        escalationNotice: fallback.escalationNotice,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Run current ticket scenario
  const handleRunCurrentTicket = () => {
    runStage(currentStage);
  };

  // Initialize on mount
  useEffect(() => {
    const cust = getCustomerWithStageMemories(DEFAULT_CUSTOMERS[0], 1);
    const initialRecall = recallCustomerMemory(cust, cust.tickets[0].suggestedPrompt, true);
    setRecallContext(initialRecall);
    setMessages([
      {
        id: 'sys-init',
        sender: 'system',
        text: `Demo initialized. Alex Rivera has contacted support for Ticket #1 (First occurrence).`,
        timestamp: 'Just now',
      },
    ]);
  }, []);

  const currentTicket = selectedCustomer.tickets.find((t) => t.stage === currentStage) || selectedCustomer.tickets[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={handleSelectCustomer}
        memoryEnabled={memoryEnabled}
        onToggleMemory={handleToggleMemory}
        onResetDemo={handleResetDemo}
      />

      {/* Demo Script Stepper Bar */}
      <DemoScriptBar
        customer={selectedCustomer}
        currentStage={currentStage}
        onSelectStage={runStage}
        onRunCurrentTicket={handleRunCurrentTicket}
        isLoading={isLoading}
      />

      {/* Optional Judge Demo Guide Banner */}
      {showDemoGuide && (
        <div className="bg-indigo-950/60 border-b border-indigo-500/20 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong className="text-white font-semibold">Judge Walkthrough: </strong>
                Follow the 3-step arc: <strong>Ticket 1</strong> (Triage) ➔ <strong>Ticket 2</strong> (Instant recall of past fix) ➔ <strong>Ticket 3</strong> (Chronic loop detected &amp; auto-escalated). Toggle &quot;Hindsight ACTIVE&quot; anytime to contrast with a forgetful bot!
              </span>
            </div>
            <button
              onClick={() => setShowDemoGuide(false)}
              className="text-[11px] text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-900/60 hover:bg-indigo-800 shrink-0 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-0">
        {/* Left Column: Customer Support Chat Interface (7 Cols) */}
        <section className="lg:col-span-7 h-[700px] lg:h-[calc(100vh-230px)] min-h-[560px] flex flex-col">
          <ChatInterface
            customer={selectedCustomer}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentStage={currentStage}
            suggestedPrompt={currentTicket.suggestedPrompt}
          />
        </section>

        {/* Right Column: Hindsight Memory Inspector (5 Cols) */}
        <section className="lg:col-span-5 h-[700px] lg:h-[calc(100vh-230px)] min-h-[560px] flex flex-col">
          <MemoryInspector
            customer={selectedCustomer}
            recallContext={recallContext}
            memoryEnabled={memoryEnabled}
            currentStage={currentStage}
            onSelectStage={runStage}
          />
        </section>
      </main>
    </div>
  );
}
