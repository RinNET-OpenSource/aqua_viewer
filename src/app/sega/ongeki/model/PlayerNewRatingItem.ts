import {OngekiMusic} from './OngekiMusic';

export interface PlayerNewRatingItem {
  musicId: number;
  level: number;
  techScoreMax: number;
  platinumScoreMax: number;
  platinumScoreStar: number;
  isFullBell?: boolean;
  isFullCombo?: boolean;
  isAllBreak?: boolean;
  clearMarkType?: ClearMarkType;
  musicInfo?: OngekiMusic;
}

export enum ClearMarkType {
  None,
  FullCombo,
  AllBreak,
  AllBreakPlus
}
