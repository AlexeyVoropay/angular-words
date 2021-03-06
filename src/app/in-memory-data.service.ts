import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Language } from './language';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const languages = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    return {languages: languages};
  }

  // Overrides the genId method to ensure that a language always has an id.
  // If the languages array is empty,
  // the method below returns the initial number (11).
  // if the languages array is not empty, the method below returns the highest
  // language id + 1.
  genId(languages: Language[]): number {
    return languages.length > 0 ? Math.max(...languages.map(language => language.id)) + 1 : 11;
  }
}
