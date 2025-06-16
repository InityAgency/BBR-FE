import React from "react";

interface LeadsStatsCardsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    won: number;
    lost: number;
    inactive: number;
    conversationRate: number;
  };
}

const statCards = [
  // { key: "total", label: "Total Leads", color: "bg-primary/10 text-primary" }, 
  { key: "new", label: "New", color: "bg-muted/50 border" },
  // { key: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700" },
  // { key: "qualified", label: "Qualified", color: "bg-purple-100 text-purple-700" },
  { key: "won", label: "Won", color: "bg-muted/50 border" },
  { key: "lost", label: "Lost", color: "bg-muted/50 border" },
  // { key: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-700" },
];

export function LeadsStatsCards({ stats }: LeadsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8 w-full lg:flex lg:flex-row">
      {statCards.map((card) => (
        <div
          key={card.key}
          className={`rounded-xl p-4 flex flex-col items-center shadow-sm lg:w-full ${card.color}`}
        >
          <div className="text-2xl font-bold">{stats[card.key as keyof typeof stats]}</div>
          <div className="text-xs font-medium mt-1 uppercase tracking-wide">{card.label}</div>
        </div>
      ))}
      {/* Conversation Rate kartica */}
      <div className="rounded-xl p-4 flex flex-col items-center shadow-sm bg-primary/10 text-primary lg:w-full">
        <div className="text-2xl font-bold">{stats.conversationRate}%</div>
        <div className="text-xs font-medium mt-1 uppercase tracking-wide">Conversation Rate</div>
      </div>
    </div>
  );
} 