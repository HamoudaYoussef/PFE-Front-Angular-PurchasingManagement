export interface IFournisseur {
  fournisseur_id: number;
  nom: string ;
  adresse: string ;
  tel: string;
}

export type NewFournisseur = Omit<IFournisseur, 'fournisseur_id'> & { fournisseur_id: number };
