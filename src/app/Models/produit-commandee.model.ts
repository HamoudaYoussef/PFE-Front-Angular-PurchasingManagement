import dayjs from 'dayjs/esm';
import { IProduit } from './produit.model';

export interface IProduitCommandee {
  idproduitcommandee: number ;
  idproduit?: number | null;
  idboncommande?: number | null;
  dateboncommande?: dayjs.Dayjs | null;
  quantitecommandee?: number | null;
  produit?: Pick<IProduit, 'idproduit'> | null;
}

export type NewProduitCommandee = Omit<IProduitCommandee, 'idproduitcommandee'> & { idproduitcommandee: null };
