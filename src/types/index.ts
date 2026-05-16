export interface Local {
  id: number;
  nome: string;
}

export interface Sala {
  id: number;
  nome: string;
  local_id: number;
  local?: Local;
}

export interface Reserva {
  id: number;
  sala_id: number;
  data_inicio: string;
  data_fim: string;
  responsavel: string;
  tem_cafe: boolean;
  quantidade_pessoas_cafe?: number;
  descricao?: string;
  sala?: Sala;
}