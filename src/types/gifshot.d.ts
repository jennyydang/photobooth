declare module 'gifshot' {
  interface GifshotOptions {
    images?: string[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    fontWeight?: string;
    fontSize?: string;
    fontFamily?: string;
    fontColor?: string;
    text?: string;
    textAlign?: string;
    textBaseline?: string;
    textXCoordinate?: number | null;
    textYCoordinate?: number | null;
    progressCallback?: (captureProgress: number) => void;
    completeCallback?: () => void;
    saveRenderingContexts?: boolean;
    savedRenderingContexts?: CanvasRenderingContext2D[];
    showFrameText?: boolean;
    crossOrigin?: string;
    waterMark?: HTMLElement | null;
    waterMarkHeight?: number;
    waterMarkWidth?: number;
    waterMarkXCoordinate?: number;
    waterMarkYCoordinate?: number;
    sampleInterval?: number;
    numWorkers?: number;
    filter?: string;
    frameRate?: number;
    quality?: number;
    cameraStream?: MediaStream;
    keepCameraOn?: boolean;
    flip?: boolean;
    rotate?: number;
    crop?: { x: number; y: number; width: number; height: number };
  }

  interface GifshotResult {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image?: string;
    cameraStream?: MediaStream;
    savedRenderingContexts?: CanvasRenderingContext2D[];
  }

  function createGIF(
    options: GifshotOptions,
    callback: (result: GifshotResult) => void
  ): void;

  function isWebCamSupported(): boolean;
  function takeSnapShot(
    options: GifshotOptions,
    callback: (result: GifshotResult) => void
  ): void;
  function stopVideoStreaming(stream: MediaStream): void;
}
