;(function ( $, window, document, undefined ) {
		// Create the defaults once
		var pluginName = "cantTouchThis";

		// The actual plugin constructor
		function CantTouchThis ( element, options ) {
			this.element = $(element);
			this.container = $(options.container);
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

                    this.container.css({ 
                        '-webkit-transform' : 'translate3d(' + -(this.position * this.tile.width) + 'px, 0, 0)',
                        '-webkit-transition' :  '400ms cubic-bezier(0.1, 0.57, 0.1, 1)',
                        'transition' : '400ms cubic-bezier(0.1, 0.57, 0.1, 1)'
                    });
				},

				touchMove : function( event ){
					event.preventDefault();
                    this.touched.moved = event.originalEvent.changedTouches[0].pageX - this.touched.start.x;
                    
                    this.container.css({ 
                        '-webkit-transform' : 'translate3d(' + ((this.touched.moved) - (this.position * this.tile.width)) + 'px, 0, 0)',
                        '-webkit-transition' :  '400ms cubic-bezier(0.1, 0.57, 0.1, 1)',
                        'transition' : '400ms cubic-bezier(0.1, 0.57, 0.1, 1)'
                    });
				}
		};

		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
					if ( !$.data( this, "plugin_" + pluginName ) ) {
						$.data( this, "plugin_" + pluginName, new CantTouchThis( this, options ) );
					}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );