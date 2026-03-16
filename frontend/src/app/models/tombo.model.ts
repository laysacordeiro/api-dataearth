import { Especie } from './especie.model';

export interface Tombo {
  id?: number;
  abundancia: number;
  identificador: string;
  especie: Especie;
}