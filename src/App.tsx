import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameState,
  Message,
  Character,
  Nation,
  Village,
  Parameters,
  WorldThreat,
  Era,
  WorldSituation,
  PersonalQuest,
  Hero,
  Relic,
} from './types';
import {
  SITUATION_GRAPH,
  PARAM_TYPES,
  STAT_KEYS,
  PARAM_LABELS,
  ERA_CONFIG,
  DEMON_TYPES,
  ATTR_POOL,
  EVENT_KEYWORDS,
  DEMON_CLASS,
  DEMON_SCALE,
  DEMON_ORIGIN,
  DEMON_DOMAIN,
  HERO_ARCHETYPES,
  HERO_ORIGINS,
  HERO_DOMAINS,
  NATION_ARCHETYPES,
  AGE_TURNS,
} from './constants';
import { callGemini, extractObj, extractArr } from './services/geminiService';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import CharacterList from './components/CharacterList';
import NationList from './components/NationList';
import Log from './components/Log';
import HeroSection from './components/HeroSection';
import { Shield, Sword, Users, Zap, ScrollText, Map as MapIcon, Settings } from 'lucide-react';

const INITIAL_STATE: GameState = {
  turn: 0,
  year: -500,
  era: '黎明期',
  generation: 1,
  villageName: '',
  worldSituation: '平穏',
  situationTurnsIn: 0,
  parameters: { military: 30, economy: 30, loyalty: 60, technology: 10, population: 1000, food: 500, fiscalHealth: 70 },
  worldThreat: { political: 0, environmental: 0, supernatural: 0, total: 0 },
  demonLord: null,
  leaderEntityId: null,
  leaderTurnsRemaining: 5,
  activeEvents: [],
  nationEntities: {},
  hero: null,
  personalQuest: { name: null, description: null, status: 'pending', urgency: 'low', progress: 0, turnLimit: null, failImpact: null, startTurn: 0 },
  legacyPoints: 0,
  playerReputation: 0,
  playerFear: 0,
  hiddenLore: { discoveredHints: [], unrevealedMysteries: [], ancientProphecies: [] },
  relics: [],
  eventKeyword: null,
  civilizationProgress: 0,
  civilizationState: '黎明',
  governingIdeology: null,
  fateDie: 10,
  civilPressures: { growth: 0, decay: 0, chaos: 0, innovation: 0 },
  consecutiveGrowth: 0,
  consecutiveDecline: 0,
};

