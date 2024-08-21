import { IOffre } from "./offre.model";
import { IProduit } from './produit.model';

export interface IProduitDemandee {
  id: number | null;
  demandeAchatId: number;
  nom: string;
  description: string;
  quantite: number;
  
  isMatch?: boolean;
  enStock?: boolean; // Champ pour indiquer la correspondance

}

export type NewProduitDemandee = Omit<IProduitDemandee, 'id'> & { id: number };
