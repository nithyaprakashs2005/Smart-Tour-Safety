"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { faqs } from "@/lib/help-data";

export default function FAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>("FAQ-002");
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const vote = (id: string, type: "up" | "down") => {
    setVotes((prev) => ({ ...prev, [id]: prev[id] === type ? null : type }));
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          const userVote = votes[faq.id];
          return (
            <div
              key={faq.id}
              className={cn(
                "rounded-lg border transition-colors",
                isExpanded ? "border-blue-200 bg-blue-50/30" : "border-slate-100 hover:border-slate-200"
              )}
            >
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => toggle(faq.id)}
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-blue-100 px-4 pb-4 pt-2">
                  <p className="text-sm leading-relaxed text-slate-700">{faq.answer}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-xs text-slate-500">Was this helpful?</span>
                    <button
                      onClick={() => vote(faq.id, "up")}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                        userVote === "up"
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {faq.helpful + (userVote === "up" ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => vote(faq.id, "down")}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                        userVote === "down"
                          ? "bg-red-50 text-red-700"
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <ThumbsDown className="h-3 w-3" />
                      {faq.notHelpful + (userVote === "down" ? 1 : 0)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";