
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
