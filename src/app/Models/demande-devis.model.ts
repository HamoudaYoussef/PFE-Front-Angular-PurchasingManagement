import { NewFournisseur } from './fournisseur.model';
import { IProduitCommandee } from './produit-commandee.model';
import { IProduitDemandee } from './produit-demandee.model';
import { NewDemandeAchat } from './demande-achat.model';
export interface IDemandeDevis {
    id: number ;
    nom: string;
    description: string;
    demandeAchat : NewDemandeAchat;
    datedemande: string;
    fournisseur: NewFournisseur;
    reference:string;
  }

  export type NewDemandeDevis = Omit<IDemandeDevis, 'id'> & { id: number };
