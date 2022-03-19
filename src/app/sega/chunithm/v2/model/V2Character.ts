import {ChusanCharacter} from './ChusanCharacter';

export interface V2Character {
  characterId: number;
  playCount: number;
  level: number;
  friendshipExp: number;
  isValid: boolean;
  isNewMark: boolean;
  exMaxLv: number;
  assignIllust: number;
  param1: string;
  param2: string;
  characterInfo: ChusanCharacter;
}
