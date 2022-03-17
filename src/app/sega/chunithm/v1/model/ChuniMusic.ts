export interface ChuniMusic {
  musicId: number;
  name: string;
  sotrName: string;
  copyright: string;
  artistName: string;
  genre: string;
  releaseVersion: string;
  levels: ChuniMusicLevels;
}

export interface ChuniMusicLevels {
  0: ChuniMusicLevelInfo;
  1: ChuniMusicLevelInfo;
  2: ChuniMusicLevelInfo;
  3: ChuniMusicLevelInfo;
  4: ChuniMusicLevelInfo;
}

export interface ChuniMusicLevelInfo {
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
  WORLD_END = 4,
}
