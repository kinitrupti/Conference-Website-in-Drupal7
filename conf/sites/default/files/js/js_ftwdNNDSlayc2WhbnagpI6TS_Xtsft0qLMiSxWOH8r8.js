(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }

    if (settings.colorbox.mobiledetect && window.matchMedia) {
      // Disable Colorbox for small screens.
      var mq = window.matchMedia("(max-device-width: " + settings.colorbox.mobiledevicewidth + ")");
      if (mq.matches) {
        return;
      }
    }

    $('.colorbox', context)
      .once('init-colorbox')
      .colorbox(settings.colorbox);

    $(context).bind('cbox_complete', function () {
      Drupal.attachBehaviors('#cboxLoadedContent');
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxDefaultStyle = {
  attach: function (context, settings) {
    $(context).bind('cbox_complete', function () {
      // Only run if there is a title.
      if ($('#cboxTitle:empty', context).length == false) {
        $('#cboxLoadedContent img', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideDown();
        });
        $('#cboxOverlay', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideUp();
        });
      }
      else {
        $('#cboxTitle', context).hide();
      }
    });
  }
};

})(jQuery);
;

/**
 * @file
 * Javascript functions for getdirections module
 *
 * @author Bob Hutchinson http://drupal.org/user/52366
 * jquery stuff
*/
(function ($) {
  Drupal.behaviors.getdirections_colorbox = {
    attach: function() {
      // check that colorbox is loaded
      if ($.isFunction($.colorbox)) {
        if ((typeof($("a[rel='getdirectionsbox']").colorbox) == 'function') && Drupal.settings.getdirections_colorbox.enable == 1) {
          $("a[rel='getdirectionsbox']").colorbox({
            iframe:true,
            innerWidth: Drupal.settings.getdirections_colorbox.width,
            innerHeight: Drupal.settings.getdirections_colorbox.height
          });
        }
      }
    }
  }
})(jQuery);
;

/**
 * @file getlocations_colorbox.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations module
 * jquery stuff
*/
(function ($) {
  Drupal.behaviors.getlocations_colorbox = {
    attach: function() {
      // check that colorbox is loaded
      if ((typeof($("a[rel='getlocationsbox']").colorbox) == 'function') && typeof Drupal.settings.getlocations_colorbox !== 'undefined' && Drupal.settings.getlocations_colorbox.enable == 1) {
        $("a[rel='getlocationsbox']").colorbox({
          iframe: true,
          innerWidth: Drupal.settings.getlocations_colorbox.width,
          innerHeight: Drupal.settings.getlocations_colorbox.height
        });
      }
    }
  };
}(jQuery));
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
/**
 * @file
 *
 * Implement a modal form.
 *
 * @see modal.inc for documentation.
 *
 * This javascript relies on the CTools ajax responder.
 */

