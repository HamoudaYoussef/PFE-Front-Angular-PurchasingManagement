import dayjs from 'dayjs/esm';
import { IFacture } from './facture.model';
import { IOffre, NewOffre } from './offre.model';
import { TypeLivraison } from './enumerations/type-livraison.model';
import { InfoPaiement } from './enumerations/info-paiement.model';
import { NewProduitOffert } from './produit-offert.model';

export interface IBonCommande {
  id: number;
  dateboncommande?: dayjs.Dayjs | null;
  delailivraison?: dayjs.Dayjs | null;
  reference?: string | null;
  numero?: string | null;
  typelivraison?: TypeLivraison | null;
  adresselivraison?: string | null;
}

export type NewBonCommande = Omit<IBonCommande, 'id'> & { id: null };
