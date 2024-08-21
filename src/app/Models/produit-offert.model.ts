export interface IProduitOffert {
    id: number | null;
    demandeAchatId: number;
    nom: string;
    description: string;
    quantite: number;

  }
  
  export type NewProduitOffert = Omit<IProduitOffert, 'id'> & { id: number };
  