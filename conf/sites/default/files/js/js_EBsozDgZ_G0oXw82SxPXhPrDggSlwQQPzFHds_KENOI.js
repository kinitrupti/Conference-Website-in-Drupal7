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

/**
 * JavaScript behaviors for the front-end display of webforms.
 */

(function ($) {

Drupal.behaviors.webform = Drupal.behaviors.webform || {};

Drupal.behaviors.webform.attach = function(context) {
  // Calendar datepicker behavior.
  Drupal.webform.datepicker(context);

  // Conditional logic.
  if (Drupal.settings.webform && Drupal.settings.webform.conditionals) {
    Drupal.webform.conditional(context);
  }
};

Drupal.webform = Drupal.webform || {};

Drupal.webform.datepicker = function(context) {
  $('div.webform-datepicker').each(function() {
    var $webformDatepicker = $(this);
    var $calendar = $webformDatepicker.find('input.webform-calendar');

    // Ensure the page we're on actually contains a datepicker.
    if ($calendar.length == 0) {
      return;
    }

    var startDate = $calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var endDate = $calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');
    // Convert date strings into actual Date objects.
    startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);

    // Ensure that start comes before end for datepicker.
    if (startDate > endDate) {
      var laterDate = startDate;
      startDate = endDate;
      endDate = laterDate;
    }

    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();

    // Set up the jQuery datepicker element.
    $calendar.datepicker({
      dateFormat: 'yy-mm-dd',
      yearRange: startYear + ':' + endYear,
      firstDay: parseInt(firstDay),
      minDate: startDate,
      maxDate: endDate,
      onSelect: function(dateText, inst) {
        var date = dateText.split('-');
        $webformDatepicker.find('select.year, input.year').val(+date[0]).trigger('change');
        $webformDatepicker.find('select.month').val(+date[1]).trigger('change');
        $webformDatepicker.find('select.day').val(+date[2]).trigger('change');
      },
      beforeShow: function(input, inst) {
        // Get the select list values.
        var year = $webformDatepicker.find('select.year, input.year').val();
        var month = $webformDatepicker.find('select.month').val();
        var day = $webformDatepicker.find('select.day').val();

        // If empty, default to the current year/month/day in the popup.
        var today = new Date();
        year = year ? year : today.getFullYear();
        month = month ? month : today.getMonth() + 1;
        day = day ? day : today.getDate();

        // Make sure that the default year fits in the available options.
        year = (year < startYear || year > endYear) ? startYear : year;

        // jQuery UI Datepicker will read the input field and base its date off
        // of that, even though in our case the input field is a button.
        $(input).val(year + '-' + month + '-' + day);
      }
    });

    // Prevent the calendar button from submitting the form.
    $calendar.click(function(event) {
      $(this).focus();
      event.preventDefault();
    });
  });
};

Drupal.webform.conditional = function(context) {
  // Add the bindings to each webform on the page.
  $.each(Drupal.settings.webform.conditionals, function(formKey, settings) {
    var $form = $('.' + formKey + ':not(.webform-conditional-processed)');
    $form.each(function(index, currentForm) {
      var $currentForm = $(currentForm);
      $currentForm.addClass('webform-conditional-processed');
      $currentForm.bind('change', { 'settings': settings }, Drupal.webform.conditionalCheck);

      // Trigger all the elements that cause conditionals on this form.
      $.each(Drupal.settings.webform.conditionals[formKey]['sourceMap'], function(elementKey) {
        $currentForm.find('.' + elementKey).find('input,select,textarea').filter(':first').trigger('change');
      });
    })
  });
};

/**
 * Event handler to respond to field changes in a form.
 *
 * This event is bound to the entire form, not individual fields.
 */
Drupal.webform.conditionalCheck = function(e) {
  var $triggerElement = $(e.target).closest('.webform-component');
  var $form = $triggerElement.closest('form');
  var triggerElementKey = $triggerElement.attr('class').match(/webform-component--[^ ]+/)[0];
  var settings = e.data.settings;


  if (settings.sourceMap[triggerElementKey]) {
    $.each(settings.sourceMap[triggerElementKey], function(n, rgid_key) {
      var ruleGroup = settings.ruleGroups[rgid_key];

      // Perform the comparison callback and build the results for this group.
      var conditionalResult = true;
      var conditionalResults = [];
      $.each(ruleGroup['rules'], function(m, rule) {
        var elementKey = rule['source'];
        var element = $form.find('.' + elementKey)[0];
        var existingValue = settings.values[elementKey] ? settings.values[elementKey] : null;
        conditionalResults.push(window['Drupal']['webform'][rule.callback](element, existingValue, rule['value'] ));
      });

      // Filter out false values.
      var filteredResults = [];
      for (var i = 0; i < conditionalResults.length; i++) {
        if (conditionalResults[i]) {
          filteredResults.push(conditionalResults[i]);
        }
      }

      // Calculate the and/or result.
      if (ruleGroup['andor'] === 'or') {
        conditionalResult = filteredResults.length > 0;
      }
      else {
        conditionalResult = filteredResults.length === conditionalResults.length;
      }

      // Flip the result of the action is to hide.
      var showComponent;
      if (ruleGroup['action'] == 'hide') {
        showComponent = !conditionalResult;
      }
      else {
        showComponent = conditionalResult;
      }

      var $target = $form.find('.' + ruleGroup['target']);
      var $targetElements;
      if (showComponent != $target.is(':visible')) {
        if (showComponent) {
          $targetElements = $target.find('.webform-conditional-disabled').removeClass('webform-conditional-disabled');
          $.fn.prop ? $targetElements.prop('disabled', false) : $targetElements.removeAttr('disabled');
          $target.show();
        }
        else {
          $targetElements = $target.find(':input').addClass('webform-conditional-disabled');
          $.fn.prop ? $targetElements.prop('disabled', true) : $targetElements.attr('disabled', true);
          $target.hide();
        }
        // Trigger change if not already in recurive infinite loop
        var target = $target.get(0);
        target.changeDepth = target.changeDepth || 0;
        if (target.changeDepth < 10) {
          target.changeDepth++;
          $target.trigger('change');
          target.changeDepth--;
        } else {
          alert(Drupal.t("An infinite loop was detected in this webform's conditionals. Contact the administrator."));
        }
      }

    });
  }

};

Drupal.webform.conditionalOperatorStringEqual = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase() === ruleValue.toLowerCase()) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringNotEqual = function(element, existingValue, ruleValue) {
  var found = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase() === ruleValue.toLowerCase()) {
      found = true;
    }
  });
  return !found;
};

