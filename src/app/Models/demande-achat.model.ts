import dayjs from 'dayjs/esm';
import { IOffre } from './offre.model';
import { IDemandeDevis } from './demande-devis.model';
import { IProduit } from './produit.model';

export interface IDemandeAchat {
  id: any;
  datedemande: string ;
  datebesoin: dayjs.Dayjs ;
  description: string;
  //nom:string;
  statut: string;
  //demandesdevis?: Pick<IDemandeDevis, 'iddemandedevis'>[] | null;
  produits: IProduit [];
  reference: string; // Ajoutez ce champ

}

export type NewDemandeAchat = Omit<IDemandeAchat, 'id'> & { id: any };
