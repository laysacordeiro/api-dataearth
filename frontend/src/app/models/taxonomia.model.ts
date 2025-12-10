export interface Taxonomia {
  id?: number;
  nome: string;
  nivel: string;
  parent?: { id: number } | null;
}
