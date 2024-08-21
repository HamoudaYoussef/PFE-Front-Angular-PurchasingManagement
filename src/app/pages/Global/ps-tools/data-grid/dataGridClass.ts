import {EnvService} from "../../../../../env.service";

export class DataGrid {
    get select() {
        return this._select;
    }

    set select(value) {
        this._select = value;
    }
    get dataSource() {
        return this._dataSource;
    }

    set dataSource(value) {
        this._dataSource = value;
    }
    get showCellTemplateIndex(): boolean {
        return this._showCellTemplateIndex;
    }

    set showCellTemplateIndex(value: boolean) {
        this._showCellTemplateIndex = value;
    }


    get onSelectionChanged() {
        return this._onSelectionChanged;
    }

    set onSelectionChanged(value) {
        this._onSelectionChanged = value;
    }
    get key() {
        return this._key;
    }

    set key(value) {
        this._key = value;
    }
    get onInitNewRow() {
        return this._onInitNewRow;
    }

    set onInitNewRow(value) {
        this._onInitNewRow = value;
    }
    get buttonsonActions(): [] {
        return this._buttonsonActions;
    }

    set buttonsonActions(value: []) {
        this._buttonsonActions = value;
    }
    get onRowClick() {
        return this._onRowClick;
    }

    set onRowClick(value) {
        this._onRowClick = value;
    }
    get ButtonsonToolbarPreparing(): [] {
        return this._ButtonsonToolbarPreparing;
    }

    get onCellClick() {
        if(this._onCellClick)
            return this._onCellClick;
    }

    set onCellClick(value) {
        this._onCellClick = value;
    }

    set ButtonsonToolbarPreparing(value: []) {
        this._ButtonsonToolbarPreparing = value;
    }
    get wsButtonDelete(): string {
        return this._wsButtonDelete;
    }

    set wsButtonDelete(value: string) {
        this._wsButtonDelete = value;
    }
    get linkAddButton(): string {
        return this._linkAddButton;
    }

    set linkAddButton(value: string) {
        this._linkAddButton = value;
    }

    get linkSowButton(): string {
        return this._linkSowButton;
    }

    set linkSowButton(value: string) {
        this._linkSowButton = value;
    }
    get linkEditButton(): string {
        return this._linkEditButton;
    }

    set linkEditButton(value: string) {
        this._linkEditButton = value;
    }
    get openEditPage(): string {
        return this._openEditPage;
    }

    set openEditPage(value: string) {
        this._openEditPage = value;
    }
    get modePagination(): string {
        return this._modePagination;
    }

    set modePagination(value: string) {
        this._modePagination = value;
    }
    get useIcons(): boolean {
        return this._useIcons;
    }

    set useIcons(value: boolean) {
        this._useIcons = value;
    }
    get selectTextOnEditStart(): boolean {
        return this._selectTextOnEditStart;
    }

    set selectTextOnEditStart(value: boolean) {
        this._selectTextOnEditStart = value;
    }
    get editingMode(): string {
        return this._editingMode;
    }

    set editingMode(value: string) {
        this._editingMode = value;
    }

    get editingRefreshMode(): string {
        return this._editingRefreshMode;
    }

    set editingRefreshMode(value: string) {
        this._editingRefreshMode = value;
    }

    get wsPost(): string {
        return this._wsPost;
    }

    set wsPost(value: string) {
        this._wsPost = value;
    }

    get wsPut(): string {
        return this._wsPut;
    }

    set wsPut(value: string) {
        this._wsPut = value;
    }

    get wsDelete(): string {
        return this._wsDelete;
    }

    set wsDelete(value: string) {
        this._wsDelete = value;
    }
    get onRowDblClick() {
        return this._onRowDblClick;
    }

    set onRowDblClick(value) {
        this._onRowDblClick = value;
    }


    get allowColumnResizing(): boolean {
        return this._allowColumnResizing;
    }

    set allowColumnResizing(value: boolean) {
        this._allowColumnResizing = value;
    }

    get columnAutoWidth(): boolean {
        return this._columnAutoWidth;
    }

    set columnAutoWidth(value: boolean) {
        this._columnAutoWidth = value;
    }

    get allowColumnReordering(): boolean {
        return this._allowColumnReordering;
    }

    set allowColumnReordering(value: boolean) {
        this._allowColumnReordering = value;
    }
    get showBorders(): boolean {
        return this._showBorders;
    }

    set showBorders(value: boolean) {
        this._showBorders = value;
    }
    get showNavigationButtons(): boolean {
        return this._showNavigationButtons;
    }

    set showNavigationButtons(value: boolean) {
        this._showNavigationButtons = value;
    }
    get selectMode(): string {
        return this._selectMode;
    }

    set selectMode(value: string) {
        this._selectMode = value;
    }
    get focusedRowEnabled(): boolean {
        return this._focusedRowEnabled;
    }

    set focusedRowEnabled(value: boolean) {
        this._focusedRowEnabled = value;
    }
    get returnEvent(): boolean {
        return this._returnEvent;
    }

    set returnEvent(value: boolean) {
        this._returnEvent = value;
    }
    get rowAlternationEnabled(): boolean {
        return this._rowAlternationEnabled;
    }

    set rowAlternationEnabled(value: boolean) {
        this._rowAlternationEnabled = value;
    }

    get env(): EnvService {
        return this._env;
    }

    set env(value: EnvService) {
        this._env = value;
    }
    get scrollingRowRenderingMode(): string {
        return this._scrollingRowRenderingMode;
    }

