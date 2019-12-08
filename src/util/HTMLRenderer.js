import ReactDOM from 'react-dom'

import { dpi } from '../config'

export default class HTMLRenderer {
  static dummyCanvas;
  static offscreenCanvas;

  static getDummyCanvas() {
    if(!HTMLRenderer.dummyCanvas) {
      HTMLRenderer.dummyCanvas = document.createElement('canvas');
      HTMLRenderer.dummyCanvas.width = HTMLRenderer.dummyCanvas.height = 1;
    }
    return HTMLRenderer.dummyCanvas;
  }

  static AwaitImageLoad(url, size) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      // img.width = size[0];
      // img.height = size[1];
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    });
  }

  static async renderImage(url, size) {
    let img = await HTMLRenderer.AwaitImageLoad(url, size);
    let canvas = document.createElement('canvas');
    canvas.className = "html-render-container";
    document.body.appendChild(canvas); 
    canvas.width = size[0] * dpi;
    canvas.height = size[1] * dpi;
    let ctx = canvas.getContext("2d");
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(150, 150);
    // ctx.stroke();
    ctx.drawImage(img, 0, 0, size[0], size[1]);
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    document.body.removeChild(canvas);
    return pixels;
  }
}
