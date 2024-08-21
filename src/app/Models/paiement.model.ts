import dayjs from 'dayjs/esm';
import { IFacture } from './facture.model';

export interface IPaiement {
  idpaiement: number;
  montanttotal?: number | null;
  datepaiement?: dayjs.Dayjs | null;
  methodepaiement?: string | null;
  statuts?: string | null;
  facture?: Pick<IFacture, 'idfacture'> | null;
}

export type NewPaiement = Omit<IPaiement, 'idpaiement'> & { id: null };
