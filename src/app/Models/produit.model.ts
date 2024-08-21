import { IOffre } from './offre.model';


export interface IProduit {
  idproduit: number ;
  quantite?: number | null;
  quantitedemandeur?: number | null;
  nom?: string | null;
  couleur?: string | null;
  offres?: Pick<IOffre, 'idoffre'>[] | null;
}

export type NewProduit = Omit<IProduit, 'idproduit'> & { idproduit: number };
