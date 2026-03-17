export type SolicitacaoStatus = 'PENDING' | 'ACCEPTED' | 'DENIED';

export interface Solicitacao {
  id: number;
  user: {
    id: number;
    username: string;
  };
  requestedRole: string;
  status: SolicitacaoStatus;
  createdAt: string;
}
