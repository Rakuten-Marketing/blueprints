(function () {
  var dropdownProto = Object.create(HTMLElement.prototype);

  var dropdownButtonTemplate = '<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>';
  var dropdownAnchorTemplate = '<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>';
  var iconTemplate = '<span class="caret"></span>';

  var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                 navigator.userAgent && !navigator.userAgent.match('CriOS');

  dropdownProto.createdCallback = function () {
    if (this.getAttribute("example")) {
      this.removeAttribute("example");
      return;
    }
    var temp = document.createElement('DIV');
    this.list = this.children[0];
    this.list.classList.add('dropdown-menu');
    if (this.hasAttribute("title")) {
      temp.innerHTML = dropdownButtonTemplate;
      temp.children[0].innerHTML = this.getAttribute("title");
    } else {
      temp.innerHTML = dropdownAnchorTemplate;
    }
    this.button = temp.children[0];
    this.button.innerHTML += iconTemplate;
    if (this.hasAttribute("icon")) {
      this.button.getElementsByTagName("span")[0].setAttribute("class", this.getAttribute("icon"));
    }
    if (this.hasAttribute("id")) {
      var id = this.getAttribute("id") + "-button";
      this.button.setAttribute('id', id);
      this.list.setAttribute('aria-labelledby', id);
    }
    this.insertBefore(this.button, this.list);
    this.classList.add('dropdown');
    this.animating = false;
    this.open = false;
  };
    
  dropdownProto.attachedCallback = function () {
    if (!this.list) return;
    this.addEventListener('click', handleClick.bind(this));
    document.addEventListener('click', this.closeDropdown.bind(this));
    this.list.addEventListener("transitionend", this.listAnimated.bind(this));
    this.list.addEventListener("webkitTransitionEnd", this.listAnimated.bind(this));
    this.list.addEventListener("MSTransitionEnd", this.listAnimated.bind(this), false);
    this.list.addEventListener("otransitionend", this.listAnimated.bind(this), false);
  };

  dropdownProto.removedCallback = function () {
    this.removeEventListener('click', handleClick);
    document.removeEventListener('click', this.closeDropdown);
    this.list.removeEventListener("transitionend", this.listAnimated);
    this.list.removeEventListener("webkitTransitionEnd", this.listAnimated);
    this.list.removeEventListener("MSTransitionEnd", this.listAnimated, false);
    this.list.removeEventListener("otransitionend", this.listAnimated, false);
  };

  dropdownProto.attributeChangedCallback = function (name, oldVal, newVal) {
    switch (name) {
      case "title":
        var icon = this.button.getElementsByTagName("span")[0];
        this.button.innerHTML = newVal;
        this.button.appendChild(icon);
        break;
      case "icon":
        this.button.getElementsByTagName("span")[0].setAttribute("class", newVal);
    }
  };

  function handleClick(e) {
    e.stopPropagation();
    if (insideElementWithClass('dropdown-toggle', e.target)) {
      this.dropdown();
    }

    function insideElementWithClass(search, el) {
      if (el.classList.contains(search)) return true;
      if (!el.parentElement) return false;
      return insideElementWithClass(search, el.parentElement);
    }
  }

  function hasHeightTransition(el) {
    return ["height", "all"].indexOf(window.getComputedStyle(el).transitionProperty) != -1;
  }

  dropdownProto.dropdown = function () {
    if (this.open) {
      this.closeDropdown();
      return;
    }
    this.openDropdown();
  };

  dropdownProto.closeDropdown = function () {
    if (this.animating || !this.open) return;
    this.animating = true;
    this.open = false;
    this.classList.add('open'); //to coexist with jQuery/bootstrap.js
    this.list.style.height = this.list.offsetHeight + "px";
    this.button.setAttribute('aria-expanded', false);
    var wait = window.setInterval(function () {
      if (!hasHeightTransition(this.list)) return;
      window.clearInterval(wait);
      this.list.style.height = "0px";
    }.bind(this), 5);
  };

  dropdownProto.openDropdown = function () {
    if (this.animating || this.open) return;
    this.animating = true;
    this.open = true;
    this.list.style.transition = "none";
    this.classList.add("open");
    var height = this.list.offsetHeight + "px";
    this.list.style.height = "0px";
    this.list.style.transition = null;
    this.button.setAttribute('aria-expanded', true);
    var wait = window.setInterval(function () {
      if (!hasHeightTransition(this.list)) return;
      window.clearInterval(wait);
      this.list.style.height = height;
    }.bind(this), 5);
  };

  dropdownProto.listAnimated = function () {
    if (this.list.style.height == "0px") {
      this.classList.remove('open');
      this.list.style.removeProperty("height");
    }
    else if (!isSafari) {
      this.list.style.removeProperty("height");
    } 
    this.animating = false;
  };

  var dropdown = document.registerElement('bp-dropdown', {
    prototype: dropdownProto
  });
})();