export type Era = '黎明期' | '開拓期' | '神秘覚醒期' | '繁栄期' | '黄昏期';

export type WorldSituation = '平穏' | '繁栄' | '停滞' | '緊張' | '動乱' | '衰退' | '戦乱' | '黄金期' | '過熱' | '崩壊' | '復興' | '再建';

export interface Parameters {
  military: number;
  economy: number;
  loyalty: number;
  technology: number;
  population: number;
  food: number;
  fiscalHealth: number;
}

export interface WorldThreat {
  political: number;
  environmental: number;
  supernatural: number;
  total: number;
}

export interface DemonLord {
  name: string | null;
  type: { id: string; label: string; desc: string; mainThreat: string };
  dClass: string;
  scale: string;
  originKeyword: string;
  domainKeyword: string;
  behavior: string | null;
  weaknessHint: string | null;
  activeState: string;
  turnsUntilAct: number;
  turnsActive: number;
  defeats: number;
}

export interface Character {
  id: number;
  typeIdx: number;
  stats: Record<string, number>;
  attrs: {
    element: string;
    origin: string;
    personality: string;
    age: string;
    job: string;
    trait: string;
  };
  narrative: { name: string; flavorText: string } | null;
  isPlayer: boolean;
  isAlive: boolean;
  statusTag: string;
  birthTurn: number;
  birthYear: number;
  baseTurns: number;
}

export interface Nation {
  id: string;
  name: string;
  color: string;
  description: string;
  x: number;
  y: number;
  archetype: string;
  military: number;
  economy: number;
  stability: number;
  relations: Record<string, number>;
  status: string;
  keyFigures?: {
    leader: { name: string; role: string; characteristics: string[] };
    figures: { name: string; role: string; characteristics: string[] }[];
  };
}

export interface Village {
  id: string;
  name: string;
  nationId: string;
  x: number;
  y: number;
  isPlayer: boolean;
  description: string;
}

export interface GameEvent {
  id: string;
  title: string;
  urgency: number;
  duration: number;
  remainingTurns: number;
  description: string;
}

export interface PersonalQuest {
  name: string | null;
  description: string | null;
  status: 'pending' | 'active' | 'completed' | 'failed';
  urgency: string;
  progress: number;
  turnLimit: number | null;
  failImpact: string | null;
  startTurn: number;
}

export interface Hero {
  id: number;
  name: string;
  bestowedName: string | null;
  originFactionId: string | null;
  archetype: string;
  originType: string;
  domain: string;
  roleDescription: string;
  birthYear: number;
  biographyHint: string;
  currentActivity: string;
  deeds: string[];
  turnsActive: number;
  maxTurns: number;
  alive: boolean;
}

export interface Relic {
  id: string;
  def: {
    name: string;
    origin: string;
    source: string;
    power: string;
    curse: string | null;
  };
  record: {
    holder: string;
    discovered: boolean;
  };
  history: { turn: number; year: number; event: string; source?: string }[];
}

export interface Message {
  type: 'ai' | 'player' | 'system' | 'whisper' | 'world-voice' | 'demon' | 'generation' | 'confirm';
  text: string;
  turn?: number;
  dice?: string;
  speaker?: string;
}

export interface GameState {
  turn: number;
  year: number;
  era: Era;
  generation: number;
  villageName: string;
  worldSituation: WorldSituation;
  situationTurnsIn: number;
  parameters: Parameters;
  worldThreat: WorldThreat;
  demonLord: DemonLord | null;
  leaderEntityId: number | null;
  leaderTurnsRemaining: number;
  activeEvents: GameEvent[];
  nationEntities: Record<string, Nation>;
  hero: Hero | null;
  personalQuest: PersonalQuest;
  legacyPoints: number;
  playerReputation: number;
  playerFear: number;
  hiddenLore: {
    discoveredHints: string[];
    unrevealedMysteries: { id: string; title: string; hint: string }[];
    ancientProphecies: string[];
  };
  relics: Relic[];
  eventKeyword: string | null;
  civilizationProgress: number;
  civilizationState: string;
  governingIdeology: string | null;
  fateDie: number;
  civilPressures: { growth: number; decay: number; chaos: number; innovation: number };
  consecutiveGrowth: number;
  consecutiveDecline: number;
}
