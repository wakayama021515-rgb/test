import { Era, WorldSituation } from './types';

export const SITUATION_GRAPH: Record<WorldSituation, WorldSituation[]> = {
  '平穏': ['繁栄', '停滞', '緊張'],
  '繁栄': ['黄金期', '停滞', '過熱'],
  '停滞': ['平穏', '衰退', '動乱'],
  '緊張': ['動乱', '平穏', '戦乱'],
  '動乱': ['衰退', '復興', '崩壊'],
  '衰退': ['動乱', '復興', '崩壊'],
  '戦乱': ['平穏', '衰退', '黄金期'],
  '黄金期': ['過熱', '停滞'],
  '過熱': ['崩壊', '緊張'],
  '崩壊': ['再建'],
  '復興': ['平穏'],
  '再建': ['平穏'],
};

export const SITUATION_COLORS: Record<WorldSituation, { bg: string; color: string; border: string }> = {
  '平穏': { bg: '#1a3a1a', color: '#60d060', border: '#3a6a3a' },
  '繁栄': { bg: '#2a2a0a', color: '#d0c040', border: '#5a5a1a' },
  '停滞': { bg: '#1a1a3a', color: '#7070a0', border: '#3a3a6a' },
  '緊張': { bg: '#2a1a0a', color: '#d08030', border: '#6a4a1a' },
  '動乱': { bg: '#2a1a0a', color: '#e06030', border: '#7a3a1a' },
  '衰退': { bg: '#2a0a2a', color: '#b050b0', border: '#5a1a5a' },
  '戦乱': { bg: '#2a0a0a', color: '#e04040', border: '#7a1a1a' },
  '黄金期': { bg: '#2a2200', color: '#f0c030', border: '#7a6a10' },
  '過熱': { bg: '#2a1a00', color: '#e07020', border: '#8a4a0a' },
  '崩壊': { bg: '#1a0000', color: '#ff3030', border: '#6a0000' },
  '復興': { bg: '#0a2a1a', color: '#30d090', border: '#1a6a4a' },
  '再建': { bg: '#0a1a2a', color: '#3090d0', border: '#1a4a6a' },
};

