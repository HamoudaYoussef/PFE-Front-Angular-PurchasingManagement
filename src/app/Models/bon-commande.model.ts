import dayjs from 'dayjs/esm';
import { IFacture } from './facture.model';
import { IOffre, NewOffre } from './offre.model';
import { TypeLivraison } from './enumerations/type-livraison.model';
import { InfoPaiement } from './enumerations/info-paiement.model';

export interface IBonCommande {
  id: number;
  dateboncommande?: dayjs.Dayjs | null;
  reference?: string | null;
  nomentreprise?: string | null;
  adresseentreprise?: string | null;
  delailivraison?: dayjs.Dayjs | null;
  fraislivraison?: number | null;
  taxes?: number | null;
  montanttotal?: number | null;
  typelivraison?: TypeLivraison | null;
  infopaiement?: InfoPaiement | null;
  factures?: Pick<IFacture, 'idfacture'>[] | null;
  offre: NewOffre; // Relation avec l'offre

}

export type NewBonCommande = Omit<IBonCommande, 'id'> & { id: null };
