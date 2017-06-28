(function () {
  var dropdown = Object.create(HTMLElement.prototype);

  /* ---------- Private functions ---------- */
  // Getting the parts of this webcomponent
  // The element that toggles the dropdown can be any HTMLELement yet needs to include the
  // [data-toggle="dropdown"] attribute. The menu only requires a classname (.dropdown-menu)
  function getHTMLElements() {
    var options = {
      button: this.querySelector('[data-toggle="dropdown"]'),
      menu: this.querySelector('.dropdown-menu')
    };

    options.open = false;
    options.validImplementation = Boolean(options.button && options.menu);
    if (options.validImplementation) {
      if (!options.button.hasAttribute('aria-haspopup')) {
        options.button.setAttribute('aria-haspopup', 'true');
      }

      if (!options.button.hasAttribute('aria-expanded')) {
        options.button.setAttribute('aria-expanded', 'false');
      }

      if (!this.hasAttribute('data-open')) {
        this.setAttribute('data-open', false);
      } else {
        options.open = (this.attributes['data-open'].value).toLowerCase();
        options.open = options.open === 'true';
        options.button.setAttribute('aria-expanded', options.open);
      }
    }

    return options;
  }

  function heightTransition() {
    var element = this.options.menu;
    var height = element.scrollHeight;

    if (this.options.open) {
      element.style.height = height + 'px';
      element.addEventListener('transitionend', function(event) {
        // Remove this event listener so it only gets triggered once
        element.removeEventListener('transitionend', arguments.callee);
      });
    } else {
      // Temporarily disable all css transitions
      var transition = element.style.transition;
      element.style.transition = '';

      // on the next frame (as soon as the previous style change has taken effect),
      // explicitly set the element's height to its current pixel height, so we 
      // aren't transitioning out of 'auto'
      requestAnimationFrame(function() {
        element.style.height = height + 'px';
        element.style.transition = transition;
  
        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function() {
          element.style.height = 0 + 'px';
        });
      });
    }
  }

  // Self descriptive function
  // On "click" event toggles (public function) the status of the dropdown
  function clickHandler(event) {
    event.stopPropagation();
    this.dropdown();
  }

  // Self descriptive function
  // If the dropdown window is "open" this function will dismiss it after clicking outside that window
  function dismissHandler(event) {
    if (!this.options.attachedEvents) return false;
    if (!this.options.open) { return false; }

    var target = this.options.menu;
    var button = this.options.button;

    // The click occurs in the button (trigger), we don't want to do anything there
    // We have an event handler for such action
    if (button.contains(event.target)){
      return false;
    }

    // The click occurs outside the dropdown
    if (!target.contains(event.target)) {
      this.dropdown(false);
    }
  }

  /* ---------- Public functions ---------- */
  // Initializes the element; performing basic functions (geeting the interactive elements)
  // This function can be used as a "re-initialize" method
    /******************** REVIEWING NOW ********************/
  dropdown.init = function () {
    var attrs = this.attributes;

    if (!this.options.validImplementation) { return false; }
    if (this.options.hasOwnProperty('attachedEvents') && this.options.attachedEvents) {
      this.removedCallback();
    }

    this.options.attachedEvents = true;
    this.options.button.addEventListener('click', clickHandler.bind(this), false);
    document.addEventListener('click', dismissHandler.bind(this), false);

    // Taking care of the scenario where initially we want to show the dropdown collapsed (as open)
    // Technically all dropdowns will start as "closed", here you will see we actually set the open attribute to false
    // so we can manually trigger the 'open:function' and pass the condition that will stop the code flow
    if (this.options.open) {
      this.options.open = false;
      this.openDropdown();
    }
  };

  // Toggles the state (closed/open) of the dropdown, formerly 'toggle:function(internal)'
  // Default behavior of the button (click event) but programmatically accessible
  dropdown.dropdown = function (definedByUser) {
   if (typeof definedByUser === 'boolean') {
     if (definedByUser === this.options.open) return false;
   }

    this.options.open = (typeof definedByUser === 'boolean') ? definedByUser : !this.options.open;
    this.options.button.setAttribute('aria-expanded', this.options.open);
    this.setAttribute('data-open', this.options.open);
    this.classList.toggle('open');

    if (!this.classList.contains('has-fade-animation')) {
      heightTransition.call(this);
    }

  };

  // Closing the dropdown, formerly 'close:function()'
  // This function has its value when programmatically executed
  dropdown.closeDropdown = function () {
    if (!this.options.open) return;
    this.dropdown(false);
  };

  // Opening the dropdown, formerly 'open:function()'
  // This function has its value when programmatically executed
  dropdown.openDropdown = function () {
    if (this.options.open) return;
    this.dropdown(true);
  };

  /* ---------- Element registration function (webcomponent) ---------- */
  dropdown.createdCallback = function () {
    // Making this webcomponent "highlighted code" friendly (such as hljs)
    // Also stopping execution if the webcomponent is empty
    if (!this.parentNode.attributes.hasOwnProperty('code-example') && this.hasChildNodes()) {
      this.options = getHTMLElements.call(this);
      this.init();
    }
  };

  // Edge case not covered: when the user manually changes the attribute to non-sense
  // the attribute should be forced back to its previous value (phase 2: where we use that attribute to gets the state)
  dropdown.attributeChangedCallback = function(name, previousValue, value) {
    if (!this.options) { return false; }
    if (name === 'data-open') {
      value = value.toLowerCase();
      if (value !== String(this.options.open) && (value === 'true' || value === 'false')) {
        this.dropdown((value === 'true') ? true : false);
      }
    }
  };

  dropdown.removedCallback = function () {
    if (!this.options.attachedEvents) return false;

    this.options.attachedEvents = false;
    document.removeEventListener('click', dismissHandler.bind(this), false);
    this.options.button.removeEventListener('click', clickHandler.bind(this), false);
  };

  var webcomponent = document.registerElement('bp-dropdown', {
    prototype: dropdown
  });
})();