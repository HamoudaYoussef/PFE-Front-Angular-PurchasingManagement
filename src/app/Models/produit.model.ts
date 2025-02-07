import { ICategorie } from './categorie.model';
import { IOffre } from './offre.model';


export interface IProduit {
  id: number ;
  quantite?: number | null;
  nom?: string | null;
  description?: string | null;
categorie?: ICategorie;
  couleur?: string | null;
  offres?: Pick<IOffre, 'id'>[] | null;
  img?:string;

}

export type NewProduit = Omit<IProduit, 'id'> & { id: number };
