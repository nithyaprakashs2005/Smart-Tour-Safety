"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, Eye, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/help-data";

const categories = ["All", "Getting Started", "Geofences", "Alerts", "Devices", "Incidents", "Administration", "Technical", "Developers"];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Knowledge Base</h3>
          <p className="text-xs text-slate-500">Guides, documentation, and how-tos</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          {articles.length} articles
        </Badge>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((article) => (
          <button
            key={article.id}
            className="flex w-full items-start gap-4 rounded-lg border border-slate-50 p-4 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{article.title}</p>
              <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{article.excerpt}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views.toLocaleString()} views
                </span>
                <span>Updated {article.lastUpdated}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-900">No articles found</p>
          <p className="text-xs text-slate-500">Try a different search term or category</p>
        </div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";