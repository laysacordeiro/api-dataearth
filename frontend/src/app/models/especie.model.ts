import { Taxonomia } from "./taxonomia.model";

export interface Especie {
  id?: number;
  nome: string;
  nomeCientifico: string;
  ano: number;
  autor: string; 
  descricao: string;
  taxonomia: Taxonomia;
}