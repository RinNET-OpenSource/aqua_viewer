export interface ChusanMusic {
  musicId: number;
  name: string;
  sotrName: string;
  artistName: string;
  genre: string;
  releaseVersion: string;
  levels: ChusanMusicLevels;
}

export interface ChusanMusicLevels {
  0: ChusanMusicLevelInfo;
  1: ChusanMusicLevelInfo;
  2: ChusanMusicLevelInfo;
  3: ChusanMusicLevelInfo;
  4: ChusanMusicLevelInfo;
  5: ChusanMusicLevelInfo;
}

export interface ChusanMusicLevelInfo {
  enable: boolean;
  level: number;
  levelDecimal: number;
  diff: number;
}

export enum Difficulty {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ULTIMA = 4,
  WORLD_END = 5,
}
