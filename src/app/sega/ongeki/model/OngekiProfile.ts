import {OngekiCard} from './OngekiCard';
import {OngekiCharacter} from './OngekiCharacter';

export interface DisplayOngekiProfile {
  userName: string;
  level: number;
  reincarnationNum: number;
  lastPlayDate: string;
  exp: number;
  point: number;
  totalPoint: number;
  playCount: number;
  jewelCount: number;
  totalJewelCount: number;
  playerRating: number;
  highestRating: number;
  battlePoint: number;
  nameplateId: number;
  trophyId: number;
  cardId: number;
  card?: OngekiCard;
  characterId: number;
  character: OngekiCharacter;
  sumTechHighScore: number;
  sumTechBasicHighScore: number;
  sumTechAdvancedHighScore: number;
  sumTechExpertHighScore: number;
  sumTechMasterHighScore: number;
  sumTechLunaticHighScore: number;
  sumBattleHighScore: number;
  sumBattleBasicHighScore: number;
  sumBattleAdvancedHighScore: number;
  sumBattleExpertHighScore: number;
  sumBattleMasterHighScore: number;
  sumBattleLunaticHighScore: number;
}