Drupal.webform.conditionalOperatorStringContains = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringDoesNotContain = function(element, existingValue, ruleValue) {
  var found = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) > -1) {
      found = true;
    }
  });
  return !found;
};

Drupal.webform.conditionalOperatorStringBeginsWith = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().indexOf(ruleValue.toLowerCase()) === 0) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringEndsWith = function(element, existingValue, ruleValue) {
  var returnValue = false;
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  $.each(currentValue, function(n, value) {
    if (value.toLowerCase().lastIndexOf(ruleValue.toLowerCase()) === value.length - ruleValue.length) {
      returnValue = true;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringEmpty = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var returnValue = true;
  $.each(currentValue, function(n, value) {
    if (value !== '') {
      returnValue = false;
      return false; // break.
    }
  });
  return returnValue;
};

Drupal.webform.conditionalOperatorStringNotEmpty = function(element, existingValue, ruleValue) {
  return !Drupal.webform.conditionalOperatorStringEmpty(element, existingValue, ruleValue);
};

Drupal.webform.conditionalOperatorNumericEqual = function(element, existingValue, ruleValue) {
  // See float comparison: http://php.net/manual/en/language.types.float.php
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var epsilon = 0.000001;
  // An empty string does not match any number.
  return currentValue[0] === '' ? false : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) < epsilon);
};

Drupal.webform.conditionalOperatorNumericNotEqual = function(element, existingValue, ruleValue) {
  // See float comparison: http://php.net/manual/en/language.types.float.php
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  var epsilon = 0.000001;
  // An empty string does not match any number.
  return currentValue[0] === '' ? true : (Math.abs(parseFloat(currentValue[0]) - parseFloat(ruleValue)) >= epsilon);
};

Drupal.webform.conditionalOperatorNumericGreaterThan = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  return parseFloat(currentValue[0]) > parseFloat(ruleValue);
};

Drupal.webform.conditionalOperatorNumericLessThan = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.stringValue(element, existingValue);
  return parseFloat(currentValue[0]) < parseFloat(ruleValue);
};

