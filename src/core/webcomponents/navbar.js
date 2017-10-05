(function () {
  var navbar = Object.create(HTMLElement.prototype);
  var defaults = {
    menu: 'navbar-center',
    responsive: true,
    template: false
  };

  // Target element contains specific classname
  function hasClass(element, classname) {
    return (' ' + element.className + ' ').indexOf(' ' + classname + ' ') > -1;
  }

  // Returns a boolean value regarding horizontal collition
  // by default allowing "10px" margin. This function gets the immediate previous and next
  // elements regarding the target element.
  function collisionDetected(node) {
    if (window.getComputedStyle(node, null).display === 'none') return null;
    var target = node.firstElementChild || node;

    var reactiveness = 10;
    var delimiters = {
      previous: node.previousElementSibling || node,
      next: node.nextElementSibling || node
    };

    delimiters.previous = delimiters.previous.getBoundingClientRect();
    delimiters.next = delimiters.next.getBoundingClientRect();
    target = target.getBoundingClientRect();

    return (
      (target.left < (delimiters.previous.right + reactiveness)) ||
      (target.right > (delimiters.next.left + reactiveness))
    );
  }

  // Developers have the option to define what element will be hidden and handled as collapsable
  // Also, using the shadowDOM there is the option to use a custom template for the responsive layout
  function getAttributes() {
    var response = defaults;
    var attrs = this.attributes;

    if (attrs.hasOwnProperty('menu')) {
      response.menu = attrs.menu.value;
    }

    if (attrs.hasOwnProperty('template')) {
      response.template = attrs.template.value;
    }

    if (attrs.hasOwnProperty('responsive')) {
      response.responsive = attrs.responsive.value.toLowerCase() === "true";
    }

    return response;
  }

  // Getting the main menu element (if specified)
  // This element will be moved around to achieve the responsive behavior
  function getOptionsElement() {
    var element = this.querySelector('.' + this.options.menu) || this.querySelector('.' + defaults.menu);

    return element;
  }

  function clickHandler(event) {
    var target = event.currentTarget;
    target.classList.toggle('open');
    this.classList.toggle('open');
  }

  function dismissHandler(event) {
    event.stopPropagation();
    if (!this.options.attachedEvents) return false;

    var target = this.options.menu;
    var button = this.options.button;
    if (button.contains(event.target)) return false;
    if (!target.contains(event.target) && hasClass(this, 'open')) {
      this.options.button.classList.remove('open');
      this.classList.remove('open');
    }
  }

  function scrollingHandler(event) {
    if (!this.options.attachedEvents) return false;
    this.options.button.classList.remove('open');
    this.classList.remove('open');
  }

  function resizeHandler(event) {
    if (!this.options.attachedEvents) return false;

    var collission = collisionDetected(this.options.menu);

    this.options.button.classList.remove('open');
    this.classList.remove('open');
    if (collission === null) return false;
    if (collission) {
      this.classList.add('force-responsiveness');
    } else {
      this.classList.remove('force-responsiveness');
    }
  }

  navbar.attachedCallback = function() {
    // Making this webcomponent "highlighted code" friendly (such as hljs)
    // Also stopping execution if the webcomponent is empty
    if (!this.parentNode.attributes.hasOwnProperty('code-example') && this.hasChildNodes()) {
      this.options = getAttributes.call(this);
      this.setAttributes(this.options);
    }
  };

  // Developers can override these attributes
  // This behavior covers the scenario when the element content changes (templating)
  navbar.setAttributes = function(attrs) {
    var trigger = this.querySelector('.navbar-collapsible') || undefined;

    this.options = attrs;
    this.options.menu = getOptionsElement.call(this);

    // Break execution flow, there is not a valid reference to the "main menu" nor to the "button"
    // Therefore there is nothing to toggle and nothing that toggles (triggers the event)
    if (!this.options.menu || !trigger) {
      return false;
    }

    // Template usage not supported in v1.0
    // By default this webcomponent will use the "target" element but we can transfer it
    // to a custom container/wrapper. Doing this the customizable nature of this gets boosted
    
    // Getting the event trigger
    this.options.button = trigger.firstElementChild || undefined;
    if (this.options.button) {
      this.options.attachedEvents = true;
      this.options.button.addEventListener('click', clickHandler.bind(this), false);
      window.addEventListener('scroll', scrollingHandler.bind(this), false);
      document.addEventListener('click', dismissHandler.bind(this), false);

      if (this.options.responsive) {
        window.addEventListener('resize', resizeHandler.bind(this));
        window.dispatchEvent(new Event('resize'));
      }
    }
  };

  // Leaving this functionality for v2.0
  // We will be able to track the webcomponent size (plus the mediaqueries)
  // so the menu gets toggled when unable to fit, disregarding the screen size but its content
  navbar.attributeChangedCallback = function(name, previousValue, value) {};
  navbar.removedCallback = function() {
    if (!this.options.attachedEvents) return false;

    window.removeEventListener('resize', resizeHandler.bind(this), false);
    window.removeEventListener('scroll', scrollingHandler.bind(this), false);
    document.removeEventListener('click', dismissHandler.bind(this), false);
    this.options.button.removeEventListener('click', clickHandler, false);
  };

  var webcomponent = document.registerElement('bp-navbar', {
    prototype: navbar
  });
})();