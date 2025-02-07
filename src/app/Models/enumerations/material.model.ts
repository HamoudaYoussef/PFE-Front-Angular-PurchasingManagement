// Processeurs et Cartes Mères
export enum ComposantsProcesseursCartesMeres {
    CPU ="UCT",
    CarteMere = "CM",
    Microprocesseur = "μP",
    Chipset = "Chipset",
    BIOS = "BIOS",
    UEFI = "UEFI",
    SocketCPU = "Socket UCT",
    RefroidisseurCPU = "Refroidisseur UCT",
    ChipsetCarteMere = "Chipset CM",
    Northbridge = "Northbridge",
    Southbridge = "Southbridge"
}


// Mémoire et Stockage
export enum ComposantsMemoireStockage {
    RAM = "RAM",
    ROM = "ROM",
    DisqueDur = "DD",
    SSD = "SSD",
    CleUSB = "Clé USB",
    CarteMemoire = "Carte mémoire",
    CarteSD = "Carte SD",
    CarteMicroSD = "Carte microSD",
    CarteCFast = "Carte CFast"
}

// Graphiques et Écrans
export enum ComposantsGraphiquesEcrans {
    CarteGraphique = "CG",
    GPU = "GPU",
    VGA = "VGA",
    DVI = "DVI",
    HDMI = "HDMI",
    PortSortieVideo = "Port de sortie vidéo",
    Ecran = "Écran",
    EcranLCD = "Écran LCD",
    EcranLED = "Écran LED",
    EcranOLED = "Écran OLED"
}

// Périphériques d'Entrée/Sortie
export enum ComposantsPeripheriquesEntreeSortie {
    Clavier = "Clavier",
    Souris = "Souris",
    PaveTactile = "Pavé tactile",
    Webcam = "Webcam",
    Microphone = "Microphone",
    HautParleur = "Haut-parleur",
    CasqueAudio = "Casque audio",
    ManetteJeu = "Manette de jeu",
    ControleurJeu = "Contrôleur de jeu",
    Scanner = "Scanner"
}

// Réseau et Connectivité
export enum ComposantsReseauConnectivite {
    CarteReseau = "CN",
    CableEthernet = "Câble Ethernet",
    AdaptateurWiFi = "Adaptateur Wi-Fi",
    AdaptateurBluetooth = "Adaptateur Bluetooth",
    Routeur = "Routeur",
    Commutateur = "Commutateur",
    Modem = "Modem",
    CarteInterfaceReseau = "NIC",
    RouteurWiFi = "Routeur Wi-Fi",
    PointAcces = "Point d'accès"
}

// Alimentation et Refroidissement
export enum ComposantsAlimentationRefroidissement {
    PSU = "PSU",
    CordonAlimentation = "Cordon d'alimentation",
    Batterie = "Batterie",
    Chargeur = "Chargeur",
    VentilateurRefroidissement = "Ventilateur de refroidissement",
    Radiateur = "Radiateur",
    PateThermique = "Pâte thermique",
    SystemeRefroidissementLiquide = "Système de refroidissement liquide",
    SystemeRefroidissementAir = "Système de refroidissement à air",
    VentilateurCPU = "Ventilateur de CPU"
}

// Boîtiers et Accessoires
export enum ComposantsBoitiersAccessoires {
    BoitierOrdinateur = "Boîtier",
    VentilateurBoitier = "Ventilateur de boîtier",
    BoutonAlimentation = "Bouton d'alimentation",
    BoutonReinitialisation = "Bouton de réinitialisation",
    IndicateurLED = "Indicateur LED",
    PortUSB = "Port USB",
    PriseAudio = "Prise audio",
    LecteurCarte = "Lecteur de carte",
    LecteurOptique = "Lecteur optique",
    LecteurCD = "Lecteur de CD"
}

// Périphériques
export enum ComposantsPeripheriques {
    Imprimante = "Imprimante",
    Scanner = "Scanner",
    Copieur = "Copieur",
    Telecopieur = "Télécopieur",
    Tracteur = "Tracteur",
    Projecteur = "Projecteur",
    DisqueDurExterne = "Disque dur externe",
    SSDExterne = "SSD externe",
    HubUSB = "Hub USB",
    StationAccueil = "Station d'accueil"
}

// Périphériques mobiles
export enum ComposantsPeripheriquesMobiles {
    OrdinateurPortable = "Ordinateur portable",
    Netbook = "Netbook",
    Tablette = "Tablette",
    Smartphone = "Smartphone",
    Phablette = "Phablette",
    HotspotMobile = "Hotspot mobile",
    RouteurMobile = "Routeur mobile",
    ChargeurPortable = "Chargeur portable",
    BatterieExterne = "Batterie externe"
}

// Composants de jeu
export enum ComposantsJeu {
    GPU = "GPU",
    ClavierJeu = "Clavier de jeu",
    SourisJeu = "Souris de jeu",
    CasqueJeu = "Casque de jeu",
    ControleurJeu = "Contrôleur de jeu",
    ChaiseJeu = "Chaise de jeu",
    EcranJeu = "Écran de jeu",
    OrdinateurJeu = "Ordinateur de jeu",
    BureauJeu = "Bureau de jeu",
    CasqueVR = "Casque VR"
}