export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worldData, setWorldData] = useState<{ nations: Nation[]; villages: Village[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerInput, setPlayerInput] = useState('');
  const [mapTooltip, setMapTooltip] = useState('—');
  const [isStarted, setIsStarted] = useState(false);
  const [narrativeHistory, setNarrativeHistory] = useState<any[]>([]);

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const addMessage = useCallback((type: Message['type'], text: string, extra?: any) => {
    setMessages(prev => [...prev, { type, text, ...extra }]);
  }, []);

  const buildCharacterSkeletons = (count: number, villageId: string | undefined) => {
    const newChars: Character[] = [];
    for (let i = 0; i < count; i++) {
      const typeIdx = Math.floor(Math.random() * PARAM_TYPES.length);
      const stats: Record<string, number> = {};
      STAT_KEYS.forEach((k, idx) => {
        const [lo, hi] = PARAM_TYPES[typeIdx].ranges[idx];
        stats[k] = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      });

      const attrs = {
        element: ATTR_POOL.element[Math.floor(Math.random() * ATTR_POOL.element.length)],
        origin: ATTR_POOL.origin[Math.floor(Math.random() * ATTR_POOL.origin.length)],
        personality: ATTR_POOL.personality[Math.floor(Math.random() * ATTR_POOL.personality.length)],
        age: ATTR_POOL.age[Math.floor(Math.random() * ATTR_POOL.age.length)],
        job: ATTR_POOL.job[Math.floor(Math.random() * ATTR_POOL.job.length)],
        trait: ATTR_POOL.trait[Math.floor(Math.random() * ATTR_POOL.trait.length)],
      };

      const baseTurns = (AGE_TURNS[attrs.age] ?? 5) + Math.floor(Math.random() * 3) - 1;

      newChars.push({
        id: Date.now() + i,
        typeIdx,
        stats,
        attrs,
        narrative: null,
        isPlayer: false,
        isAlive: true,
        statusTag: 'active',
        birthTurn: stateRef.current.turn,
        birthYear: stateRef.current.year,
        baseTurns,
      });
    }
    return newChars;
  };

  const generateCharacterNarratives = async (skeletons: Character[], worldName: string) => {
    const payload = skeletons.map(c => ({
      tempId: c.id,
      role: c.isPlayer ? '村長（プレイヤーキャラ）' : '村人',
      type: PARAM_TYPES[c.typeIdx].label,
      typeDesc: PARAM_TYPES[c.typeIdx].desc,
      stats: STAT_KEYS.map(k => `${k}:${c.stats[k]}`).join(' '),
      attrs: Object.entries(c.attrs).map(([k, v]) => `${k}:${v}`).join(' / '),
    }));

    const prompt = `世界「${worldName}」の村人の名前とフレーバーテキストをJSONで生成。コードブロック不要。
${JSON.stringify(payload)}
形式: [{"tempId":数値,"name":"名前","flavorText":"2文程度の紹介"}]`;

    try {
      const raw = await callGemini(prompt, 'JSONジェネレーターです。指示通りのJSONのみ出力してください。', []);
      const results = extractArr(raw);
      if (results) {
        setCharacters(prev => prev.map(c => {
          const r = results.find((res: any) => res.tempId === c.id);
          return r ? { ...c, narrative: { name: r.name, flavorText: r.flavorText } } : c;
        }));
      }
    } catch (err) {
      console.error("Narrative generation failed", err);
    }
  };

  const startGame = async () => {
    setIsLoading(true);
    setMessages([]);
    setCharacters([]);
    setState(INITIAL_STATE);
    setNarrativeHistory([]);

    try {
      addMessage('system', '世界を生成中...');
      const worldPrompt = `ファンタジー世界を生成してください。JSONのみ返してください。コードブロック不要。
{"worldName":"世界名","era":"時代背景一言","nations":[{"id":"n1","name":"国名","color":"#hex","description":"30字以内","x":0.2,"y":0.3}],"villages":[{"id":"v1","name":"村名","nationId":"n1","x":0.22,"y":0.28,"isPlayer":false,"description":"説明"},{"id":"v2","name":"村名","nationId":"n1","x":0.18,"y":0.35,"isPlayer":true,"description":"主人公の村"}],"playerVillage":"v2"}
条件: 国4〜5個(各異なる色)、各国に村2〜3個、isPlayer:trueは全体で1つ、x/yは0.05〜0.95で散らばらせる`;

      const rawWorld = await callGemini(worldPrompt, 'JSONジェネレーターです。JSONのみ出力してください。', []);
      const world = extractObj(rawWorld);
      if (!world) throw new Error("World generation failed");

      setWorldData(world);
      const pv = world.villages.find((v: any) => v.isPlayer);
      
      const skeletons = buildCharacterSkeletons(5, pv?.id);
      skeletons[0].isPlayer = true;
      setCharacters(skeletons);

      const newState = {
        ...INITIAL_STATE,
        villageName: pv?.name ?? '',
        leaderEntityId: skeletons[0].id,
        leaderTurnsRemaining: skeletons[0].baseTurns,
      };
      setState(newState);

      await generateCharacterNarratives(skeletons, world.worldName);
      
      addMessage('system', `世界「${world.worldName}」生成完了`);
      setIsStarted(true);

      // Initial Scene
      const startMsg = `ゲーム開始。${world.worldName}の${pv?.name ?? '村'}の村長として物語が始まる。世界概況「平穏」のもと、最初の情景を3〜5文で描写してください。`;
      const scene = await callGemini(startMsg, "あなたはTRPGのゲームマスターです。", []);
      addMessage('ai', scene, { turn: 1 });
      setNarrativeHistory([{ role: 'user', parts: [{ text: startMsg }] }, { role: 'model', parts: [{ text: scene }] }]);
      setState(s => ({ ...s, turn: 1 }));

    } catch (err: any) {
      addMessage('system', `エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const applyEcsOps = (ops: any[], rollResult: any) => {
    setState(prev => {
      let next = { ...prev };
      for (const op of ops) {
        switch (op.t) {
          case 'param':
            if (op.op === 'Δ') {
              const caps = ERA_CONFIG[next.era].caps;
              const nextParams = { ...next.parameters };
              Object.entries(op).forEach(([k, v]) => {
                if (k in nextParams && typeof v === 'number') {
                  const cap = caps[k as keyof Parameters] ?? 9999;
                  const delta = v > 0 ? Math.min(v, rollResult.posCap) : Math.max(v, -rollResult.negCap);
                  nextParams[k as keyof Parameters] = Math.max(0, Math.min(cap, nextParams[k as keyof Parameters] + delta));
                }
              });
              next.parameters = nextParams;
            }
            break;
          case 'threat':
            if (op.op === 'Δ') {
              const nextThreat = { ...next.worldThreat };
              nextThreat.political = Math.max(0, nextThreat.political + (op.political || 0));
              nextThreat.environmental = Math.max(0, nextThreat.environmental + (op.environmental || 0));
              nextThreat.supernatural = Math.max(0, nextThreat.supernatural + (op.supernatural || 0));
              nextThreat.total = nextThreat.political + nextThreat.environmental + nextThreat.supernatural;
              next.worldThreat = nextThreat;
            }
            break;
          case 'situation':
            if (op.op === '=') {
              const valid = SITUATION_GRAPH[next.worldSituation] || ['平穏'];
              if (valid.includes(op.value)) {
                if (next.worldSituation !== op.value) {
                  addMessage('system', `🌍 世界概況: ${next.worldSituation} → ${op.value}`);
                  next.worldSituation = op.value;
                  next.situationTurnsIn = 0;
                }
              }
            }
            break;
          case 'meta':
            if (typeof op.yearDelta === 'number') {
              next.year += op.yearDelta;
            }
            break;
        }
      }
      return next;
    });
  };

  const submitAction = async () => {
    if (!playerInput.trim() || isLoading) return;
    const action = playerInput.trim();
    setPlayerInput('');
    setIsLoading(true);
    addMessage('player', action);

    try {
      const leader = characters.find(c => c.id === state.leaderEntityId);
      const ds = 18 + Math.floor(state.worldThreat.total / 20);
      const d20 = Math.floor(Math.random() * 20) + 1;
      const bonus = Math.floor(((leader?.stats.INT || 30) + (leader?.stats.CHA || 30)) / 40);
      const total = d20 + bonus;

      let resultLabel = '失敗';
      let posCap = 1, negCap = 18;
      if (total >= ds + 12) { resultLabel = '完全成功'; posCap = 15; negCap = 5; }
      else if (total >= ds) { resultLabel = '成功'; posCap = 10; negCap = 8; }
      else if (total >= ds - 8) { resultLabel = '部分成功'; posCap = 4; negCap = 12; }

      addMessage('system', `🎲 d20:${d20} + 補正:${bonus} = ${total} vs DS:${ds} → 【${resultLabel}】`);

      const sysInst = `あなたはTRPGのゲームマスターです。
世界:${worldData?.worldName} 時代:${state.era} 年:${state.year} ターン:${state.turn}
概況:${state.worldSituation} 指導者:${leader?.narrative?.name}
パラメータ: ${JSON.stringify(state.parameters)}
脅威: ${JSON.stringify(state.worldThreat)}

【判定】${resultLabel} (正上限+${posCap} 負上限-${negCap})
この行動の結果を3〜5文で描写し、その後にECS操作JSON配列を出力してください。
JSON形式: [{"t":"param|threat|situation|meta","eId":"world","op":"Δ|=","field":value}]`;

      const prompt = `プレイヤーの行動:「${action}」`;
      const response = await callGemini(prompt, sysInst, narrativeHistory);
      
      const narrative = response.split('[')[0].trim();
      const ops = extractArr(response) || [];

      addMessage('ai', narrative, { turn: state.turn });
      applyEcsOps(ops, { posCap, negCap });

      setNarrativeHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: `T${state.turn}: ${action}` }] },
        { role: 'model', parts: [{ text: narrative.slice(0, 200) }] }
      ]);

      setState(s => ({
        ...s,
        turn: s.turn + 1,
        leaderTurnsRemaining: s.leaderTurnsRemaining - 1,
        situationTurnsIn: s.situationTurnsIn + 1,
      }));

    } catch (err: any) {
      addMessage('system', `エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a2e] text-[#e0e0e0] font-serif p-3 gap-2.5 overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 flex-shrink-0">
        <h1 className="text-[#c9a84c] text-lg font-bold tracking-[2px] whitespace-nowrap">⚔ 年代記 ⚔</h1>
        {!isStarted && (
          <button
            onClick={startGame}
            disabled={isLoading}
            className="bg-[#4a4a8a] hover:bg-[#5a5a9a] text-white px-4 py-1.5 rounded text-sm cursor-pointer disabled:bg-gray-700 disabled:text-gray-500 transition-colors"
          >
            {isLoading ? '生成中...' : '物語を開始する'}
          </button>
        )}
      </header>

      <main className="flex flex-1 gap-2.5 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[290px] min-w-[290px] flex flex-col gap-2 overflow-y-auto pr-1">
          <section className="bg-[#0f0f23] border border-gray-800 rounded-lg p-2.5 flex-shrink-0">
            <h2 className="text-[0.7rem] text-[#c9a84c] tracking-wider mb-2 uppercase">世界地図</h2>
            <Map worldData={worldData} onHover={setMapTooltip} />
            <div className="text-[0.72rem] text-gray-500 mt-1.5 min-h-[1em]">{mapTooltip}</div>
          </section>

          <section className="bg-[#0f0f23] border border-gray-800 rounded-lg p-2.5 flex-shrink-0">
            <h2 className="text-[0.7rem] text-[#c9a84c] tracking-wider mb-2 uppercase">村のダッシュボード</h2>
            <Dashboard
              parameters={state.parameters}
              worldThreat={state.worldThreat}
              era={state.era}
              year={state.year}
              turn={state.turn}
              worldSituation={state.worldSituation}
              eventKeyword={state.eventKeyword}
            />
          </section>

          <section className="bg-[#0f0f23] border border-gray-800 rounded-lg p-2.5 flex-shrink-0">
            <h2 className="text-[0.7rem] text-[#c9a84c] tracking-wider mb-2 uppercase">勇者と運命</h2>
            <HeroSection
              hero={state.hero}
              heroChronicles={[]}
              personalQuest={state.personalQuest}
              playerReputation={state.playerReputation}
              playerFear={state.playerFear}
              legacyPoints={state.legacyPoints}
              discoveredHints={state.hiddenLore.discoveredHints}
            />
          </section>

          <section className="bg-[#0f0f23] border border-gray-800 rounded-lg p-2.5 flex-shrink-0">
            <h2 className="text-[0.7rem] text-[#c9a84c] tracking-wider mb-2 uppercase">村のキャラクター</h2>
            <CharacterList characters={characters} leaderTurnsRemaining={state.leaderTurnsRemaining} />
          </section>

          <section className="bg-[#0f0f23] border border-gray-800 rounded-lg p-2.5 flex-shrink-0">
            <h2 className="text-[0.7rem] text-[#c9a84c] tracking-wider mb-2 uppercase">国家</h2>
            <NationList nations={worldData ? worldData.nations : []} />
          </section>
        </aside>

        {/* Game Area */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <Log messages={messages} />
          
          <div className="flex gap-2 items-end flex-shrink-0">
            <textarea
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && submitAction()}
              placeholder="行動を入力... (Ctrl+Enter で送信)"
              disabled={!isStarted || isLoading}
              className="flex-1 bg-[#0f0f23] border border-gray-600 text-gray-200 p-2.5 px-3.5 rounded-lg resize-none h-[68px] focus:outline-none focus:border-[#c9a84c] text-[0.93rem] disabled:opacity-50"
            />
            <button
              onClick={submitAction}
              disabled={!isStarted || isLoading || !playerInput.trim()}
              className="bg-[#5a3a8a] hover:bg-[#7a5aaa] text-white px-4.5 py-2.5 rounded-lg cursor-pointer text-[0.9rem] h-[68px] transition-colors flex-shrink-0 disabled:bg-gray-700 disabled:text-gray-500"
            >
              行動する
            </button>
          </div>

          <footer className="text-[0.75rem] text-gray-500 text-right flex-shrink-0">
            ターン:<span>{state.turn}</span>　年:<span>{state.year}年</span>
            　世代:<span>{state.generation}</span>代目　任期:残<span>{state.leaderTurnsRemaining}</span>ターン
            {isLoading && <span className="text-[#8888cc] italic ml-2"> 生成中...</span>}
          </footer>
        </div>
      </main>
    </div>
  );
}
