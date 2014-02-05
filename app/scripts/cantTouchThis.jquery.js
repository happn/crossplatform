;(function ( $, window, document, undefined ) {
		// Create the defaults once
		var pluginName = "cantTouchThis";
        var isString = function (obj) {
          return toString.call(obj) == '[object String]';
        };

		// The actual plugin constructor
		function CantTouchThis ( element, options ) {
			this.element = $(element);
			this.container = $(options.container || element);
			this.touched = {
                start : {
                    x : 0,
                    time : 0,
                    move : 0
                },
                end : {
                    x : 0,
                    time : 0,
                    move : 0
                },
                distance : 0,
                duration : 0,
                speed : 0,
                moved : 0
            };
            this.position = 0;
            this.tiles = options.tiles || 0;
            this.tile = $.extend({
            	width : 0,
            	height : 0
            }, options.tile);
			this.init();
		}

		CantTouchThis.prototype = {
				init: function () {
					this.element
						.on('touchstart', $.proxy(this.touchStart, this))
						.on('touchend', $.proxy(this.touchEnd, this))
                        .on('touchmove', $.proxy(this.touchMove, this))
				},

				touchStart : function( event ){
					event.preventDefault();
                	this.touched.start.time = $.now();                            
                	this.touched.start.x = event.originalEvent.touches[0].pageX;
				},

				touchEnd : function( event ){
					this.touched.end.time = $.now();
                    this.touched.end.x = event.originalEvent.changedTouches[0].pageX;
                    this.touched.duration = this.touched.end.time - this.touched.start.time;
                    this.touched.distance = this.touched.end.x - this.touched.start.x;
                    this.touched.speed = Math.abs(this.touched.distance / this.touched.duration);

                    if (this.touched.speed > 0.5 || Math.abs(this.touched.distance) > (this.tile.width / 3)) {

                        if (this.touched.distance > 0 && this.position > 0) {
                            this.position--;
                            this.element.trigger('tileChange', this.position);
                        } else if (this.touched.distance < 0 && this.position < this.tiles ) {
                            this.position++;
                            this.element.trigger('tileChange', this.position);
                        }
                    }

                    this.goTo(-(this.position * this.tile.width));
				},

				touchMove : function( event ){
					event.preventDefault();
                    this.touched.moved = event.originalEvent.changedTouches[0].pageX - this.touched.start.x;
                    this.goTo(((this.touched.moved) - (this.position * this.tile.width)));
				},

                tileGoTo : function( position ){
                    console.log(position,this)
                    this.goTo(-parseInt(position)*this.tile.width);
                },

                goTo : function( position ){
                    this.container.css({ 
                        '-webkit-transform' : 'translate3d(' + position + 'px, 0, 0)',
                        '-webkit-transition' :  '400ms cubic-bezier(0.1, 0.57, 0.1, 1)',
                        'transition' : '400ms cubic-bezier(0.1, 0.57, 0.1, 1)'
                    });
                }
		};

		$.fn[ pluginName ] = function ( options, opt_arg ) {
				this.each(function() {
                    var instance = $.data( this, "plugin_" + pluginName );
					if ( !instance ) {
						$.data( this, "plugin_" + pluginName, new CantTouchThis( this, options ) );
					} else if( isString(options) && opt_arg != null ){
                        if(options == "goTo"){
                            instance.tileGoTo.call(instance, opt_arg)
                        }
                    }
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );