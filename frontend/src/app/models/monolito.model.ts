export interface Monolito {
  id?: number;

  stationFieldNumber: string;
  samplingNumber: number;

  metodo: string;
  profundidadeSolo: string;

  dia: number;
  mes: number;
  ano: number;

  collector: string;
  remarks?: string;
}