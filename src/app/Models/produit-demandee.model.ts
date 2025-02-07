import { NewDemandeAchat } from "./demande-achat.model";
import { IOffre } from "./offre.model";
import { IProduit, NewProduit } from './produit.model';

export interface IProduitDemandee {
  id: number | null;
  demandeAchat: NewDemandeAchat;
  nom: string;
  description: string;
  quantite: number;
  img:string;
  produit:NewProduit
  isMatch?: boolean;
  enStock?: boolean; 
  categorie:number,
  // Champ pour indiquer la correspondance

}

export type NewProduitDemandee = Omit<IProduitDemandee, 'id'> & { id: number };
