import { IDemandeAchat } from "./demande-achat.model";
import { IProduit } from "./produit.model";

export interface IAchatProduit {
  idachatproduit: number;
  idproduit?: number | null;
  iddemandeachat?: number | null;
  qunaitite?: number | null;
  prix?: number | null;
 // demandeachat?: Pick<IDemandeAchat, 'iddemandeachat'> | null;
  produit?: Pick<IProduit, 'idproduit'> | null;
}

export type NewAchatProduit = Omit<IAchatProduit, 'idachatproduit'> & { idachatproduit: null };
