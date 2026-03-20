import React from 'react';
import { Nation } from '../types';

interface NationListProps {
  nations: Nation[];
}

const NationList: React.FC<NationListProps> = ({ nations }) => {
  if (!nations.length) {
    return <span className="text-gray-600 text-[0.75rem]">未生成</span>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {nations.map((n) => {
        const relEntries = Object.entries(n.relations || {})
          .slice(0, 3)
          .map(([rid, v]) => `${rid.slice(0, 2)}:${(v as number) >= 0 ? '+' : ''}${v}`)
          .join(' ');

        return (
          <div key={n.id} className="bg-[#131325] border border-[#2a2a4a] rounded p-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: n.color }}></div>
              <div className="text-[0.78rem] font-bold text-gray-200">{n.name}</div>
              <div className="text-[0.62rem] text-gray-500 ml-auto">{n.status || '安定'}</div>
            </div>
            <div className="flex gap-2 text-[0.62rem]">
              <div className="text-gray-500">軍:<span className="text-[#c9a84c]">{n.military}</span></div>
              <div className="text-gray-500">経:<span className="text-[#c9a84c]">{n.economy}</span></div>
              <div className="text-gray-500">安:<span className="text-[#c9a84c]">{n.stability}</span></div>
            </div>
            {relEntries && <div className="text-[0.6rem] text-gray-600 mt-1">{relEntries}</div>}
            {n.keyFigures && (
              <div className="mt-1 text-[0.62rem] text-gray-500 leading-tight">
                <span className="text-[#c9a84c]">👑{n.keyFigures.leader.name}({n.keyFigures.leader.role})</span>
                {n.keyFigures.figures.slice(0, 1).map(f => (
                  <span key={f.name} className="text-gray-500"> {f.name}({f.role})</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NationList;
