import React, { useState } from 'react';
import { Character } from '../types';
import { PARAM_TYPES, STAT_KEYS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface CharacterListProps {
  characters: Character[];
  leaderTurnsRemaining: number;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, leaderTurnsRemaining }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!characters.length) {
    return <span className="text-gray-600 text-[0.75rem]">未生成</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {characters.map((c) => {
        const type = PARAM_TYPES[c.typeIdx];
        const name = c.narrative?.name ?? '生成中...';
        const flavor = c.narrative?.flavorText ?? '';
        const isExpanded = expandedId === c.id;

        const top3 = STAT_KEYS.map((k) => ({ k, v: c.stats[k] }))
          .sort((a, b) => b.v - a.v)
          .slice(0, 3);

        const turnsLeft = c.isPlayer ? leaderTurnsRemaining : Math.max(0, c.baseTurns - (0)); // Simplified for now

        return (
          <div
            key={c.id}
            onClick={() => setExpandedId(isExpanded ? null : c.id)}
            className={`bg-[#131325] border rounded p-2 cursor-pointer transition-colors ${
              c.isPlayer ? 'border-[#5a3a2a] hover:border-[#8a5a3a]' : 'border-[#2a2a4a] hover:border-[#4a4a8a]'
            } ${!c.isAlive ? 'opacity-45 border-dashed' : ''}`}
          >
            <div className="flex items-baseline justify-between gap-1.5 mb-1">
              <div className="text-[0.88rem] font-bold text-gray-200">
                {c.isPlayer && <span className="text-[#c9a84c] text-[0.7rem] mr-1">★</span>}
                {name}
              </div>
              <span
                className={`text-[0.62rem] px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0 border ${
                  type.stars === 5 ? 'bg-[#3a1a5a] text-[#d090ff] border-[#8040c0]' :
                  type.stars === 4 ? 'bg-[#1a2a5a] text-[#90b0ff] border-[#4060b0]' :
                  'bg-[#1a3a2a] text-[#90d0a0] border-[#306040]'
                }`}
              >
                {type.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-1">
              {Object.entries(c.attrs).map(([cat, val]) => (
                <span key={cat} className="text-[0.6rem] px-1.5 py-0.5 rounded-full border border-gray-800 text-gray-400 bg-[#1a1a3a]">
                  {val}
                </span>
              ))}
            </div>

            <div className="flex gap-1.5 flex-wrap mb-1">
              {top3.map((s) => (
                <span key={s.k} className="text-[0.62rem] text-gray-400">
                  {s.k}:<span className="text-[#c9a84c] font-bold">{s.v}</span>
                </span>
              ))}
              <span className="text-[0.62rem] text-gray-400">
                年齢:<span className="text-[#d0a070] font-bold">{c.attrs.age}</span>
              </span>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-[26px_1fr_20px] gap-x-1 gap-y-0.5 my-1.5 items-center">
                    {STAT_KEYS.map((k) => (
                      <React.Fragment key={k}>
                        <div className="text-[0.6rem] text-gray-500 text-right">{k}</div>
                        <div className="h-1 bg-[#1a1a3a] rounded overflow-hidden">
                          <div
                            className={`h-full rounded bar-${k}`}
                            style={{ width: `${Math.round((c.stats[k] / 99) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-[0.6rem] text-[#c9a84c] text-right">{c.stats[k]}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`text-[0.7rem] text-gray-400 leading-relaxed ${isExpanded ? '' : 'truncate'}`}>
              {flavor}
            </div>
            <div className="text-[0.62rem] text-[#c9a84c] mt-1">
              {c.isPlayer ? '★ 現指導者　' : ''}残{turnsLeft}T
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterList;
