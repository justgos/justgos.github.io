import ReactDOM from 'react-dom'
import html2canvas from 'html2canvas'
import * as htmlToImage from 'html-to-image';

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

  static getOffscreenCanvas() {
    if(!HTMLRenderer.offscreenCanvas) {
      HTMLRenderer.offscreenCanvas = document.createElement('canvas');
      HTMLRenderer.offscreenCanvas.className = "html-render-container";
      // const dpi = window.devicePixelRatio || 1
      // HTMLRenderer.offscreenCanvas.scale = dpi;
      // HTMLRenderer.offscreenCanvas.width = HTMLRenderer.dummyCanvas.height = 1024;
      document.body.appendChild(HTMLRenderer.offscreenCanvas); 
    }
    return HTMLRenderer.offscreenCanvas;
  }

  static async render(children) {
    const tmpContainer = document.createElement("div");
    tmpContainer.className = "html-render-container";
    document.body.appendChild(tmpContainer);
    await ReactDOM.render(children, tmpContainer);
    const canvas = await html2canvas(tmpContainer, {backgroundColor: null});
    await ReactDOM.unmountComponentAtNode(tmpContainer);
    document.body.removeChild(tmpContainer);
    // document.body.appendChild(canvas);
    return canvas;
  }

  static async render2(children) {
    let t1 = performance.now();
    const tmpContainer = document.createElement("div");
    tmpContainer.className = "html-render-container";
    document.body.appendChild(tmpContainer);
    await ReactDOM.render(children, tmpContainer);
    const size = [ tmpContainer.scrollWidth, tmpContainer.scrollHeight ];
    const pixels = await htmlToImage.toPixelData(children, {width: children.scrollWidth * dpi, height: children.scrollHeight * dpi, backgroundColor: null});
    // console.log('pixels', pixels.filter(px => px > 0));
    await ReactDOM.unmountComponentAtNode(tmpContainer);
    document.body.removeChild(tmpContainer);
    // // document.body.appendChild(canvas);
    console.log('rendering took', performance.now() - t1);
    return [ pixels, size ];
  }

  static async renderInPlace(element) {
    // if(element.tagName === "IMG")
    //   return await HTMLRenderer.renderImage(element);

    const tmpContainer = document.createElement("div");
    tmpContainer.className = "html-render-container";
    let elementClone = element.cloneNode(true);
    elementClone.style.visibility = "visible";
    document.body.appendChild(tmpContainer);
    tmpContainer.appendChild(elementClone);
    // element.style.visibility = "visible";
    const canvas = await html2canvas(tmpContainer, {backgroundColor: null});
    // element.style.removeProperty("visibility");
    document.body.removeChild(tmpContainer);
    return canvas;
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
    // const tmpContainer = document.createElement("div");
    // tmpContainer.className = "html-render-container";
    // // let elementClone = element.cloneNode(true);
    // // img.style.visibility = "visible";
    // document.body.appendChild(tmpContainer);
    // tmpContainer.appendChild(img);

    // element.style.visibility = "visible";
    // console.log('img', img)

    // const size = [ tmpContainer.offsetWidth, tmpContainer.offsetHeight ];

    // TODO: maybe use a pool of canvases
    // let canvas = HTMLRenderer.getOffscreenCanvas();
    let canvas = document.createElement('canvas');
    canvas.className = "html-render-container";
    // const dpi = window.devicePixelRatio || 1
    // HTMLRenderer.offscreenCanvas.scale = dpi;
    // HTMLRenderer.offscreenCanvas.width = HTMLRenderer.dummyCanvas.height = 1024;
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
    // console.log('pixels', pixels.length)

    // element.style.visibility = "hidden";
    // element.style.removeProperty("visibility");

    document.body.removeChild(canvas);
    return pixels;
  }
}
