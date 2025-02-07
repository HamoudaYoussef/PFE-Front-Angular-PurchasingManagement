import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public apiUrlDocEditor = '';
  public docPardefaut;
  public RoleCanAddDoc ;
  public RoleCanDeleteDoc ;
  // API url
  public apiUrlMetiers = '';
  public apiUrlkernel = 'http://localhost.picosoft.biz:4203';
  public apifournisseur = 'http://localhost:8888/achat/api/fournisseurs/';

  public apiUrlpostal = '';
  public apiUrlBack= 'https://psdev.picosoft.biz/kernel-v1/';
  public versionBack;
  public versionFront ;
  public apiBackPSSIGN;
  public PSSIGNAPPNAME;
  public apiFrontPSSIGN;
  public stylingMode;
  public labelMode;
  public activityNameenCoursPreparation;
  public demandeDevis ='http://localhost:8888/achat/api/demande-devis/';
public piOpp='http://localhost:8888/achat/api/demande-achats/';
public urlProject='http://localhost:8888/achat/api/';
public piOppBC='http://localhost:8888/achat/api/bon-commandes/';


  // Whether or not to enable debug mode
  public enableDebug = true;

  //Date Formatting Patterns
  public D = "DD/MM/YY";
  public DS = "DD/MM";
  public DFSHORTT = "DD/MM HH:mm";
  public DFSHORTTSS = "DD/MM HH:mm:ss";
  public DFT = "DD/MM/YY HH:mm";
  public Dshort = "yyyy-MM-DD";
  public T = "HH:mm";
  public timerNotif = 3750;
  //
  public levelNotifR = ["Normal", "Important"];
  public levelNotif = [{cle: "info", value: "Normal"}, {cle: "ERROR", value: "Important"}];
  public nbrHeightNotif = 3;
  public maxLengthNotift = 256;
  public minLengthNotif;
  //Number Formatting Patterns
  public L0 = "fr-FR";
  public L1num = 3;
  public L2num = 3;
  public L0num = 0;
  public formatdefault = "default";
  public LCEur = "EUR";
  public LCUsd = "USD";
  public LCF = "TND";
  public unit = "unit";
  public kilometer = "kilometer";
  public templateQPAG = "QPAG";

  public iconInfo = "";
  public iconError = "";
  public iconWarning = "";
  public iconDebug = "";
  public iconTrace = "";
  public iconFatal = "";

  //Tostor
  public extendedTimeOutToastr = 900;
  public timeOutToastr = 1000;
  //Pagination
  public stateStoring = false;
  public allowedPageSizes = [10, 15, 25, 50];
  public pageSize = 10;
  //document
  public apiUrlDocGenerateur;
  public RoleCanEditDoc = '';
  //cloud pstk

  cloudMsiPSTK:any;
 pstkport :any;
  pstoolkitURLhttps :any
  pstkRunnigTimer:any;
  //file
  maxUploadMultiPartFile:any;
  moduleNameKernel:any;
  //url logout front kernel

  apiUrlfrontkernel:any;
  theme = 'sndp';
  public defaultCountry = "Tunisie"
  //
  public activityNameDemandeEnCours;
  public activityNameDemandeenAttendAvis;
  public activityNameDemande;
  public activityNamedemandeaccept;
  constructor() { }
}