(function ($) {
  // Make sure our objects are defined.
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.Modal = Drupal.CTools.Modal || {};

  /**
   * Display the modal
   *
   * @todo -- document the settings.
   */
  Drupal.CTools.Modal.show = function(choice) {
    var opts = {};

    if (choice && typeof choice == 'string' && Drupal.settings[choice]) {
      // This notation guarantees we are actually copying it.
      $.extend(true, opts, Drupal.settings[choice]);
    }
    else if (choice) {
      $.extend(true, opts, choice);
    }

    var defaults = {
      modalTheme: 'CToolsModalDialog',
      throbberTheme: 'CToolsModalThrobber',
      animation: 'show',
      animationSpeed: 'fast',
      modalSize: {
        type: 'scale',
        width: .8,
        height: .8,
        addWidth: 0,
        addHeight: 0,
        // How much to remove from the inner content to make space for the
        // theming.
        contentRight: 25,
        contentBottom: 45
      },
      modalOptions: {
        opacity: .55,
        background: '#fff'
      }
    };

    var settings = {};
    $.extend(true, settings, defaults, Drupal.settings.CToolsModal, opts);

    if (Drupal.CTools.Modal.currentSettings && Drupal.CTools.Modal.currentSettings != settings) {
      Drupal.CTools.Modal.modal.remove();
      Drupal.CTools.Modal.modal = null;
    }

    Drupal.CTools.Modal.currentSettings = settings;

    var resize = function(e) {
      // When creating the modal, it actually exists only in a theoretical
      // place that is not in the DOM. But once the modal exists, it is in the
      // DOM so the context must be set appropriately.
      var context = e ? document : Drupal.CTools.Modal.modal;

      if (Drupal.CTools.Modal.currentSettings.modalSize.type == 'scale') {
        var width = $(window).width() * Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = $(window).height() * Drupal.CTools.Modal.currentSettings.modalSize.height;
      }
      else {
        var width = Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = Drupal.CTools.Modal.currentSettings.modalSize.height;
      }

      // Use the additionol pixels for creating the width and height.
      $('div.ctools-modal-content', context).css({
        'width': width + Drupal.CTools.Modal.currentSettings.modalSize.addWidth + 'px',
        'height': height + Drupal.CTools.Modal.currentSettings.modalSize.addHeight + 'px'
      });
      $('div.ctools-modal-content .modal-content', context).css({
        'width': (width - Drupal.CTools.Modal.currentSettings.modalSize.contentRight) + 'px',
        'height': (height - Drupal.CTools.Modal.currentSettings.modalSize.contentBottom) + 'px'
      });
    }

    if (!Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.modal = $(Drupal.theme(settings.modalTheme));
      if (settings.modalSize.type == 'scale') {
        $(window).bind('resize', resize);
      }
    }

    resize();

    $('span.modal-title', Drupal.CTools.Modal.modal).html(Drupal.CTools.Modal.currentSettings.loadingText);
    Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, settings.modalOptions, settings.animation, settings.animationSpeed);
    $('#modalContent .modal-content').html(Drupal.theme(settings.throbberTheme));

    // Position autocomplete results based on the scroll position of the modal.
    $('#modalContent .modal-content').delegate('input.form-autocomplete', 'keyup', function() {
      $('#autocomplete').css('top', $(this).position().top + $(this).outerHeight() + $(this).offsetParent().filter('#modal-content').scrollTop());
    });
  };

  /**
   * Hide the modal
   */
  Drupal.CTools.Modal.dismiss = function() {
    if (Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.unmodalContent(Drupal.CTools.Modal.modal);
    }
  };

  /**
   * Provide the HTML to create the modal dialog.
   */
  Drupal.theme.prototype.CToolsModalDialog = function () {
    var html = ''
    html += '  <div id="ctools-modal">'
    html += '    <div class="ctools-modal-content">' // panels-modal-content
    html += '      <div class="modal-header">';
    html += '        <a class="close" href="#">';
    html +=            Drupal.CTools.Modal.currentSettings.closeText + Drupal.CTools.Modal.currentSettings.closeImage;
    html += '        </a>';
    html += '        <span id="modal-title" class="modal-title">&nbsp;</span>';
    html += '      </div>';
    html += '      <div id="modal-content" class="modal-content">';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    return html;
  }

  /**
   * Provide the HTML to create the throbber.
   */
  Drupal.theme.prototype.CToolsModalThrobber = function () {
    var html = '';
    html += '  <div id="modal-throbber">';
    html += '    <div class="modal-throbber-wrapper">';
    html +=        Drupal.CTools.Modal.currentSettings.throbber;
    html += '    </div>';
    html += '  </div>';

    return html;
  };

  /**
   * Figure out what settings string to use to display a modal.
   */
  Drupal.CTools.Modal.getSettings = function (object) {
    var match = $(object).attr('class').match(/ctools-modal-(\S+)/);
    if (match) {
      return match[1];
    }
  }

  /**
   * Click function for modals that can be cached.
   */
  Drupal.CTools.Modal.clickAjaxCacheLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return Drupal.CTools.AJAX.clickAJAXCacheLink.apply(this);
  };

  /**
   * Handler to prepare the modal for the response
   */
  Drupal.CTools.Modal.clickAjaxLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return false;
  };

  /**
   * Submit responder to do an AJAX submit on all modal forms.
   */
  Drupal.CTools.Modal.submitAjaxForm = function(e) {
    var $form = $(this);
    var url = $form.attr('action');

    setTimeout(function() { Drupal.CTools.AJAX.ajaxSubmit($form, url); }, 1);
    return false;
  }

  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ZZCToolsModal = {
    attach: function(context) {
      // Bind links
      // Note that doing so in this order means that the two classes can be
      // used together safely.
      /*
       * @todo remimplement the warm caching feature
       $('a.ctools-use-modal-cache', context).once('ctools-use-modal', function() {
         $(this).click(Drupal.CTools.Modal.clickAjaxCacheLink);
         Drupal.CTools.AJAX.warmCache.apply(this);
       });
        */

      $('area.ctools-use-modal, a.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        // Create a drupal ajax object
        var element_settings = {};
        if ($this.attr('href')) {
          element_settings.url = $this.attr('href');
          element_settings.event = 'click';
          element_settings.progress = { type: 'throbber' };
        }
        var base = $this.attr('href');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      // Bind buttons
      $('input.ctools-use-modal, button.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        var button = this;
        var element_settings = {};

        // AJAX submits specified in this manner automatically submit to the
        // normal form action.
        element_settings.url = Drupal.CTools.Modal.findURL(this);
        if (element_settings.url == '') {
          element_settings.url = $(this).closest('form').attr('action');
        }
        element_settings.event = 'click';
        element_settings.setClick = true;

        var base = $this.attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);

        // Make sure changes to settings are reflected in the URL.
        $('.' + $(button).attr('id') + '-url').change(function() {
          Drupal.ajax[base].options.url = Drupal.CTools.Modal.findURL(button);
        });
      });

      // Bind our custom event to the form submit
      $('#modal-content form', context).once('ctools-use-modal', function() {
        var $this = $(this);
        var element_settings = {};

        element_settings.url = $this.attr('action');
        element_settings.event = 'submit';
        element_settings.progress = { 'type': 'throbber' }
        var base = $this.attr('id');

        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        Drupal.ajax[base].form = $this;

        $('input[type=submit], button', this).click(function(event) {
          Drupal.ajax[base].element = this;
          this.form.clk = this;
          // Stop autocomplete from submitting.
          if (Drupal.autocompleteSubmit && !Drupal.autocompleteSubmit()) {
            return false;
          }
          // An empty event means we were triggered via .click() and
          // in jquery 1.4 this won't trigger a submit.
          if (event.bubbles == undefined) {
            $(this.form).trigger('submit');
            return false;
          }
        });
      });

      // Bind a click handler to allow elements with the 'ctools-close-modal'
      // class to close the modal.
      $('.ctools-close-modal', context).once('ctools-close-modal')
        .click(function() {
          Drupal.CTools.Modal.dismiss();
          return false;
        });
    }
  };

  // The following are implementations of AJAX responder commands.

  /**
   * AJAX responder command to place HTML within the modal.
   */
  Drupal.CTools.Modal.modal_display = function(ajax, response, status) {
    if ($('#modalContent').length == 0) {
      Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(ajax.element));
    }
    $('#modal-title').html(response.title);
    // Simulate an actual page load by scrolling to the top after adding the
    // content. This is helpful for allowing users to see error messages at the
    // top of a form, etc.
    $('#modal-content').html(response.output).scrollTop(0);

    // Attach behaviors within a modal dialog.
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.attachBehaviors('#modalContent', settings);
  }

  /**
   * AJAX responder command to dismiss the modal.
   */
  Drupal.CTools.Modal.modal_dismiss = function(command) {
    Drupal.CTools.Modal.dismiss();
    $('link.ctools-temporary-css').remove();
  }

  /**
   * Display loading
   */
  //Drupal.CTools.AJAX.commands.modal_loading = function(command) {
  Drupal.CTools.Modal.modal_loading = function(command) {
    Drupal.CTools.Modal.modal_display({
      output: Drupal.theme(Drupal.CTools.Modal.currentSettings.throbberTheme),
      title: Drupal.CTools.Modal.currentSettings.loadingText
    });
  }

  /**
   * Find a URL for an AJAX button.
   *
   * The URL for this gadget will be composed of the values of items by
   * taking the ID of this item and adding -url and looking for that
   * class. They need to be in the form in order since we will
   * concat them all together using '/'.
   */
  Drupal.CTools.Modal.findURL = function(item) {
    var url = '';
    var url_class = '.' + $(item).attr('id') + '-url';
    $(url_class).each(
      function() {
        var $this = $(this);
        if (url && $this.val()) {
          url += '/';
        }
        url += $this.val();
      });
    return url;
  };


  /**
   * modalContent
   * @param content string to display in the content box
   * @param css obj of css attributes
   * @param animation (fadeIn, slideDown, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.modalContent = function(content, css, animation, speed) {
    // If our animation isn't set, make it just show/pop
    if (!animation) {
      animation = 'show';
    }
    else {
      // If our animation isn't "fadeIn" or "slideDown" then it always is show
      if (animation != 'fadeIn' && animation != 'slideDown') {
        animation = 'show';
      }
    }

    if (!speed) {
      speed = 'fast';
    }

    // Build our base attributes and allow them to be overriden
    css = jQuery.extend({
      position: 'absolute',
      left: '0px',
      margin: '0px',
      background: '#000',
      opacity: '.55'
    }, css);

    // Add opacity handling for IE.
    css.filter = 'alpha(opacity=' + (100 * css.opacity) + ')';
    content.hide();

    // If we already have modalContent, remove it.
    if ($('#modalBackdrop').length) $('#modalBackdrop').remove();
    if ($('#modalContent').length) $('#modalContent').remove();

    // position code lifted from http://www.quirksmode.org/viewport/compatibility.html
    if (self.pageYOffset) { // all except Explorer
    var wt = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      var wt = document.documentElement.scrollTop;
    } else if (document.body) { // all other Explorers
      var wt = document.body.scrollTop;
    }

    // Get our dimensions

    // Get the docHeight and (ugly hack) add 50 pixels to make sure we dont have a *visible* border below our div
    var docHeight = $(document).height() + 50;
    var docWidth = $(document).width();
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if( docHeight < winHeight ) docHeight = winHeight;

    // Create our divs
    $('body').append('<div id="modalBackdrop" style="z-index: 1000; display: none;"></div><div id="modalContent" style="z-index: 1001; position: absolute;">' + $(content).html() + '</div>');

    // Keyboard and focus event handler ensures focus stays on modal elements only
    modalEventHandler = function( event ) {
      target = null;
      if ( event ) { //Mozilla
        target = event.target;
      } else { //IE
        event = window.event;
        target = event.srcElement;
      }

      var parents = $(target).parents().get();
      for (var i = 0; i < parents.length; ++i) {
        var position = $(parents[i]).css('position');
        if (position == 'absolute' || position == 'fixed') {
          return true;
        }
      }

      if ($(target).is('#modalContent, body') || $(target).filter('*:visible').parents('#modalContent').length) {
        // Allow the event only if target is a visible child node
        // of #modalContent.
        return true;
      }
      else {
        $('#modalContent').focus();
      }

      event.preventDefault();
    };
    $('body').bind( 'focus', modalEventHandler );
    $('body').bind( 'keypress', modalEventHandler );

    // Create our content div, get the dimensions, and hide it
    var modalContent = $('#modalContent').css('top','-1000px');
    var mdcTop = wt + ( winHeight / 2 ) - (  modalContent.outerHeight() / 2);
    var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);
    $('#modalBackdrop').css(css).css('top', 0).css('height', docHeight + 'px').css('width', docWidth + 'px').show();
    modalContent.css({top: mdcTop + 'px', left: mdcLeft + 'px'}).hide()[animation](speed);

    // Bind a click for closing the modalContent
    modalContentClose = function(){close(); return false;};
    $('.close').bind('click', modalContentClose);

    // Bind a keypress on escape for closing the modalContent
    modalEventEscapeCloseHandler = function(event) {
      if (event.keyCode == 27) {
        close();
        return false;
      }
    };

    $(document).bind('keydown', modalEventEscapeCloseHandler);

    // Close the open modal content and backdrop
    function close() {
      // Unbind the events
      $(window).unbind('resize',  modalContentResize);
      $('body').unbind( 'focus', modalEventHandler);
      $('body').unbind( 'keypress', modalEventHandler );
      $('.close').unbind('click', modalContentClose);
      $('body').unbind('keypress', modalEventEscapeCloseHandler);
      $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

      // Set our animation parameters and use them
      if ( animation == 'fadeIn' ) animation = 'fadeOut';
      if ( animation == 'slideDown' ) animation = 'slideUp';
      if ( animation == 'show' ) animation = 'hide';

      // Close the content
      modalContent.hide()[animation](speed);

      // Remove the content
      $('#modalContent').remove();
      $('#modalBackdrop').remove();
    };

    // Move and resize the modalBackdrop and modalContent on resize of the window
     modalContentResize = function(){

      // position code lifted from http://www.quirksmode.org/viewport/compatibility.html
      if (self.pageYOffset) { // all except Explorer
      var wt = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
        var wt = document.documentElement.scrollTop;
      } else if (document.body) { // all other Explorers
        var wt = document.body.scrollTop;
      }

      // Get our heights
      var docHeight = $(document).height();
      var docWidth = $(document).width();
      var winHeight = $(window).height();
      var winWidth = $(window).width();
      if( docHeight < winHeight ) docHeight = winHeight;

      // Get where we should move content to
      var modalContent = $('#modalContent');
      var mdcTop = wt + ( winHeight / 2 ) - ( modalContent.outerHeight() / 2);
      var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

      // Apply the changes
      $('#modalBackdrop').css('height', docHeight + 'px').css('width', docWidth + 'px').show();
      modalContent.css('top', mdcTop + 'px').css('left', mdcLeft + 'px').show();
    };
    $(window).bind('resize', modalContentResize);

    $('#modalContent').focus();
  };

  /**
   * unmodalContent
   * @param content (The jQuery object to remove)
   * @param animation (fadeOut, slideUp, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.unmodalContent = function(content, animation, speed)
  {
    // If our animation isn't set, make it just show/pop
    if (!animation) { var animation = 'show'; } else {
      // If our animation isn't "fade" then it always is show
      if (( animation != 'fadeOut' ) && ( animation != 'slideUp')) animation = 'show';
    }
    // Set a speed if we dont have one
    if ( !speed ) var speed = 'fast';

    // Unbind the events we bound
    $(window).unbind('resize', modalContentResize);
    $('body').unbind('focus', modalEventHandler);
    $('body').unbind('keypress', modalEventHandler);
    $('.close').unbind('click', modalContentClose);
    $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

    // jQuery magic loop through the instances and run the animations or removal.
    content.each(function(){
      if ( animation == 'fade' ) {
        $('#modalContent').fadeOut(speed, function() {
          $('#modalBackdrop').fadeOut(speed, function() {
            $(this).remove();
          });
          $(this).remove();
        });
      } else {
        if ( animation == 'slide' ) {
          $('#modalContent').slideUp(speed,function() {
            $('#modalBackdrop').slideUp(speed, function() {
              $(this).remove();
            });
            $(this).remove();
          });
        } else {
          $('#modalContent').remove();
          $('#modalBackdrop').remove();
        }
      }
    });
  };

$(function() {
  Drupal.ajax.prototype.commands.modal_display = Drupal.CTools.Modal.modal_display;
  Drupal.ajax.prototype.commands.modal_dismiss = Drupal.CTools.Modal.modal_dismiss;
});

})(jQuery);
;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

Drupal.admin.behaviors.shorcutcollapsed = function (context, settings, $adminMenu) {

  // Create the dropdown base 
  $("<li class=\"label\"><a>"+Drupal.t('Shortcuts')+"</a></li>").prependTo("body.menu-render-collapsed #toolbar div.toolbar-shortcuts ul"); 

};

Drupal.admin.behaviors.shorcutselect = function (context, settings, $adminMenu) {

  // Create the dropdown base
  $("<select id='shortcut-menu'/>").appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts");

  // Create default option "Select"
  $("<option />", {
    "selected"  :  "selected",
    "value"     :  "",
    "text"      :  Drupal.t('Shortcuts')
  }).appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select");

  // Populate dropdown with menu items
  $("body.menu-render-dropdown #toolbar div.toolbar-shortcuts a").each(function() {
    var el = $(this);
    $("<option />", {
      "value"   :  el.attr("href"),
      "text"    :  el.text()
    }).appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select");
    });

  $("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select").change(function() {
    window.location = $(this).find("option:selected").val();
  });

  $('body.menu-render-dropdown #toolbar div.toolbar-shortcuts ul').remove();

};

// Create the responsive menu using SlickNav.
Drupal.admin.behaviors.responsivemenu = function (context, settings, $adminMenu) {

    $('#admin-menu-menu-responsive').slicknav({
		label: 'Menu',
		prependTo:'body',
		closedSymbol: "<i class=\"closed\"></i>",
		openedSymbol: "<i class=\"open\"></i>",
		allowParentLinks: true
	});

};

// Create the responsive shortcuts dropdown.
Drupal.admin.behaviors.responsiveshortcuts = function (context, settings, $adminMenu) {

  // Check if there are any shortucts to respondify.
  if(jQuery("div.toolbar-shortcuts ul.menu li").length){

	  // Create the dropdown base
	  $("<select id='responsive-shortcuts-dropdown'/>").appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts");

	  // Create default option "Select"
	  $("<option />", {
	    "selected"  :  "selected",
	    "class"     :  "hide",
	    "value"     :  "",
	    "text"      :  Drupal.t('Shortcuts')
	  }).appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select");

	  // Populate dropdown with menu items
	  $("#admin-menu-shortcuts-responsive div.toolbar-shortcuts a").each(function() {
	    var el = $(this);
	    $("<option />", {
	      "value"   :  el.attr("href"),
	      "text"    :  el.text()
	    }).appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select");
	  });

      // Redirect the user when selecting an option.
	  $("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select").change(function() {
	    window.location = $(this).find("option:selected").val();
	  });

	  // Clean the mess.
	  $('#admin-menu-shortcuts-responsive div.toolbar-shortcuts ul').remove();
	  // Move the select box into the responsive menu.
	  $("#admin-menu-shortcuts-responsive").prependTo(".slicknav_menu");

	  }

  // Remove the edit shortcuts link from the DOM to avoid duble rendering.
  $('#admin-menu-shortcuts-responsive #edit-shortcuts').remove();

};

})(jQuery);
;
/**
 * @file
 * Provides dependent visibility for form items in CTools' ajax forms.
 *
 * To your $form item definition add:
 * - '#process' => array('ctools_process_dependency'),
 * - '#dependency' => array('id-of-form-item' => array(list, of, values, that,
 *   make, this, item, show),
 *
 * Special considerations:
 * - Radios are harder. Because Drupal doesn't give radio groups individual IDs,
 *   use 'radio:name-of-radio'.
 *
 * - Checkboxes don't have their own id, so you need to add one in a div
 *   around the checkboxes via #prefix and #suffix. You actually need to add TWO
 *   divs because it's the parent that gets hidden. Also be sure to retain the
 *   'expand_checkboxes' in the #process array, because the CTools process will
 *   override it.
 */

