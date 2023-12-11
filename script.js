var province, city, region, dateSelec, avatorDisp;

window.onload = () => {
  province = $("#address_province");
  city = $("#address_city");
  region = $("#address_region");
  dateSelec = $("#birthday");
  avatorDisp = $("#display");
  province.addEventListener("change", changed[1]);
  city.addEventListener("change", changed[0]);

  initDefault();
  initLocSelect();

  CanvasFix($("canvas#display"), false);

  $("#avatorFile").addEventListener("change", (e) => {
    var elem = e.target;
    var file = elem.files[0];
    if (file && file.type) {
      if (!/image\/\w+/.test(file.type)) {
        alert("格式错误！");
        return;
      }
    } else {
      alert("文件错误");
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      var ctx = avatorDisp.getContext("2d");
      var img = new Image();
      img.src = reader.result;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, avatorDisp.width, avatorDisp.height);
        $("#avatorData").value = avatorDisp.toDataURL();
      };
    };
  });

  $$("canvas[verification]").forEach((cvs) => {
    verification = new Verification(cvs);
    cvs.verification = verification.init();
    verification.refresh();
    cvs.addEventListener("click", (e) => {
      e.preventDefault();
      cvs.verification.refresh();
      verify($("#verification"), true);
    });
  });
};

function initDefault() {
  $$("table input").forEach((ele) => {
    ele.addEventListener("blur", onBlurHandler);
    ele.addEventListener("focus", onFocusHandler);
  });

  //无障碍功能恢复
  $$("span.checkbox").forEach((ele) => {
    ele.setAttribute("tabindex", "0");
    ele.addEventListener("keyup", (e) => {
      if (e.keyCode == 13 || e.keyCode == 32) {
        ele.parentElement.click();
      }
    });
  });

  //无障碍功能恢复
  $$("a.clickable").forEach((ele) => {
    ele.setAttribute("tabindex", "0");
    ele.addEventListener("keyup", (e) => {
      if (e.keyCode == 13 || e.keyCode == 32) {
        ele.click();
      }
    });
  });
}

var changed = [
  function (e) {
    //市
    region.disabled = false;
    removerAllOptions(region);
    selectedProvince = province.selectedOptions[0].value;
    selectedCity = city.selectedOptions[0].value;
    for (var opt in china_locs[selectedProvince][selectedCity]) {
      opt = china_locs[selectedProvince][selectedCity][opt];
      region.add(new Option(opt, opt));
    }
    re[0](e);
  },
  function (e) {
    //省
    city.disabled = false;
    removerAllOptions(city);
    removerAllOptions(region);
    selectedProvince = province.selectedOptions[0].value;
    for (var opt in china_locs[selectedProvince]) {
      city.add(new Option(opt, opt));
    }
    re[1](e);
  },
];
var re = [
  function (e) {
    //市
    selectedProvince = province.selectedOptions[0].value;
    selectedCity = city.selectedOptions[0].value;
    if (region.options.length == 2) {
      region.selectedIndex = 1;
      region.selectedOptions = [region.options[1]];
      region.disabled = true;
    } else region.selectedIndex = 0;
  },
  function (e) {
    //省
    selectedProvince = province.selectedOptions[0].value;
    if (city.options.length == 2) {
      city.selectedIndex = 1;
      city.selectedOptions = [city.options[1]];
      city.disabled = true;
      changed[0](e);
    } else {
      city.selectedIndex = 0;
      region.disabled = true;
    }
  },
];

function removerAllOptions(e) {
  e.options.length = 1;
}

var initLocSelect = function () {
  removerAllOptions(province);
  removerAllOptions(city);
  removerAllOptions(region);
  for (var i in china_locs) province.add(new Option(i, i));
  province.disabled = false;
  province.selectedIndex = 0;
  city.disabled = true;
  city.selectedIndex = 0;
  region.disabled = true;
  region.selectedIndex = 0;
  dateSelec.valueAsDate = new Date();
};

function onBlurHandler(e) {
  let last;
  if (verify(e.target, true) && (last = verifStates.get(e.target))) {
    last();
  }
}

function onFocusHandler(e) {
  let elem = e.target, last;
  if ((last = verifStates.get(elem)))
    last();
  elem.classList.remove("error");
}

function onClickHandler(e) { }

function onHoverHandler(e) { }

// 避免重复弹出气泡
const verifStates = new WeakMap();

function verify(elem, allowBlank = false) {
  val = elem.value;
  let result;
  if (rules[elem.id] && (result = ruleTest(rules[elem.id], val, allowBlank))) {
    let lastMsgBox;
    if ((lastMsgBox = verifStates.get(elem)))
      lastMsgBox();
    verifStates.set(elem, showMsgAfter(elem, result, () => {
      elem.focus();
      elem.scrollIntoView();
    }));
    elem.classList.add("error");
    return false;
  }
  return true;
}

function finalCheck() {
  var bol = true;
  var checkItems = $$("form table input");
  for (var _i in checkItems) {
    var ele = checkItems[_i];
    if (!verify(ele, (allowBlank = false))) {
      return false;
    }
  }
  [province, city, region].find(elem => {
    if (elem.selectedIndex == 0) {
      let lastMsgBox;
      if ((lastMsgBox = verifStates.get(elem)))
        lastMsgBox();
      verifStates.set(elem, showMsgAfter(elem, '未选择籍贯'));
      bol = false;
      return true
    }
  })
  return bol;
}

function formReset() {
  $("canvas[verification]").verification.refresh();
  avatorDisp
    .getContext("2d")
    .clearRect(0, 0, avatorDisp.width, avatorDisp.height);
  initLocSelect();
  dateSelec.valueAsDate = new Date();
}

function showMsgAfter(inputEle, msg, callback = undefined) {
  // 容器
  const element = document.createElement("div");
  element.classList.add("indicater", "hidden", "left");
  element.style.zIndex = 1000000;
  // 文本
  const text = document.createElement("p");
  text.innerText = msg;
  // 将文本加入容器
  element.appendChild(text);
  // 将容器插入到DOM中显示
  insertAfter(inputEle, element);
  // 延时显示，删除hidden css类让信息框显示出来
  setTimeout(() => {
    element.classList.remove("hidden");
  }, 10);
  // 监听器，用于元素淡出动画完成时将元素从布局流删除
  const _dispose = () => {
    element.addEventListener("transitionend", function _listener(e) {
      // if (e.propertyName != "opacity") return;
      if (element.parentElement) {
        element.parentElement.removeChild(element);
        element.onclick = undefined;
        element.removeEventListener("transiotionend", _listener);
      }
    });
    element.classList.add("hidden");
  };
  element.onclick = () => {
    _dispose();
    callback && callback();
  };
  return _dispose;
}

