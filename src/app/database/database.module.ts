import {NgModule} from '@angular/core';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';

export function migrationFactory() {
  return {};
}
const dbConfig: DBConfig = {
  name: 'Aqua',
  version: 2,
  objectStoresMeta: [
    {
      store: 'divaPv',
      storeConfig: {keyPath: 'pvId', autoIncrement: false},
      storeSchema: [
        {name: 'bpm', keypath: 'bpm', options: {unique: false}},
        {name: 'date', keypath: 'date', options: {unique: false}},
        {name: 'songName', keypath: 'songName', options: {unique: false}},
        {name: 'songNameEng', keypath: 'songNameEng', options: {unique: false}},
        {name: 'songNameReading', keypath: 'songNameReading', options: {unique: false}},
        {name: 'arranger', keypath: 'arranger', options: {unique: false}},
        {name: 'illustrator', keypath: 'illustrator', options: {unique: false}},
        {name: 'lyrics', keypath: 'lyrics', options: {unique: false}},
        {name: 'music', keypath: 'music', options: {unique: false}},
        {name: 'difficulty', keypath: 'difficulty', options: {unique: false}},
        {name: 'performerNumber', keypath: 'performerNumber', options: {unique: false}}
      ]
    }, {
      store: 'divaModule',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'price', keypath: 'price', options: {unique: false}}
      ]
    }, {
      store: 'divaCustomize',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'price', keypath: 'price', options: {unique: false}}
      ]
    }, {
      store: 'chuniMusic',
      storeConfig: {keyPath: 'musicId', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'sortName', keypath: 'sortName', options: {unique: false}},
        {name: 'copyright', keypath: 'copyright', options: {unique: false}},
        {name: 'artistName', keypath: 'artistName', options: {unique: false}},
        {name: 'genre', keypath: 'genre', options: {unique: false}},
        {name: 'releaseVersion', keypath: 'releaseVersion', options: {unique: false}}
      ]
    }, {
      store: 'ongekiCard',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'nickName', keypath: 'nickName', options: {unique: false}},
        {name: 'attribute', keypath: 'attribute', options: {unique: false}},
        {name: 'charaId', keypath: 'charaId', options: {unique: false}},
        {name: 'school', keypath: 'school', options: {unique: false}},
        {name: 'gakuen', keypath: 'gakuen', options: {unique: false}},
        {name: 'rarity', keypath: 'rarity', options: {unique: false}},
        {name: 'levelParam', keypath: 'levelParam', options: {unique: false}},
        {name: 'skillId', keypath: 'skillId', options: {unique: false}},
        {name: 'chouKaikaSkillId', keypath: 'chouKaikaSkillId', options: {unique: false}},
        {name: 'cardNumber', keypath: 'cardNumber', options: {unique: false}},
        {name: 'version', keypath: 'version', options: {unique: false}},
      ]
    }, {
      store: 'ongekiCharacter',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'cv', keypath: 'cv', options: {unique: false}},
        {name: 'modelId', keypath: 'modelId', options: {unique: false}}
      ]
    }, {
      store: 'ongekiMusic',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'sortName', keypath: 'sortName', options: {unique: false}},
        {name: 'artistName', keypath: 'artistName', options: {unique: false}},
        {name: 'genre', keypath: 'genre', options: {unique: false}},
        {name: 'bossCardId', keypath: 'bossCardId', options: {unique: false}},
        {name: 'bossLevel', keypath: 'bossLevel', options: {unique: false}},
        {name: 'level0', keypath: 'level0', options: {unique: false}},
        {name: 'level1', keypath: 'level1', options: {unique: false}},
        {name: 'level2', keypath: 'level2', options: {unique: false}},
        {name: 'level3', keypath: 'level3', options: {unique: false}},
        {name: 'level4', keypath: 'level4', options: {unique: false}}
      ]
    }, {
      store: 'ongekiRival',
      storeConfig: {keyPath: 'rivalUserId', autoIncrement: false},
      storeSchema: [
        {name: 'rivalUserName', keypath: 'rivalUserName', options: {unique: false}},
      ]
    }, {
      store: 'ongekiSkill',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'sortName', keypath: 'sortName', options: {unique: false}},
        {name: 'category', keypath: 'category', options: {unique: false}},
        {name: 'info', keypath: 'info', options: {unique: false}}
      ]
    }, {
      store: 'chuniCharacter',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'releaseTag', keypath: 'releaseTag', options: {unique: false}},
        {name: 'worksName', keypath: 'worksName', options: {unique: false}},
        {name: 'illustratorName', keypath: 'illustratorName', options: {unique: false}},
        {name: 'firstSkillId', keypath: 'firstSkillId', options: {unique: false}},
        {name: 'skills', keypath: 'skills', options: {unique: false}},
        {name: 'addImages', keypath: 'addImages', options: {unique: false}}
      ]
    }, {
      store: 'chuniSkill',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'category', keypath: 'category', options: {unique: false}}
      ]
    }, {
      store: 'chusanMusic',
      storeConfig: {keyPath: 'musicId', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'sortName', keypath: 'sotrName', options: {unique: false}},
        {name: 'artistName', keypath: 'artistName', options: {unique: false}},
        {name: 'genre', keypath: 'genre', options: {unique: false}},
        {name: 'releaseVersion', keypath: 'releaseVersion', options: {unique: false}}
      ]
    }, {
      store: 'chusanCharacter',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'releaseTag', keypath: 'releaseTag', options: {unique: false}},
        {name: 'worksName', keypath: 'worksName', options: {unique: false}},
        {name: 'illustratorName', keypath: 'illustratorName', options: {unique: false}},
        {name: 'addImages', keypath: 'addImages', options: {unique: false}}
      ]
    }, {
      store: 'chusanTrophy',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}}
      ]
    }, {
      store: 'chusanNamePlate',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}}
      ]
    }, {
      store: 'chusanSystemVoice',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}}
      ]
    }, {
      store: 'chusanMapIcon',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}}
      ]
    }, {
      store: 'chusanFrame',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}}
      ]
    }, {
      store: 'chusanAvatarAcc',
      storeConfig: {keyPath: 'id', autoIncrement: false},
      storeSchema: [
        {name: 'name', keypath: 'name', options: {unique: false}},
        {name: 'category', keypath: 'category', options: {unique: false}}
      ]
    },
  ],
  migrationFactory
};

@NgModule({
  declarations: [],
  imports: [
    NgxIndexedDBModule.forRoot(dbConfig)
  ]
})
export class DatabaseModule {
}