export const PARAM_TYPES = [
  { label: '天才型', weight: 2, stars: 5, desc: '全能力が卓越した稀有の存在', ranges: [[50, 70], [65, 85], [70, 90], [55, 75], [50, 70], [55, 75], [55, 75]] },
  { label: '秀才型', weight: 5, stars: 4, desc: '知力と魔力に優れた知識者', ranges: [[20, 40], [60, 80], [70, 90], [35, 55], [30, 50], [50, 70], [45, 65]] },
  { label: '万能型', weight: 5, stars: 4, desc: 'バランスの取れた堅実な能力', ranges: [[40, 60], [40, 60], [40, 60], [40, 60], [40, 60], [40, 60], [40, 60]] },
  { label: '精霊型', weight: 5, stars: 4, desc: '精霊と共鳴する魔法の素質', ranges: [[15, 35], [70, 90], [45, 65], [35, 55], [25, 45], [45, 65], [60, 80]] },
  { label: '預言型', weight: 5, stars: 4, desc: '未来を垣間見る異能の持ち主', ranges: [[20, 35], [45, 65], [55, 75], [30, 50], [30, 50], [40, 65], [65, 90]] },
  { label: '業火型', weight: 5, stars: 4, desc: '破壊的な魔力と膂力を持つ者', ranges: [[55, 75], [70, 95], [30, 50], [35, 55], [25, 40], [25, 45], [35, 55]] },
  { label: '隠者型', weight: 5, stars: 4, desc: '深奥な知識を持つ孤高の存在', ranges: [[20, 35], [65, 80], [75, 95], [25, 40], [35, 55], [10, 30], [45, 65]] },
  { label: '武闘型', weight: 7, stars: 3, desc: '筋力と体力に優れた戦士', ranges: [[65, 85], [10, 25], [25, 45], [50, 70], [65, 85], [25, 45], [35, 55]] },
  { label: '魔道型', weight: 6, stars: 3, desc: '魔力に特化した術者', ranges: [[15, 30], [75, 95], [55, 75], [30, 50], [20, 40], [35, 55], [40, 60]] },
  { label: '俊敏型', weight: 7, stars: 3, desc: '素早さと反射神経が突出', ranges: [[30, 50], [25, 45], [35, 55], [70, 90], [35, 55], [40, 60], [55, 75]] },
  { label: '堅牢型', weight: 6, stars: 3, desc: '防御と生命力が抜群', ranges: [[55, 75], [15, 30], [25, 45], [25, 45], [70, 90], [30, 50], [35, 55]] },
  { label: '幸運型', weight: 6, stars: 3, desc: '幸運に導かれる奇跡の人', ranges: [[30, 50], [30, 50], [30, 50], [35, 55], [35, 55], [50, 70], [70, 95]] },
  { label: '魅力型', weight: 6, stars: 3, desc: '卓越した魅力で人を惹きつける', ranges: [[25, 45], [35, 55], [40, 60], [40, 60], [30, 50], [70, 90], [45, 65]] },
  { label: '闘気型', weight: 6, stars: 3, desc: '戦闘本能が研ぎ澄まされた者', ranges: [[70, 90], [15, 25], [20, 35], [55, 75], [40, 60], [20, 35], [40, 60]] },
  { label: '探索型', weight: 6, stars: 3, desc: '知覚と敏捷に優れた斥候', ranges: [[35, 55], [25, 45], [50, 70], [60, 80], [35, 55], [35, 55], [45, 65]] },
  { label: '聖域型', weight: 6, stars: 3, desc: '魔力と魅力で人を守る聖者', ranges: [[35, 55], [55, 75], [40, 60], [30, 50], [55, 75], [60, 80], [40, 60]] },
  { label: '暗器型', weight: 6, stars: 3, desc: '影から急所を狙う刺客', ranges: [[50, 70], [25, 45], [40, 60], [65, 85], [30, 50], [15, 30], [45, 65]] },
  { label: '獣化型', weight: 6, stars: 3, desc: '野生の本能で戦う異能者', ranges: [[60, 80], [15, 25], [20, 35], [55, 75], [65, 85], [20, 35], [40, 60]] },
];

export const STAT_KEYS = ['STR', 'MAG', 'INT', 'AGI', 'VIT', 'CHA', 'LUK'];

export const PARAM_LABELS: Record<string, string> = {
  military: '軍事',
  economy: '経済',
  loyalty: '民心',
  technology: '技術',
  population: '人口',
  food: '食料',
  fiscalHealth: '財政',
};

export const PARAM_CLASSES: Record<string, string> = {
  military: 'mil',
  economy: 'eco',
  loyalty: 'loy',
  technology: 'tec',
  population: 'pop',
  food: 'food',
  fiscalHealth: 'fis',
};

export const ERA_CONFIG: Record<Era, { caps: Record<string, number>; next: Era | null; condition: (s: any) => boolean }> = {
  '黎明期': {
    caps: { military: 80, economy: 80, loyalty: 90, technology: 50, population: 5000, food: 4000 },
    next: '開拓期',
    condition: s => s.parameters.population >= 2500 && s.parameters.economy >= 50
  },
  '開拓期': {
    caps: { military: 160, economy: 160, loyalty: 90, technology: 100, population: 20000, food: 16000 },
    next: '神秘覚醒期',
    condition: s => s.parameters.technology >= 70 && s.parameters.population >= 8000
  },
  '神秘覚醒期': {
    caps: { military: 260, economy: 220, loyalty: 90, technology: 180, population: 60000, food: 50000 },
    next: '繁栄期',
    condition: s => s.parameters.economy >= 160 && s.parameters.loyalty >= 60
  },
  '繁栄期': {
    caps: { military: 360, economy: 320, loyalty: 90, technology: 270, population: 160000, food: 130000 },
    next: '黄昏期',
    condition: s => s.worldThreat.total >= 260 || (s.parameters.military >= 300 && s.parameters.economy >= 260)
  },
  '黄昏期': {
    caps: { military: 500, economy: 480, loyalty: 90, technology: 420, population: 320000, food: 260000 },
    next: null,
    condition: () => false
  },
};

