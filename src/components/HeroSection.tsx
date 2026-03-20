import React from 'react';
import { Hero, PersonalQuest, Relic } from '../types';

interface HeroSectionProps {
  hero: Hero | null;
  heroChronicles: Hero[];
  personalQuest: PersonalQuest;
  playerReputation: number;
  playerFear: number;
  legacyPoints: number;
  discoveredHints: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  heroChronicles,
  personalQuest,
  playerReputation,
  playerFear,
  legacyPoints,
  discoveredHints,
}) => {
  if (!hero && !heroChronicles.length && !personalQuest.name) return null;

  const repClass = playerReputation >= 20 ? 'bg-[#0a2a1a] text-[#50e0a0] border-[#1a5a3a]' :
                   playerReputation <= -20 ? 'bg-[#2a0a0a] text-[#e05050] border-[#5a1a1a]' :
                   'bg-[#1a1a1a] text-gray-500 border-[#333]';

  return (
    <div className="flex flex-col gap-2">
      {hero && (
        <div className="mb-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[#f0c040]">⚡</span>
            <span className="text-[0.85rem] text-[#f0c040] font-bold">{hero.name}</span>
            <span className="text-[0.63rem] text-gray-500 ml-auto">{hero.archetype} / {hero.domain} 残{hero.maxTurns - hero.turnsActive}T</span>
          </div>
          <div className="text-[0.72rem] text-[#c0c060] leading-relaxed mb-1">「{hero.currentActivity}」</div>
          {hero.biographyHint && <div className="text-[0.63rem] text-gray-500 italic">謎: {hero.biographyHint}</div>}
          {hero.deeds.slice(-2).map((d, i) => (
            <div key={i} className="text-[0.63rem] text-gray-500">★ {d}</div>
          ))}
        </div>
      )}

      {heroChronicles.length > 0 && (
        <div className="text-[0.63rem] text-gray-600 border-t border-gray-800 pt-1 mt-1">
          📜 {heroChronicles[heroChronicles.length - 1].name}（{heroChronicles[heroChronicles.length - 1].archetype}）— {heroChronicles[heroChronicles.length - 1].deeds.slice(-1)[0] || '伝説として残る'}
        </div>
      )}

      {personalQuest.name && (
        <div className="mt-2 pt-1.5 border-t border-gray-800">
          <div className="text-[0.65rem] text-[#c9a84c] mb-1 uppercase tracking-wider">個人クエスト</div>
          <div className="text-[0.75rem] text-gray-200 font-bold mb-0.5">{personalQuest.name}</div>
          <div className="text-[0.65rem] text-gray-400 leading-tight mb-1">{personalQuest.description}</div>
          <div className="h-1 bg-[#1a1a3a] rounded overflow-hidden mb-1">
            <div
              className={`h-full rounded transition-all duration-500 ${personalQuest.urgency === 'high' ? 'bg-gradient-to-r from-[#8a3a1a] to-[#e06030]' : 'bg-gradient-to-r from-[#4a8a4a] to-[#8aaa4a]'}`}
              style={{ width: `${personalQuest.progress}%` }}
            ></div>
          </div>
          <div className={`text-[0.62rem] ${personalQuest.status === 'completed' ? 'text-[#f0c040]' : personalQuest.status === 'failed' ? 'text-red-500' : 'text-emerald-400'}`}>
            {personalQuest.progress}% — {personalQuest.status}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-1.5 text-[0.62rem] flex-wrap">
        <span className={`px-1.5 py-0.5 rounded font-bold border ${repClass}`}>
          評判{playerReputation >= 0 ? '+' : ''}{playerReputation}
        </span>
        <span className="px-1.5 py-0.5 rounded font-bold border bg-[#2a1a00] text-[#e08040] border-[#5a3a00]">
          恐怖{playerFear}
        </span>
        <span className="px-1.5 py-0.5 rounded font-bold border bg-[#2a2200] text-[#c9a84c] border-[#5a4a10]">
          Lp{legacyPoints}
        </span>
      </div>

      {discoveredHints.length > 0 && (
        <div className="text-[0.65rem] text-[#6060a0] italic px-1.5 py-1 border-l-2 border-[#3a3a7a] mt-1 leading-tight">
          🔮 {discoveredHints[discoveredHints.length - 1]}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
