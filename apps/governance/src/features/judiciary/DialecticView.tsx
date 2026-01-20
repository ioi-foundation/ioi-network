import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Scale } from 'lucide-react';

interface Argument {
  step: number;
  role: 'Prosecutor' | 'Defender' | 'Judge';
  claim: string;
  citations: { id: string; type: 'receipt' | 'policy' | 'oracle' }[];
  confidence: number; // 0.0 to 1.0
  technical_context?: string;
}

// Data mirroring Whitepaper §10.1.1
const MOCK_DEBATE: Argument[] = [
  {
    step: 1,
    role: 'Prosecutor',
    claim: "Agent violated Hard Constraint: receipt.latency (850ms) > ICS.deadline (500ms).",
    citations: [
      { id: "rcpt_0x8a...99", type: "receipt" },
      { id: "ics_template_v1", type: "policy" }
    ],
    confidence: 0.99,
    technical_context: "Integer math verification of timestamp delta."
  },
  {
    step: 2,
    role: 'Defender',
    claim: "Latency spike attributed to Network Oracle divergence. Provider executed within bounds relative to local clock.",
    citations: [
      { id: "oracle_chk_0x4...a2", type: "oracle" }
    ],
    confidence: 0.65,
    technical_context: "Requesting 'Force Majeure' exception per Protocol Rule 12.B."
  },
  {
    step: 3,
    role: 'Judge',
    claim: "Oracle divergence claim rejected. Local clock drift exceeds protocol tolerance (200ms). Slash verified.",
    citations: [],
    confidence: 0.94,
    technical_context: "Finalizing VerdictHash: 0x9f...22"
  }
];

export const DialecticView = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(3);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Dialectic Verification Protocol (DVP)</h3>
        </div>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
          Tier 4 (Arbitration)
        </span>
      </div>

      {/* Debate Flow */}
      <div className="p-4 space-y-4">
        {MOCK_DEBATE.map((arg) => (
          <div 
            key={arg.step}
            className={`border rounded-lg transition-all duration-300 ${
              arg.role === 'Judge' 
                ? 'bg-zinc-900 border-zinc-700 shadow-lg' 
                : 'bg-zinc-950/50 border-zinc-800'
            }`}
          >
            <button
              onClick={() => setExpandedStep(expandedStep === arg.step ? null : arg.step)}
              className="w-full flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  arg.role === 'Prosecutor' ? 'bg-rose-500' :
                  arg.role === 'Defender' ? 'bg-emerald-500' : 'bg-cyan-500'
                }`} />
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  arg.role === 'Prosecutor' ? 'text-rose-400' :
                  arg.role === 'Defender' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {arg.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500">
                  Confidence: {(arg.confidence * 100).toFixed(0)}%
                </span>
                {expandedStep === arg.step ? 
                  <ChevronUp className="w-3 h-3 text-zinc-600" /> : 
                  <ChevronDown className="w-3 h-3 text-zinc-600" />
                }
              </div>
            </button>

            {/* Expanded Content */}
            {expandedStep === arg.step && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-800 pl-3">
                  {arg.claim}
                </p>
                
                {arg.technical_context && (
                  <p className="mt-2 text-[11px] text-zinc-500 font-mono">
                    // {arg.technical_context}
                  </p>
                )}

                {arg.citations.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {arg.citations.map((cite) => (
                      <span 
                        key={cite.id} 
                        className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-help hover:text-white transition-colors"
                        title={cite.type}
                      >
                        <FileText className="w-2.5 h-2.5" />
                        {cite.id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};