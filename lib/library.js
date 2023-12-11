// 通用的功能性function
const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const $each = (e, f) => $$(e).forEach((e) => f(e));

/**
 * @param {HTMLCanvasElement} cvs 处理的画布
 * @param {Boolean} bol 是否执行Transfrom
 * @returns null
 */
CanvasFix = (cvs, bol = true) => {//仅适用于box-sizing: content-box;
    let ctx = cvs.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    let t = dpr / bsr;
    CanvasAutoSize(cvs);
    cvs.width *= t;
    cvs.height *= t;
    if (bol) ctx.transform(t, 0, 0, t, 0, 0);
}

CanvasAutoSize = (cvs) => {
    cvs.style.width = cvs.width + "px";
    cvs.style.height = cvs.height + "px";
}

var Rec = (r, theta) => {
    return [Math.cos(theta) * r, Math.sin(theta) * r];
}

var Pol = (x, y) => {
    return [Math.sqrt(x * x + y * y), Math.atan2(y, x) % 360];
}

function insertAfter(targetElement, newElement) {
    let parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}