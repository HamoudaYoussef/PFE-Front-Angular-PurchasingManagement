import dayjs from 'dayjs/esm';
import { IFournisseur } from './fournisseur.model';
import { IDemandeAchat } from './demande-achat.model';
import { NewProduitOffert } from './produit-offert.model';
import { IDemandeDevis } from './demande-devis.model';


export interface IOffre {
  id?: number;
  prix?: number | null;
  dateoffre?: string;
  description?: string | null;
  nom?: string | null;
  referenceoffre?: string | null;
  fournisseur: IFournisseur;
  demandeDevis:IDemandeDevis;
}


export type NewOffre = Omit<IOffre, 'id'> & { id: number };