export const DEMON_TYPES = [
  { id: 'humanoid', label: '人型腐敗', desc: '人の負の感情の具現。対話の余地あり。', mainThreat: 'political' },
  { id: 'natural', label: '自然災害', desc: '自然現象の具現。広範囲に影響する。', mainThreat: 'environmental' },
  { id: 'eldritch', label: '異界存在', desc: '世界の外部からの超常存在。', mainThreat: 'supernatural' },
  { id: 'conceptual', label: '概念破壊者', desc: '特定の概念を侵食・破壊する存在。', mainThreat: 'supernatural' },
];

export const ATTR_POOL = {
  element: ['炎', '水', '土', '風', '雷', '光', '闇', '氷', '毒', '混沌', '秩序', '時間', '空間', '生命', '死霊'],
  origin: ['農村出身', '貴族の末裔', '孤児', '異世界からの来訪者', '精霊の加護を受けた里', '没落貴族の子', '辺境の集落', '商業都市の商家'],
  personality: ['勇敢', '臆病', '慎重', '大胆', '正直', '狡猾', '優しい', '冷酷', '情熱的', '冷静'],
  age: ['幼年(8-11)', '少年少女(12-17)', '青年(18-25)', '壮年(26-35)', '成熟(36-45)', '中年(46-55)', '老練(56-70)', '長老(71-80)', '老齢(81-100)'],
  job: ['兵士', '騎士', '魔術師', '僧侶', '盗賊', '賢者', '鍛冶師', '商人', '吟遊詩人', '医者'],
  trait: ['神に愛されし', '呪われし', '竜の血', '鋼の意志', '博識', '不死の体質', '世界の鍵', '予言の成就者'],
};

export const EVENT_KEYWORDS: Record<number, string> = {
  1: '金', 2: '岩', 3: '火', 4: '水', 5: '木', 6: '土', 7: '風', 8: '雷', 9: '光', 10: '闇',
  11: '聖', 12: '魔', 13: '竜', 14: '獣', 15: '森', 16: '山', 17: '海', 18: '川', 19: '空', 20: '星',
  21: '豊', 22: '飢', 23: '病', 24: '乱', 25: '戦', 26: '和', 27: '探', 28: '築', 29: '術', 30: '文',
  31: '商', 32: '政', 33: '法', 34: '災', 35: '運', 36: '謎', 37: '隠', 38: '継', 39: '託', 40: '志',
  41: '絆', 42: '裏', 43: '忠', 44: '怒', 45: '喜', 46: '悲', 47: '恐', 48: '諦', 49: '望', 50: '生',
};

export const DEMON_CLASS = ['暴君型', '天災型', '侵食者型', '概念崩壊型'];
export const DEMON_SCALE = ['局所的', '広域的', '世界規模'];
export const DEMON_ORIGIN = ['憎悪', '絶望', '強欲', '恐怖', '虚無', '怒り', '嫉妬', '傲慢', '腐敗', '混沌'];
export const DEMON_DOMAIN = ['炎と破壊', '深淵と忘却', '時間と運命', '概念と認知', '自然と枯渇', '魂と死'];

export const HERO_ARCHETYPES = ['戦士', '賢者', '聖者', '放浪者', '革命家', '探求者', '守護者', '予言者'];
export const HERO_ORIGINS = ['村の英雄', '没落貴族', '孤児', '選ばれし者', '異邦人', '復讐者'];
export const HERO_DOMAINS = ['剣と力', '魔法と知', '信仰と光', '探求と謎', '自然と生', '影と策'];

export const NATION_ARCHETYPES = ['農耕帝国', '商業連邦', '神権国家', '軍事王国', '海洋共和国', '遊牧連合', '魔法学術国', '辺境侯国'];

export const AGE_TURNS: Record<string, number> = {
  '幼年(8-11)': 10, '少年少女(12-17)': 9, '青年(18-25)': 7, '壮年(26-35)': 6,
  '成熟(36-45)': 5, '中年(46-55)': 4, '老練(56-70)': 3, '長老(71-80)': 2, '老齢(81-100)': 2,
};
