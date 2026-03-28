import { Monolito } from './monolito.model';

export interface Localidade {
  id?: number;
  locality: string;
  county: string;
  state: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  name_uc: string;
  class_uc: string;
}

export interface Clima {
  id?: number;
  clima_koppen: string;
  avg_temp: number;
  avg_precip: number;
  description: string;
}

export interface Environment {
  id?: number;
  vegeType: string;
  prepType: string;
  soilType: string;
  currentVege: string;
  originalVege: string;
  vegeAge: number;
  biome: string;
}

export interface Parcela {
  id?: number;
  proprietario: string;
  usoDaTerra: string;
  dataDoEvento: string;
  description: string;
  localidade: Localidade;
  clima: Clima;
  environment: Environment;
  monolitos?: Monolito[];
}
