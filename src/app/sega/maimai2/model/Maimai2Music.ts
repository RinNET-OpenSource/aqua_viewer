export interface Maimai2Music {
  musicId: number;
  name: string;
  artistName: string;
  sortName: string;
  genreId: number;
  romVersion: number;
  addVersion: number;
  details: Maimai2MusicDetails;
}

export interface Maimai2MusicDetails {
  0: Maimai2MusicDetail;
  1: Maimai2MusicDetail;
  2: Maimai2MusicDetail;
  3: Maimai2MusicDetail;
  4: Maimai2MusicDetail;
  5: Maimai2MusicDetail;
}

export interface Maimai2MusicDetail {
  id: number;
  tapCount: number;
  holdCount: number;
  breakCount: number;
  slideCount: number;
  touchCount: number;
  levelDecimal: number;
  noteDesigner: string;
  utageComment: string;
  utageKanji: string;
  tsuikaVersion: number;
  diff: number;
}


