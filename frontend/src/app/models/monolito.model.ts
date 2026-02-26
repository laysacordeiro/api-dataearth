export interface Monolito {
  id?: number;
  station_field_number?: string;
  sampling_number?: number;
  metodo?: string;
  profundidade_solo?: string;
  dia?: number;
  mes?: number;
  ano?: number;
  collector?: string;
  remarks?: string;
  localizacao_id?: number;
  especies?: any[];
}