import dayjs from 'dayjs/esm';
import { IOffre } from './offre.model';
import { IDemandeDevis } from './demande-devis.model';
import { IProduit } from './produit.model';

export interface IDemandeAchat {
  id: number;
  datedemande: string ;
  datebesoin: dayjs.Dayjs ;
  description: string;
  statut: string;

  //demandesdevis?: Pick<IDemandeDevis, 'iddemandedevis'>[] | null;
  produits: IProduit [];
}

export type NewDemandeAchat = Omit<IDemandeAchat, 'id'> & { id: number };
