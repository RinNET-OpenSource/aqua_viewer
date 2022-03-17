import {ChuniCharacter} from './ChuniCharacter';
import {ChuniSkill} from './ChuniSkill';

export interface V1Character {
  characterId: number;
  playCount: number;
  level: number;
  skillId: number;
  friendshipExp: number;
  isValid: boolean;
  isNewMark: boolean;
  param1: string;
  param2: string;
  characterInfo: ChuniCharacter;
  skillInfo: ChuniSkill;
}
