(function (window) {
  window.__env = window.__env || {};
  window.__env.apiUrlMetiers = 'http://localhost:8888/achat/api/';
  window.__env.apiUrlkernel = 'https://kernel.picosoft.biz/kernel-v1/api/';
  window.__env.enableDebug = true;
  window.__env.apiUrlpostal = 'http://localhost.picosoft.biz:4301';

  //URL Application Kernel
  window.__env.apiUrlfrontkernel = 'https://kernel.picosoft.biz/kernel-v1/';
  window.__env.versionFront = 1;
  window.__env.versionBack = 0;
  window.__env.pstkRunnigTimer = 0
  window.__env.apiBackPSSIGN = 'https://pssign.picosoft.biz/demo-v1/api/';
  window.__env.PSSIGNAPPNAME = 'PSSIGN';
  window.__env.apiFrontPSSIGN= 'http://localhost.picosoft.biz:4210/#/';

  //Date Formatting Patterns
  window.__env.D = "DD/MM/YY";
  window.__env.DFSHORTT = "DD/MM HH:mm";
  window.__env.DFT = "DD/MM/YY HH:mm";
  window.__env.T = "HH:mm";
  window.__env.DS = "DD/MM";
  //Tostor
  window.__env.extendedTimeOutToastr = 5000;
  window.__env.timeOutToastr = 15000;

  //pagination

  window.__env.stateStoring = true;
  window.__env.ITEMS_PER_PAGE = 20
//    CLOUD MSI PSK
  window.__env.cloudMsiPSTK = "https://cloud.picosoft.biz/share.cgi?ssid=1799fbe7ddca41d8946dca6950ad8793&openfolder=forcedownload&ep=&_dc=1672759301595&fid=1799fbe7ddca41d8946dca6950ad8793&filename=PSTK%202.20%20.msi"/*v 2.20*/
  window.__env.pstkport = "7777"
  //***************************** URL PCTOOLKIT *******************************/
  window.__env.pstoolkitURLhttps = "https://127.0.0.1:"
  window.__env.pstoolkitURLhttp = "http://127.0.0.1:5555/"
//    file
  window.__env.maxUploadMultiPartFile = 178257920 // cad en octet === 170 Mo

  window.__env.moduleNameKernel = "Kernel"
  window.__env.theme = 'sndp';
  window.__env.defaultCountry = 'Tunisie'
}(this));
