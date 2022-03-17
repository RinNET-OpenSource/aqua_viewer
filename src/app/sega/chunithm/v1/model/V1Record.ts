export interface V1Record {
  musicId: number;
  level: number;
  playCount: number;
  scoreMax: number;
  resRequestCount: number;
  resAcceptCount: number;
  resSuccessCount: number;
  missCount: number;
  maxComboCount: number;
  isFullCombo: boolean;
  isAllJustice: boolean;
  isSuccess: boolean;
  fullChain: number;
  maxChain: number;
  scoreRank: number;
  isLock: boolean;
}
