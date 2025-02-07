
export interface ICategorie {
  id: number ;
  nom?: string | null;
}

export type NewCategorie = Omit<ICategorie, 'id'> & { id: null };
