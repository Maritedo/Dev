var err_input = null;
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
    var elem = e.srcElement;
    var file = elem.files[0];
    if (file && file.type && !/image\/\w+/.test(file.type)) {
      alert("格式错误！");
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

var initDefault = () => {
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
};

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

var removerAllOptions = (e) => {
  e.options.length = 1;
};

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

var onBlurHandler = (e) => {
  verify(e.srcElement, true);
};

var onFocusHandler = (e) => {
  elem = e.srcElement;
  val = elem.value;
  elem.classList.remove("error");
};

var onClickHandler = (e) => {};

var onHoverHandler = (e) => {};

var navError = () => {
  if (err_input) {
    err_input.focus();
    err_input = null;
  }
};

var showWarning = (msg) => {
  $("#notif").classList.remove("hidden");
  $("#notif_msg").innerText = msg;
};

var closeWarning = () => {
  $("#notif").classList.add("hidden");
};

var verify = (elem, allowBlank = false) => {
  val = elem.value;
  if (rules[elem.id] && ruleTest(rules[elem.id], val, allowBlank)) {
    showWarning(err_ls);
    err_input = elem;
    elem.classList.add("error");
    return false;
  } else {
    closeWarning();
    return true;
  }
};

var finalCheck = () => {
  var bol = true;
  var checkItems = $$("form table input");
  for (var _i in checkItems) {
    var ele = checkItems[_i];
    if (!verify(ele, (allowBlank = false))) {
      bol = false;
      break;
    }
  }
  if (
    province.selectedIndex == 0 ||
    city.selectedIndex == 0 ||
    region.selectedIndex == 0
  ) {
    showWarning("未选择籍贯");
    bol = false;
  }
  return bol;
};

var formReset = () => {
  // $$("form input:not([type='button']):not([type='submit'])").forEach((ele) => {
  //     ele.value = '';
  //     if (ele.checked)
  //         ele.checked = false;
  //     ele.classList.remove('error');
  // });
  $("canvas[verification]").verification.refresh();
  avatorDisp
    .getContext("2d")
    .clearRect(0, 0, avatorDisp.width, avatorDisp.height);
  initLocSelect();

  dateSelec.valueAsDate = new Date();
};