Drupal.webform.conditionalOperatorDateEqual = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return currentValue === ruleValue;
};

Drupal.webform.conditionalOperatorDateBefore = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return (currentValue !== false) && currentValue < ruleValue;
};

Drupal.webform.conditionalOperatorDateAfter = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.dateValue(element, existingValue);
  return (currentValue !== false) && currentValue > ruleValue;
};

Drupal.webform.conditionalOperatorTimeEqual = function(element, existingValue, ruleValue) {
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return currentValue === ruleValue;
};

Drupal.webform.conditionalOperatorTimeBefore = function(element, existingValue, ruleValue) {
  // Date and time operators intentionally exclusive for "before".
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return (currentValue !== false) && (currentValue < ruleValue);
};

Drupal.webform.conditionalOperatorTimeAfter = function(element, existingValue, ruleValue) {
  // Date and time operators intentionally inclusive for "after".
  var currentValue = Drupal.webform.timeValue(element, existingValue);
  return (currentValue !== false) && (currentValue >= ruleValue);
};

/**
 * Utility function to get a string value from a select/radios/text/etc. field.
 */
Drupal.webform.stringValue = function(element, existingValue) {
  var value = [];
  if (element) {
    var $element = $(element);
    if ($element.is(':visible')) {
      // Checkboxes and radios.
      $element.find('input[type=checkbox]:checked,input[type=radio]:checked').each(function() {
        value.push(this.value);
      });
      // Select lists.
      if (!value.length) {
        var selectValue = $element.find('select').val();
        if (selectValue) {
          value.push(selectValue);
        }
      }
      // Simple text fields. This check is done last so that the select list in
      // select-or-other fields comes before the "other" text field.
      if (!value.length) {
        $element.find('input:not([type=checkbox],[type=radio]),textarea').each(function() {
          value.push(this.value);
        });
      }
    }
  }
  else {
    switch ($.type(existingValue)) {
      case 'array':
        value = existingValue;
        break;
      case 'string':
        value.push(existingValue);
        break;
    }
  }
  return value;
};

/**
 * Utility function to calculate a millisecond timestamp from a time field.
 */
Drupal.webform.dateValue = function(element, existingValue) {
  var value = false;
  if (element) {
    var $element = $(element);
    if ($element.is(':visible')) {
      var day = $element.find('[name*=day]').val();
      var month = $element.find('[name*=month]').val();
      var year = $element.find('[name*=year]').val();
      // Months are 0 indexed in JavaScript.
      if (month) {
        month--;
      }
      if (year !== '' && month !== '' && day !== '') {
        value = Date.UTC(year, month, day) / 1000;
      }
    }
  }
  else {
    if ($.type(existingValue) === 'array' && existingValue.length) {
      existingValue = existingValue[0];
    }
    if ($.type(existingValue) === 'string') {
      existingValue = existingValue.split('-');
    }
    if (existingValue.length === 3) {
      value = Date.UTC(existingValue[0], existingValue[1], existingValue[2]) / 1000;
    }
  }
  return value;
};

/**
 * Utility function to calculate a millisecond timestamp from a time field.
 */
Drupal.webform.timeValue = function(element, existingValue) {
  var value = false;
  if (element) {
    var $element = $(element);
    if ($element.is(':visible')) {
      var hour = $element.find('[name*=hour]').val();
      var minute = $element.find('[name*=minute]').val();
      var ampm = $element.find('[name*=ampm]:checked').val();

      // Convert to integers if set.
      hour = (hour === '') ? hour : parseInt(hour);
      minute = (minute === '') ? minute : parseInt(minute);

      if (hour !== '') {
        hour = (hour < 12 && ampm == 'pm') ? hour + 12 : hour;
        hour = (hour === 12 && ampm == 'am') ? 0 : hour;
      }
      if (hour !== '' && minute !== '') {
        value = Date.UTC(1970, 0, 1, hour, minute) / 1000;
      }
    }
  }
  else {
    if ($.type(existingValue) === 'array' && existingValue.length) {
      existingValue = existingValue[0];
    }
    if ($.type(existingValue) === 'string') {
      existingValue = existingValue.split(':');
    }
    if (existingValue.length >= 2) {
      value = Date.UTC(1970, 0, 1, existingValue[0], existingValue[1]) / 1000;
    }
  }
  return value;
};

})(jQuery);
;
