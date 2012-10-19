(function($){
  var plugin = {
    name: 'resetForm'
  };

  var default_settings = {
    reset: '.reset-form-button'
  };

  var methods = {
    init: function(options) {
      var settings = $.extend({}, default_settings, options);
      var data = {
        settings: settings
      };

      this.data(plugin.name, data);
      methods.bind.call(this);

      $(':input', this).each(function() {
        var orig;
        if (this.type == 'checkbox' || this.type == 'radio') {
          orig = this.checked;
        } else {
          orig = $(this).val();
        }
        $(this).data(plugin.name + '-orig', orig);
      });

      methods.trigger.call(this, 'init');
    },

    bind: function() {
      // In case init is called multiple times
      methods.unbind.call(this);

      this.on('click', this.data(plugin.name).settings.reset, methods.click);
    },

    unbind: function() {
      this.off('click', this.data(plugin.name).settings.reset, methods.click);
    },

    destroy: function() {
      methods.unbind.call(this);
      this.removeData(plugin.name);
    },

    click: function(e) {
      e.preventDefault();
      methods.revert.call($(e.delegateTarget));
    },

    revert: function() {
      $(':input', this).each(function() {
        var orig = $(this).data(plugin.name + '-orig');
        if (this.type == 'checkbox' || this.type == 'radio') {
          this.checked = orig;
        } else {
          $(this).val(orig);
        }
      });

      methods.trigger.call(this, 'reverted');
    },

    trigger: function(event, options) {
      this.trigger(plugin.name + '.' + event, options);
    }
  };

  $.fn[plugin.name] = function(method) {

    var args = false;
    if ( typeof method === 'object' || ! method ) {
      // Constructor, method will hold its options
      args = [method];
      method = 'init';
    } else if ( methods[method] ) {
      // Method, shift method name to get its arguments
      args = Array.prototype.slice.call(arguments, 1);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.' + plugin.name );
      return this;
    }
    return this.each(function(){
      methods[method].apply($(this), args);
    });
  };
})(jQuery);