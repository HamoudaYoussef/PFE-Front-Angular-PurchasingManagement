import dayjs from 'dayjs/esm';
import { IProduit, NewProduit } from './produit.model';
import { NewDemandeDevis } from './demande-devis.model';

export interface IProduitCommandee {
  id: number | null;
  nom: string ;
  description?: string ;
  quantite: number ;
  produit: NewProduit;
  demandeDevis: NewDemandeDevis;
  img:string;
  categorie:number,

}

export type NewProduitCommandee = Omit<IProduitCommandee, 'id'> & { id: number };
