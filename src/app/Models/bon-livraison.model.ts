import dayjs from 'dayjs/esm';
import { IFacture } from './facture.model';

export interface IBonLivraison {
  idbonlivraison: number ;
  numerobonlivraison?: number | null;
  datelivraion?: dayjs.Dayjs | null;
  factures?: Pick<IFacture, 'idfacture'>[] | null;
}

export type NewBonLivraison = Omit<IBonLivraison, 'idbonlivraison'> & { idbonlivraison: null };
