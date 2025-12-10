import { Taxonomia } from "./taxonomia.model";

export interface Especie {
  id?: number;
  nome: string;
  nomeCientifico: string;
  ano: number;
  descricao: string;
  taxonomia: { id: number };   // APENAS ISSO!
}
