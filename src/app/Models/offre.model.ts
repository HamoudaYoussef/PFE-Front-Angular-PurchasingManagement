import dayjs from 'dayjs/esm';
import { IFournisseur } from './fournisseur.model';
import { IDemandeAchat } from './demande-achat.model';


export interface IOffre {
  idoffre?: number;
  prix?: number | null;
  dateoffre?: dayjs.Dayjs | null;
  description?: string | null;
  nom?: string | null;
  referenceoffre?: string | null;
 // fournisseur_id?: Pick<IFournisseur, 'fournisseur_id'> | null;
 fournisseur: IFournisseur;
 demandeachat: IDemandeAchat;
}


export type NewOffre = Omit<IOffre, 'idoffre'> & { idoffre: number };


