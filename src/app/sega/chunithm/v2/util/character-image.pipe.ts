import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characterImage'
})
export class CharacterImagePipe implements PipeTransform {

  transform(characterId: number): string {
    const prefix = Math.floor(characterId / 10).toString().padStart(4, '0');
    const suffix = (characterId % 10).toString().padStart(2, '0');
    return `${prefix}_${suffix}`;
  }

}
