import { IProduitCommandee } from './produit-commandee.model';
export interface IDemandeDevis {
    id: number ;
    nom: string;
    description: string;
    quantite : number;
    demandeAchatId : number;
    fournisseurId: number;

    /*numerobonlivraison?: number | null;
    datelivraion?: dayjs.Dayjs | null;
    factures?: Pick<IFacture, 'idfacture'>[] | null;*/
  }

  export type NewDemandeDevis = Omit<IDemandeDevis, 'id'> & { id: number };
