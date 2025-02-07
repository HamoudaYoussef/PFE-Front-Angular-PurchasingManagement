import { NewBonCommande } from "./bon-commande.model";
import { NewOffre } from "./offre.model";
import { NewProduit } from "./produit.model";

export interface IProduitOffert {
    id: number | null;
    produit: NewProduit;
    offre: NewOffre;
    bonCommande: NewBonCommande;
    nom: string;
    description: string;
    quantite: number;
    prix:number;
    img:string;
    categorie:number,

  }
  
  export type NewProduitOffert = Omit<IProduitOffert, 'id'> & { id: number };
  