    set scrollingRowRenderingMode(value: string) {
        this._scrollingRowRenderingMode = value;
    }
    get headerFilter(): boolean {
        return this._headerFilter;
    }

    set headerFilter(value: boolean) {
        this._headerFilter = value;
    }

    get filterRow(): boolean {
        return this._filterRow;
    }

    set filterRow(value: boolean) {
        this._filterRow = value;
    }

    get applyFilter(): boolean {
        return this._applyFilter;
    }

    set applyFilter(value: boolean) {
        this._applyFilter = value;
    }

    get loadPanel(): boolean {
        return this._loadPanel;
    }

    set loadPanel(value: boolean) {
        this._loadPanel = value;
    }

    get columnChooser(): boolean {
        return this._columnChooser;
    }

    set columnChooser(value: boolean) {
        this._columnChooser = value;
    }

    get columnFixing(): boolean {
        return this._columnFixing;
    }

    set columnFixing(value: boolean) {
        this._columnFixing = value;
    }

    get exportFile(): boolean {
        return this._exportFile;
    }

    set exportFile(value: boolean) {
        this._exportFile = value;
    }

    get allowExportSelectedData(): boolean {
        return this._allowExportSelectedData;
    }

    set allowExportSelectedData(value: boolean) {
        this._allowExportSelectedData = value;
    }

    get pager(): boolean {
        return this._pager;
    }

    set pager(value: boolean) {
        this._pager = value;
    }

    get pagerShowInfo(): boolean {
        return this._pagerShowInfo;
    }

    set pagerShowInfo(value: boolean) {
        this._pagerShowInfo = value;
    }

    get showPageSizeSelector(): boolean {
        return this._showPageSizeSelector;
    }

    set showPageSizeSelector(value: boolean) {
        this._showPageSizeSelector = value;
    }
    get typeStoring() {
        return this._typeStoring;
    }

    set typeStoring(value) {
        this._typeStoring = value;
    }
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }
    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }
    get columns(): [] {
        return this._columns;
    }

    set columns(value: []) {
        this._columns = value;
    }
    get allowedPageSizes() {
        return this._allowedPageSizes;
    }

    set allowedPageSizes(value) {
        this._allowedPageSizes = value;
    }
    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        this._pageSize = value;
    }


    get wordWrap(): boolean {
        return this._wordWrap;
    }

    set wordWrap(value: boolean) {
        this._wordWrap = value;
    }

    get stateStoring() {
        return this._stateStoring;
    }

    set stateStoring(value) {
        this._stateStoring = value;
    }

    get urlData(): string {
        return this._urlData;
    }

    set urlData(value: string) {
        this._urlData = value;
    }

    get urlCount(): string {
        return this._urlCount;
    }

    set urlCount(value: string) {
        this._urlCount = value;
    }

    get lazy(): boolean {
        return this._lazy;
    }

    set lazy(value: boolean) {
        this._lazy = value;
    }
    get getData(): (e) => void {
        return this._getData;
    }

    set getData(value: (e) => void) {
        this._getData = value;
    }

    get groupPanel(): boolean {
        return this._groupPanel;
    }

    set groupPanel(value: boolean) {
        this._groupPanel = value;
    }

    private _urlData :string
    private _urlCount:string
    private _lazy :boolean=true
    private _columns:[]
    private _pageSize :number=this._env.pageSize
    private _allowedPageSizes =this._env.allowedPageSizes
    private _stateStoring = true
    private _typeStoring="localStorage"
    private _id:string
    private _title:string
    private _scrollingRowRenderingMode:string ="virtual"
    private _headerFilter:boolean=true
    private _filterRow:boolean=true
    private _applyFilter:boolean=true
    private _loadPanel:boolean=true
    private _columnChooser:boolean=true
    private _columnFixing:boolean=true
    private _exportFile:boolean=true
    private _allowExportSelectedData:boolean=true
    private _pager:boolean=true
    private _pagerShowInfo:boolean=true
    private _showPageSizeSelector:boolean=true
    private _rowAlternationEnabled:boolean=true
    private _returnEvent:boolean=true
    private _focusedRowEnabled:boolean=true
    private _selectMode:string="single"
    private _showNavigationButtons:boolean=true
    private _showBorders:boolean=true
    private _wordWrap:boolean=false
    private _allowColumnResizing:boolean=true
    private _columnAutoWidth:boolean=true
    private _allowColumnReordering:boolean=true
    private _onRowDblClick
    private _select
    private _editingMode:string="row"
    private _editingRefreshMode:string="reshape"//'full', 'reshape', 'repaint'
    private _wsPost:string=""
    private _wsPut:string=""
    private _wsDelete:string=""
    private _selectTextOnEditStart:boolean=true
    private _useIcons:boolean=true
    private _modePagination:string="full"
    private _openEditPage=""
    private _linkEditButton:string=""
    private _linkAddButton:string=""
    private _linkSowButton:string=""
    private _wsButtonDelete:string=""
    private _ButtonsonToolbarPreparing:[]=[]
    private _dataSource
    private _onCellClick=function onCelllClick(e) {}
    private _buttonsonActions:[]=[]
    private _onInitNewRow
    private _key="id"
    private _onSelectionChanged =function onSelectionChanged(e) {}
    private _onRowClick =function onRowClick(e, dataSource) {}
    private _getData=function getData(e) {}
    private _showCellTemplateIndex:boolean=false
    private _pageable:boolean=false
    private _groupPanel:boolean=false
    get pageable(): boolean {
        return this._pageable;
    }

    set pageable(value: boolean) {
        this._pageable = value;
    }

    constructor(private _env:EnvService) {

    }
}
