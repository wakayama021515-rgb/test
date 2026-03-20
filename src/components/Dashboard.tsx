import React from 'react';
import { Parameters, WorldThreat, Era, WorldSituation } from '../types';
import { PARAM_LABELS, PARAM_CLASSES, ERA_CONFIG, SITUATION_COLORS } from '../constants';

interface DashboardProps {
  parameters: Parameters;
  worldThreat: WorldThreat;
  era: Era;
  year: number;
  turn: number;
  worldSituation: WorldSituation;
  eventKeyword: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  parameters,
  worldThreat,
  era,
  year,
  turn,
  worldSituation,
  eventKeyword,
}) => {
  const caps = ERA_CONFIG[era]?.caps ?? {};
  const sc = SITUATION_COLORS[worldSituation] || { bg: '#1a1a2a', color: '#888', border: '#444' };

  const t = worldThreat;
  const tClass = t.total >= 180 ? 'text-red-500' : t.total >= 100 ? 'text-orange-500' : 'text-emerald-500';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[0.68rem] px-2 py-0.5 rounded bg-[#2a1a4a] text-[#c9a84c] border border-[#5a3a8a]">{era}</span>
        <span className="text-[0.65rem] text-gray-500">
          {year}年 T{turn}
          {eventKeyword && <span className="ml-2 px-1.5 py-0.5 rounded bg-[#1a1a3a] text-[#8080c0] border border-[#3a3a6a]">「{eventKeyword}」</span>}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.62rem] text-gray-400">世界概況:</span>
        <span
          className="text-[0.7rem] px-2.5 py-0.5 rounded-full font-bold border"
          style={{ backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}
        >
          {worldSituation}
        </span>
      </div>

      <div className="space-y-1">
        {Object.entries(parameters).map(([k, v]) => {
          const val = v as number;
          const cap = (caps as any)[k] || 1;
          const pct = Math.min(100, Math.round((val / cap) * 100));
          const cls = PARAM_CLASSES[k];
          return (
            <div key={k} className="grid grid-cols-[32px_1fr_40px] gap-1.5 items-center">
              <div className="text-[0.62rem] text-gray-400 text-right">{PARAM_LABELS[k]}</div>
              <div className="h-1.5 bg-[#1a1a3a] rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 bar-${cls}`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <div className="text-[0.62rem] text-[#c9a84c] text-right">{v}</div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-800 my-2 pt-1.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[0.62rem] text-gray-400">世界脅威</span>
          <span className={`text-[0.7rem] font-bold ${tClass}`}>{t.total} / 200</span>
        </div>
        <div className="space-y-1">
          {[
            { label: '政治', val: t.political, cls: 'bg-red-500' },
            { label: '環境', val: t.environmental, cls: 'bg-emerald-500' },
            { label: '超自然', val: t.supernatural, cls: 'bg-purple-500' },
          ].map((item) => {
            const pct = Math.min(100, Math.round((item.val / 200) * 100));
            return (
              <div key={item.label} className="grid grid-cols-[32px_1fr_40px] gap-1.5 items-center">
                <div className="text-[0.62rem] text-gray-400 text-right">{item.label}</div>
                <div className="h-1.5 bg-[#1a1a3a] rounded overflow-hidden">
                  <div
                    className={`h-full rounded transition-all duration-500 ${item.cls}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="text-[0.62rem] text-[#c9a84c] text-right">{item.val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
