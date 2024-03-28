import {OngekiCard} from './OngekiCard';
import {OngekiCharacter} from './OngekiCharacter';
import {OngekiTrophy} from './OngekiTrophy';

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
  medalCount: number;
  playerRating: number;
  highestRating: number;
  battlePoint: number;
  rankId: number;
  rankPattern: number;
  nameplateId: number;
  trophyId: number;
  trophy: OngekiTrophy;
  cardId: number;
  characterId: number;
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
