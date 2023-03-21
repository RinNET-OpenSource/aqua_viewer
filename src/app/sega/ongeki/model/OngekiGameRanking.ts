import {OngekiMusic} from './OngekiMusic';

export interface OngekiGameRanking {
  music: OngekiMusic;
  playCount: number;
  ranking: number;
  state: number;
}
