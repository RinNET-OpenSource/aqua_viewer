export enum Difficulty {
  Basic = 0,
  Advanced = 1,
  Expert = 2,
  Master = 3,
  Lunatic = 10, // Client sends 10 as id of Lunatic difficulty to server
}

export enum PlayResult {
  Failed,
  Finish,
  Clear,
  Max
}

export enum NotesComboResult {
  None,
  FullCombo,
  AllBreak,
  Max,
}

export enum BellComboResult {
  None,
  FullBell,
  Max,
}

export enum RetireResult {
  None,
  NoLife,
  ScoreRetire,
  DeathSkill,
  Max,
}

export enum BattleRank {
  Invalid = -1,
  Begin = 0,
  None = 0,
  Fuka = 1,
  Ka = 2,
  Ryo = 3,
  Yu = 4,
  Shu = 5,
  Goku = 6,
  Goku1 = 7,
  Goku2 = 8,
  Goku3 = 9,
  Goku4 = 10,
  Goku5 = 11,
  End = 12,
}

export enum TechnicalRank {
  None = 0,
  D = 1,
  C = 2,
  B = 3,
  BB = 4,
  BBB = 5,
  A = 6,
  AA = 7,
  AAA = 8,
  S = 9,
  SS = 10,
  SSS = 11,
  SSS1 = 12,
}

// The AttributeType send by client is + 1. So the value here is start from 1
export enum AttributeType {
  Fire = 1,
  Aqua = 2,
  Leaf = 3,
  Max = 4
}