(function ($) {
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.dependent = {};

  Drupal.CTools.dependent.bindings = {};
  Drupal.CTools.dependent.activeBindings = {};
  Drupal.CTools.dependent.activeTriggers = [];

  Drupal.CTools.dependent.inArray = function(array, search_term) {
    var i = array.length;
    while (i--) {
      if (array[i] == search_term) {
         return true;
      }
    }
    return false;
  }


  Drupal.CTools.dependent.autoAttach = function() {
    // Clear active bindings and triggers.
    for (i in Drupal.CTools.dependent.activeTriggers) {
      $(Drupal.CTools.dependent.activeTriggers[i]).unbind('change.ctools-dependent');
    }
    Drupal.CTools.dependent.activeTriggers = [];
    Drupal.CTools.dependent.activeBindings = {};
    Drupal.CTools.dependent.bindings = {};

    if (!Drupal.settings.CTools) {
      return;
    }

    // Iterate through all relationships
    for (id in Drupal.settings.CTools.dependent) {
      // Test to make sure the id even exists; this helps clean up multiple
      // AJAX calls with multiple forms.

      // Drupal.CTools.dependent.activeBindings[id] is a boolean,
      // whether the binding is active or not.  Defaults to no.
      Drupal.CTools.dependent.activeBindings[id] = 0;
      // Iterate through all possible values
      for(bind_id in Drupal.settings.CTools.dependent[id].values) {
        // This creates a backward relationship.  The bind_id is the ID
        // of the element which needs to change in order for the id to hide or become shown.
        // The id is the ID of the item which will be conditionally hidden or shown.
        // Here we're setting the bindings for the bind
        // id to be an empty array if it doesn't already have bindings to it
        if (!Drupal.CTools.dependent.bindings[bind_id]) {
          Drupal.CTools.dependent.bindings[bind_id] = [];
        }
        // Add this ID
        Drupal.CTools.dependent.bindings[bind_id].push(id);
        // Big long if statement.
        // Drupal.settings.CTools.dependent[id].values[bind_id] holds the possible values

        if (bind_id.substring(0, 6) == 'radio:') {
          var trigger_id = "input[name='" + bind_id.substring(6) + "']";
        }
        else {
          var trigger_id = '#' + bind_id;
        }

        Drupal.CTools.dependent.activeTriggers.push(trigger_id);

        if ($(trigger_id).attr('type') == 'checkbox') {
          $(trigger_id).siblings('label').addClass('hidden-options');
        }

        var getValue = function(item, trigger) {
          if ($(trigger).size() == 0) {
            return null;
          }

          if (item.substring(0, 6) == 'radio:') {
            var val = $(trigger + ':checked').val();
          }
          else {
            switch ($(trigger).attr('type')) {
              case 'checkbox':
                var val = $(trigger).attr('checked') ? true : false;

                if (val) {
                  $(trigger).siblings('label').removeClass('hidden-options').addClass('expanded-options');
                }
                else {
                  $(trigger).siblings('label').removeClass('expanded-options').addClass('hidden-options');
                }

                break;
              default:
                var val = $(trigger).val();
            }
          }
          return val;
        }

        var setChangeTrigger = function(trigger_id, bind_id) {
          // Triggered when change() is clicked.
          var changeTrigger = function() {
            var val = getValue(bind_id, trigger_id);

            if (val == null) {
              return;
            }

            for (i in Drupal.CTools.dependent.bindings[bind_id]) {
              var id = Drupal.CTools.dependent.bindings[bind_id][i];
              // Fix numerous errors
              if (typeof id != 'string') {
                continue;
              }

              // This bit had to be rewritten a bit because two properties on the
              // same set caused the counter to go up and up and up.
              if (!Drupal.CTools.dependent.activeBindings[id]) {
                Drupal.CTools.dependent.activeBindings[id] = {};
              }

              if (val != null && Drupal.CTools.dependent.inArray(Drupal.settings.CTools.dependent[id].values[bind_id], val)) {
                Drupal.CTools.dependent.activeBindings[id][bind_id] = 'bind';
              }
              else {
                delete Drupal.CTools.dependent.activeBindings[id][bind_id];
              }

              var len = 0;
              for (i in Drupal.CTools.dependent.activeBindings[id]) {
                len++;
              }

              var object = $('#' + id + '-wrapper');
              if (!object.size()) {
                // Some elements can't use the parent() method or they can
                // damage things. They are guaranteed to have wrappers but
                // only if dependent.inc provided them. This check prevents
                // problems when multiple AJAX calls cause settings to build
                // up.
                var $original = $('#' + id);
                if ($original.is('fieldset') || $original.is('textarea')) {
                  continue;
                }

                object = $('#' + id).parent();
              }

              if (Drupal.settings.CTools.dependent[id].type == 'disable') {
                if (Drupal.settings.CTools.dependent[id].num <= len) {
                  // Show if the element if criteria is matched
                  object.attr('disabled', false);
                  object.addClass('dependent-options');
                  object.children().attr('disabled', false);
                }
                else {
                  // Otherwise hide. Use css rather than hide() because hide()
                  // does not work if the item is already hidden, for example,
                  // in a collapsed fieldset.
                  object.attr('disabled', true);
                  object.children().attr('disabled', true);
                }
              }
              else {
                if (Drupal.settings.CTools.dependent[id].num <= len) {
                  // Show if the element if criteria is matched
                  object.show(0);
                  object.addClass('dependent-options');
                }
                else {
                  // Otherwise hide. Use css rather than hide() because hide()
                  // does not work if the item is already hidden, for example,
                  // in a collapsed fieldset.
                  object.css('display', 'none');
                }
              }
            }
          }

          $(trigger_id).bind('change.ctools-dependent', function() {
            // Trigger the internal change function
            // the attr('id') is used because closures are more confusing
            changeTrigger(trigger_id, bind_id);
          });
          // Trigger initial reaction
          changeTrigger(trigger_id, bind_id);
        }
        setChangeTrigger(trigger_id, bind_id);
      }
    }
  }

  Drupal.behaviors.CToolsDependent = {
    attach: function (context) {
      Drupal.CTools.dependent.autoAttach();

      // Really large sets of fields are too slow with the above method, so this
      // is a sort of hacked one that's faster but much less flexible.
      $("select.ctools-master-dependent")
        .once('ctools-dependent')
        .bind('change.ctools-dependent', function() {
          var val = $(this).val();
          if (val == 'all') {
            $('.ctools-dependent-all').show(0);
          }
          else {
            $('.ctools-dependent-all').hide(0);
            $('.ctools-dependent-' + val).show(0);
          }
        })
        .trigger('change.ctools-dependent');
    }
  }
})(jQuery);
;
/*!
	SlickNav Responsive Mobile Menu
	(c) 2014 Josh Cope
	licensed under MIT
*/
;(function ($, document, window) {
	var
	// default settings object.
	defaults = {
		label: 'MENU',
		duplicate: true,
		duration: 200,
		easingOpen: 'swing',
		easingClose: 'swing',
		closedSymbol: '&#9658;',
		openedSymbol: '&#9660;',
		prependTo: 'body',
		parentTag: 'a',
		closeOnClick: false,
		allowParentLinks: false,
		init: function(){},
		open: function(){},
		close: function(){}
	},
	mobileMenu = 'slicknav',
	prefix = 'slicknav';
	
	function Plugin( element, options ) {
		this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = mobileMenu;
        
        this.init();
	}
	
	Plugin.prototype.init = function () {
        var $this = this;
		var menu = $(this.element);
		var settings = this.settings;
		
		// clone menu if needed
		if (settings.duplicate) {
			$this.mobileNav = menu.clone();
			//remove ids from clone to prevent css issues
			$this.mobileNav.removeAttr('id');
			$this.mobileNav.find('*').each(function(i,e){
				$(e).removeAttr('id');
			});
		}
		else
			$this.mobileNav = menu;
		
		// styling class for the button
		var iconClass = prefix+'_icon';
		
		if (settings.label == '') {
			iconClass += ' '+prefix+'_no-text';
		}
		
		if (settings.parentTag == 'a') {
			settings.parentTag = 'a href="#"';
		}
		
		// create menu bar
		$this.mobileNav.attr('class', prefix+'_nav');
		var menuBar = $('<div class="'+prefix+'_menu"></div>');
		$this.btn = $('<'+settings.parentTag+' aria-haspopup="true" tabindex="0" class="'+prefix+'_btn '+prefix+'_collapsed"><span class="'+prefix+'_menutxt">'+settings.label+'</span><span class="'+iconClass+'"><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span></span></a>');
		$(menuBar).append($this.btn);		
		$(settings.prependTo).prepend(menuBar);
		menuBar.append($this.mobileNav);
		
		// iterate over structure adding additional structure
		var items = $this.mobileNav.find('li');
		$(items).each(function () {
			var item = $(this);
			data = {};
			data.children = item.children('ul').attr('role','menu');
			item.data("menu", data);
			
			// if a list item has a nested menu
			if (data.children.length > 0) {
			
				// select all text before the child menu
				var a = item.contents();
				var nodes = [];
				$(a).each(function(){
					if(!$(this).is("ul")) {
						nodes.push(this);
					}
					else {
						return false;
					}
				});
				
				// wrap item text with tag and add classes
				var wrap = $(nodes).wrapAll('<'+settings.parentTag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="'+prefix+'_item"/>').parent();
				
				item.addClass(prefix+'_collapsed');
				item.addClass(prefix+'_parent');
				
				// create parent arrow
				$(nodes).last().after('<span class="'+prefix+'_arrow">'+settings.closedSymbol+'</span>');
				
			
			} else if ( item.children().length == 0) {
				 item.addClass(prefix+'_txtnode');
			}
			
			// accessibility for links
			item.children('a').attr('role', 'menuitem').click(function(){
				//Emulate menu close if set
				if (settings.closeOnClick)
					$($this.btn).click();
			});
		});
		
		// structure is in place, now hide appropriate items
		$(items).each(function () {
			var data = $(this).data("menu");
			$this._visibilityToggle(data.children, false, null, true);
		});
		
		// finally toggle entire menu
		$this._visibilityToggle($this.mobileNav, false, 'init', true);
		
		// accessibility for menu button
		$this.mobileNav.attr('role','menu');
		
		// outline prevention when using mouse
		$(document).mousedown(function(){
			$this._outlines(false);
		});
		
		$(document).keyup(function(){
			$this._outlines(true);
		});
		
		// menu button click
		$($this.btn).click(function (e) {
			e.preventDefault();
			$this._menuToggle();			
		});
		
		// click on menu parent
		$this.mobileNav.on('click', '.'+prefix+'_item', function(e){
			e.preventDefault();
			$this._itemClick($(this));
		});
		
		// check for enter key on menu button and menu parents
		$($this.btn).keydown(function (e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				$this._menuToggle();
			}
		});
		
		$this.mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				$this._itemClick($(e.target));
			}
		});
		
		// allow links clickable within parent tags if set
		if (settings.allowParentLinks) {
			$('.'+prefix+'_item a').click(function(e){
					e.stopImmediatePropagation();
			});
		}
    };
	
	//toggle menu
	Plugin.prototype._menuToggle = function(el){
		var $this = this;
		var btn = $this.btn;
		var mobileNav = $this.mobileNav;
		
		if (btn.hasClass(prefix+'_collapsed')) {
			btn.removeClass(prefix+'_collapsed');
			btn.addClass(prefix+'_open');
		} else {
			btn.removeClass(prefix+'_open');
			btn.addClass(prefix+'_collapsed');
		}
		btn.addClass(prefix+'_animating');
		$this._visibilityToggle(mobileNav, true, btn);
	}
	
	// toggle clicked items
	Plugin.prototype._itemClick = function(el) {
		var $this = this;
		var settings = $this.settings;
		var data = el.data("menu");
		if (!data) {
			data = {};
			data.arrow = el.children('.'+prefix+'_arrow');
			data.ul = el.next('ul');
			data.parent = el.parent();
			el.data("menu", data);
		}
		if (data.parent.hasClass(prefix+'_collapsed')) {
			data.arrow.html(settings.openedSymbol);
			data.parent.removeClass(prefix+'_collapsed');
			data.parent.addClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			$this._visibilityToggle(data.ul, true, el);
		} else {
			data.arrow.html(settings.closedSymbol);
			data.parent.addClass(prefix+'_collapsed');
			data.parent.removeClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			$this._visibilityToggle(data.ul, true, el);
		}
	}

	// toggle actual visibility and accessibility tags
	Plugin.prototype._visibilityToggle = function(el, animate, trigger, init) {
		var $this = this;
		var settings = $this.settings;
		var items = $this._getActionItems(el);
		var duration = 0;
		if (animate)
			duration = settings.duration;
		
		if (el.hasClass(prefix+'_hidden')) {
			el.removeClass(prefix+'_hidden');
			el.slideDown(duration, settings.easingOpen, function(){
				
				$(trigger).removeClass(prefix+'_animating');
				$(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire open callback
				if (!init) {
					settings.open(trigger);
				}
			});
			el.attr('aria-hidden','false');
			items.attr('tabindex', '0');
			$this._setVisAttr(el, false);
		} else {
			el.addClass(prefix+'_hidden');
			el.slideUp(duration, this.settings.easingClose, function() {
				el.attr('aria-hidden','true');
				items.attr('tabindex', '-1');
				$this._setVisAttr(el, true);
				el.hide(); //jQuery 1.7 bug fix
				
				$(trigger).removeClass(prefix+'_animating');
				$(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire init or close callback
				if (!init)
					settings.close(trigger);
				else if (trigger == 'init')
					settings.init();
			});
		}
	}

	// set attributes of element and children based on visibility
	Plugin.prototype._setVisAttr = function(el, hidden) {
		var $this = this;
		
		// select all parents that aren't hidden
		var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');
		
		// iterate over all items setting appropriate tags
		if (!hidden) {
			nonHidden.each(function(){
				var ul = $(this);
				ul.attr('aria-hidden','false');
				var items = $this._getActionItems(ul);
				items.attr('tabindex', '0');
				$this._setVisAttr(ul, hidden);
			});
		} else {
			nonHidden.each(function(){
				var ul = $(this);
				ul.attr('aria-hidden','true');
				var items = $this._getActionItems(ul);
				items.attr('tabindex', '-1');
				$this._setVisAttr(ul, hidden);
			});
		}
	}

	// get all 1st level items that are clickable
	Plugin.prototype._getActionItems = function(el) {
		var data = el.data("menu");
		if (!data) {
			data = {};
			var items = el.children('li');
			var anchors = items.children('a');
			data.links = anchors.add(items.children('.'+prefix+'_item'));
			el.data("menu", data);
		}
		return data.links;
	}

	Plugin.prototype._outlines = function(state) {
		if (!state) {
			$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
		} else {
			$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
		}
	}
	
	Plugin.prototype.toggle = function(){
		$this._menuToggle();
	}
	
	Plugin.prototype.open = function(){
		$this = this;
		if ($this.btn.hasClass(prefix+'_collapsed')) {
			$this._menuToggle();
		}
	}
	
	Plugin.prototype.close = function(){
		$this = this;
		if ($this.btn.hasClass(prefix+'_open')) {
			$this._menuToggle();
		}
	}
	
	$.fn[mobileMenu] = function ( options ) {
		var args = arguments;

		// Is the first parameter an object (options), or was omitted, instantiate a new instance
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {

				// Only allow the plugin to be instantiated once due to methods
				if (!$.data(this, 'plugin_' + mobileMenu)) {

					// if it has no instance, create a new one, pass options to our plugin constructor,
					// and store the plugin instance in the elements jQuery data object.
					$.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
				}
			});

		// If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			// Cache the method call to make it possible to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + mobileMenu);

				// Tests that there's already a plugin-instance and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance, and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			});

			// If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};
}(jQuery, document, window));;
