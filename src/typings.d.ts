declare var jQuery: any;
interface Document {
    exitFullscreen(): void;
    fullscreenElement: Element;
    msExitFullscreen(): void;
    msFullscreenElement: Element;
    mozCancelFullScreen(): void;
    mozFullScreenElement(): void;
    webkitFullscreenElement: Element;
    webkitExitFullscreen(): void;
    webkitCancelFullScreen(): void;  
}