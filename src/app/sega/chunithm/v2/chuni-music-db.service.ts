import {Injectable} from '@angular/core';
import {ChusanMusic} from './model/ChusanMusic';
import {ApiService} from '../../../api.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChusanMusicDbService {

  private dbSubject = new Subject<Map<number, ChusanMusic>>();
  dbState = this.dbSubject.asObservable();

  musicDb: Map<number, ChusanMusic>;

  constructor(private api: ApiService) {
    let db = localStorage.getItem('chusanMusicDb');
    if (db == null) {
      this.api.get('api/game/chuni/v2/data/music').subscribe(
        data => {
          db = data;
          localStorage.setItem('chusanMusicDb', JSON.stringify(db));
          this.musicDb = this.parse(JSON.parse(db));
        }
      );
    } else {
      this.musicDb = this.parse(JSON.parse(db));
    }
  }

  get(id: number): ChusanMusic {
    return this.musicDb.get(id);
  }

  getMusicDb(): Map<number, ChusanMusic> {
    return this.musicDb;
  }

  private parse(db: ChusanMusic[]): Map<number, ChusanMusic> {
    const result: Map<number, ChusanMusic> = new Map();
    db.forEach(x => {
      result.set(x.musicId, x);
    });
    return result;
  }
}
