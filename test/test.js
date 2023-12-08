var cvs, verification, info, leng, size;
window.onload = () => {
    cvs = $("canvas[verification]");
    leng = $("#len");
    size = $("#siz");
    cvs.setAttribute("v-len", leng.value);
    cvs.setAttribute("v-size", size.value);
    verification = new Verification(cvs);
    info = $("#info");
    cvs.verification = verification.init();
    (cvs.onclick = () => {
        if (verification.anim) {
            verification.generate().draw()
        } else {
            verification.refresh();
        }
    })();
    verification.refresh();
    update();
}

onToggleDebug = () => {
    verification.showDebug = !verification.showDebug;
    if (!verification.anim) verification.draw();
    update();
}

onToggleCache = () => {
    verification.useCache = !verification.useCache;
    update();
}

onToggleAnim = () => {
    verification.anim = !verification.anim;
    if (verification.anim) verification.refresh();
    update();
}

onSizeInput = () => {
    update();
}

onSizeChange = () => {
    cvs.setAttribute('v-size', size.value);
    verification.init();
    if (!verification.anim) verification.refresh();
    update();
}

onLengInput = () => {
    update();
}

onLengChange = () => {
    cvs.setAttribute('v-len', leng.value);
    verification.init();
    if (!verification.anim) verification.refresh();
    update();
}

update = () => {
    info.innerText = `长度: ${leng.value},高度: ${size.value}\n测试图层: ${verification.showDebug ? '是' : '否'}\n使用缓存: ${verification.useCache ? '是' : '否'}\n使用动画: ${verification.anim ? '是' : '否'}`;
}