// Composants de serveur et de stockage
export enum ComposantsServeurStockage {
    CarteMereServeur = "Carte mère de serveur",
    ProcesseurServeur = "Processeur de serveur",
    MemoireViveServeur = "Mémoire vive de serveur",
    DisqueDurServeur = "Disque dur de serveur",
    SSDServeur = "SSD de serveur",
    NAS = "NAS",
    SAN = "SAN",
    RAID = "RAID",
    LecteurBande = "Lecteur de bande",
    JukeboxOptique = "Jukebox optique"
}

// Composants de sécurité
export enum ComposantsSecurite {
    PareFeu = "Pare-feu",
    LogicielAntivirus = "Logiciel antivirus",
    LogicielAntiMalware = "Logiciel anti-malware",
    LogicielChiffrement = "Logiciel de chiffrement",
    VPN = "VPN",
    SSL = "SSL",
    TLS = "TLS",
    LecteurEmpreinteDigitale = "Lecteur d'empreinte digitale",
    LecteurCartePuces = "Lecteur de carte à puce",
    LecteurCarteIntelligente = "Lecteur de carte intelligente"
}

// Composants audio et vidéo
export enum ComposantsAudioVideo {
    CarteSon = "Carte son",
    InterfaceAudio = "Interface audio",
    Microphone = "Microphone",
    HautParleur = "Haut-parleur",
    CasqueAudio = "Casque audio",
    Webcam = "Webcam",
    CarteCaptureVideo = "Carte de capture vidéo",
    CarteTunerTV = "Carte tuner TV",
    AmplificateurAudio = "Amplificateur audio",
    AmplificateurVideo = "Amplificateur vidéo"
}

// Autres composants
export enum AutresComposants {
    CapteurTemperature = "Capteur de température",
    CapteurHumidite = "Capteur d'humidité",
    CapteurMouvement = "Capteur de mouvement",
    CapteurLumiere = "Capteur de lumière",
    CapteurProximite = "Capteur de proximité",
    Accelerometre = "Accéléromètre",
    Gyroscope = "Gyroscope",
    Magnetometre = "Magnétomètre",
    Barometre = "Baromètre",
    Hygrometre = "Hygromètre"
}

// Accessoires d'ordinateur
export enum AccessoiresOrdinateur {
    TapisSouris = "Tapis de souris",
    CouvertureClavier = "Couverture de clavier",
    ProtegeEcran = "Protège-écran",
    SupportOrdinateurPortable = "Support d'ordinateur portable",
    LampeBureau = "Lampe de bureau",
    ChaiseErgonomique = "Chaise ergonomique",
    KitNettoyageOrdinateur = "Kit de nettoyage d'ordinateur",
    SystemeGestionCables = "Système de gestion de câbles",
    ProtecteurSurtension = "Protecteur de surtension",
    StripPuissance = "Strip de puissance"
}

// Équipements de réseau
export enum EquipementsReseau {
    Routeur = "Routeur",
    Commutateur = "Commutateur",
    Modem = "Modem",
    PointAccesWiFi = "Point d'accès Wi-Fi",
    RepeteurWiFi = "Répéteur Wi-Fi",
    BridgeReseau = "Bridge réseau",
    Gateway = "Gateway",
    ServeurDNS = "Serveur DNS",
    ServeurDHCP = "Serveur DHCP",
    ServeurFichiers = "Serveur de fichiers"
}

// Composants de téléphonie
export enum ComposantsTelephonie {
    Telephone = "Téléphone",
    TelephoneIP = "Téléphone IP",
    BoitierTelephone = "Boîtier de téléphone",
    CarteSIM = "Carte SIM",
    CarteSD = "Carte SD",
    Antenne = "Antenne",
    ReseauTelephonieMobile = "Réseau de téléphonie mobile",
    RouteurTelephonie = "Routeur de téléphonie",
    CommutateurTelephonie = "Commutateur de téléphonie",
    ServeurTelephonie = "Serveur de téléphonie"
}

// Composants de sécurité physique
export enum ComposantsSecuritePhysique {
    CameraSurveillance = "Caméra de surveillance",
    SystemeAlarme = "Système d'alarme",
    DetecteurMouvement = "Détecteur de mouvement",
    DetecteurFumee = "Détecteur de fumée",
    DetecteurIntrusion = "Détecteur d'intrusion",
    SystemeControleAcces = "Système de contrôle d'accès",
    LecteurEmpreinteDigitale = "Lecteur d'empreinte digitale",
    LecteurCartePuces = "Lecteur de carte à puce",
    LecteurCarteIntelligente = "Lecteur de carte intelligente",
    SystemeSurveillanceVideo = "Système de surveillance vidéo"
}

// Composants de stockage
export enum ComposantsStockage {
    DisqueDur = "Disque dur",
    SSD = "SSD",
    DisqueFlash = "Disque flash",
    CarteMemoire = "Carte mémoire",
    LecteurCarte = "Lecteur de carte",
    StockageReseau = "Stockage en réseau",
    SystemeStockageNuage = "Système de stockage en nuage",
    ServeurStockage = "Serveur de stockage",
    BaieStockage = "Baie de stockage",
    ChassisStockage = "Chassis de stockage"
}

// Composants de système
export enum ComposantsSysteme {
    SystemeExploitation = "Système d'exploitation",
    Noyau = "Noyau",
    Pilote = "Pilote",
    Firmware = "Firmware",
    Micrologiciel = "Micrologiciel"
}
