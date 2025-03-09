import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReleaseTagService {

  releaseTags = [
    'v1 1.00.00', 'v1 1.05.00',
    'v1 1.10.00', 'v1 1.15.00',
    'v1 1.20.00', 'v1 1.25.00',
    'v1 1.30.00', 'v1 1.35.00',
    'v1 1.40.00', 'v1 1.45.00',
    'v1 1.50.00', 'v1 1.55.00',
    'v2 2.00.00', 'v2 2.05.00',
    'v2 2.10.00', 'v2 2.15.00',
    'v2 2.20.00', 'v2 2.25.00',
    'v2 2.30.00'
  ];
  releaseTagMap = new Map([
    ['v1 1.00.00', 'ORIGIN'],
    ['v1 1.05.00', 'ORIGIN PLUS'],
    ['v1 1.10.00', 'AIR'],
    ['v1 1.15.00', 'AIR PLUS'],
    ['v1 1.20.00', 'STAR'],
    ['v1 1.25.00', 'STAR PLUS'],
    ['v1 1.30.00', 'AMAZON'],
    ['v1 1.35.00', 'AMAZON PLUS'],
    ['v1 1.40.00', 'CRYSTAL'],
    ['v1 1.45.00', 'CRYSTAL PLUS'],
    ['v1 1.50.00', 'PARADISE'],
    ['v1 1.55.00', 'PARADISE LOST'],
    ['v2 2.00.00', 'NEW'],
    ['v2 2.05.00', 'NEW PLUS'],
    ['v2 2.10.00', 'SUN'],
    ['v2 2.15.00', 'SUN PLUS'],
    ['v2 2.20.00', 'LUMINOUS'],
    ['v2 2.25.00', 'LUMINOUS PLUS'],
    ['v2 2.30.00', 'VERSE'],
  ]);

  constructor() { }

  public getReleaseTags(): string[] {
    return this.releaseTags;
  }

  public getName(releaseTag: string): string {
    return  this.releaseTagMap.get(releaseTag);
  }
}
