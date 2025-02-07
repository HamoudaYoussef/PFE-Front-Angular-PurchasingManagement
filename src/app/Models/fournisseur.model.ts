export interface IFournisseur {
  id: number;
  nom: string ;
  adresse: string ;
  tel: string;
  email: string;
}

export type NewFournisseur = Omit<IFournisseur, 'id'> & { id: number };
