import dayjs from 'dayjs/esm';
import { IPaiement } from './paiement.model';
import { IBonLivraison } from './bon-livraison.model';
import { IBonCommande } from './bon-commande.model';

export interface IFacture {
  idfacture: number;
  datefacture?: dayjs.Dayjs | null;
  designation?: string | null;
  montanttotalfacture?: number | null;
  nomentrprise?: string | null;
  adresseentreprise?: string | null;
  telentreprise?: string | null;
  emailentreprise?: string | null;
  nomclient?: string | null;
  adresseclient?: string | null;
  telclient?: string | null;
  emailclien?: string | null;
  prixunitaire?: number | null;
  totalht?: number | null;
  tva?: number | null;
  totalttc?: number | null;
  reference?: string | null;
  paiements?: Pick<IPaiement, 'idpaiement'>[] | null;
  bonlivraisons?: Pick<IBonLivraison, 'idbonlivraison'>[] | null;
}

export type NewFacture = Omit<IFacture, 'idfacture'> & { idfacture: null };
