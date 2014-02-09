!function(){
	happn.Views.MenuSlider = happn.Views.View.extend({
		
		springSystem : new SpringSystem(),
		springCache : {},

		events : {
			'touchstart .nav li' : 'navigate',
			'click #make-photo' : 'showPhoto'
		},
	
		initialize : function( parent, $view ){
			this.$el = $view;
			this.requireTemplate('menuNav', 'menuBase', 'menuDay', 'menuItem');
			this.fetch();
		},

		fetch : function(){
			$.getJSON("http://appserver.happn.de:8010/v1/week/" + this.timestamp(),
				this.render.bind(this))
		},

		render : function( response ){
			var dates = _.pluck(response.data, 'date').map(function(d){ 
				return d.split('/')[1];
			});

			var $nav = this.$templates.menuNav({ dates : dates}),
				$baseTmpl = this.$templates.menuBase(),
				self = this;

			$baseTmpl.find('header').html($nav);
			
			response.data.slice(0, 5).forEach(function( day ){
				var $day = this.$templates.menuDay(day),
					$menus = $day.find('.menus');

				//replace
				day.menu_a.name = "Menü A";
				day.menu_b.name = "Menü B";

				var $menu_a = this.$templates.menuItem({ menu : day.menu_a });
				var $menu_b = this.$templates.menuItem({ menu : day.menu_b });

				$menus.prepend($menu_b  );
				$menus.prepend($menu_a  );
				//$menus.append( this.templates.menuItem({ menu : day.menu_b }) );
				//$menus.append( this.templates.menuItem({ menu : day.menu_b }) );
				

				$baseTmpl.find('#days > section').append($day);
			}, this);

			this.$el.empty().html($baseTmpl);

			this.$el.find('.meal-pictures')
				.cantTouchThis({
					tile : { width : $(window).width() },
					tiles : 2
				})
				.on('tileChange', this.tileChange.bind(this))
				.each(function( n, elem ){
					self.addSpring($(elem).find('.poster-dude').eq(0));
				})

			this.$el.find('.meal-dots').each(function(){
				$(this).find('span.dot').first().addClass('active');
			});

			// if date > 4 ? date = 4
			this.navigate(null, Math.min(4, new Date().getDay() ));
		},

		showPhoto : function (){
			$.blockUI({ message: $('#question'), css: { width: '275px' } });

			$('#yes').click(function() { 
	            // update the block message 
	            $.blockUI({ message: "<h1>Remote call in progress...</h1>" }); 
	 
	            $.ajax({ 
	                url: 'wait.php', 
	                cache: false, 
	                complete: function() { 
	                    // unblock when remote call returns 
	                    $.unblockUI(); 
	                } 
	            }); 
        	}); 
 
	        $('#no').click(function() { 
	            $.unblockUI(); 
	            return false; 
	        });
		},

		addSpring : function( $elem ){
			var id = $elem.data("spring_id");

			if( id && id in this.springCache ){
				return this.springCache[id];
			}  

			id = Math.random().toString().substring(2,8);
			var spring = happn.Utils.createSpring(new SpringSystem(), 10, 3);
			
			spring.addListener({
				el: $elem[0],
				onSpringUpdate: function(spring) {
					happn.Utils.xlat(this.el, 0, spring.getCurrentValue() * 50);
				}
			});

			spring.setCurrentValue(1);

			this.springCache[id] = spring;
			$elem.data("spring_id", id);

			return spring;
		},

		tileChange : function(event, nr){
			var $this = $(event.currentTarget),
				$dots = $this.prev(),
				$posterDude = $this.parent('.meal').find('.meal-picture').eq(nr).find('.poster-dude');
			
			$dots.find('span.dot').removeClass('active');
			$dots.find('span.dot').eq(nr).addClass('active');

			this.animateSpring($posterDude);
		},

		animateSpring : function( $elem ){
			if(this.spring){
				var oldSpring = this.spring;
				setTimeout(function(){
					oldSpring.setEndValue(1);
				}, 200);
			}

			this.spring = this.addSpring( $elem );
			this.spring.setEndValue(0);
		},

		updateNav : function( event, nr ){
			this.$el.find('.nav li').removeClass('active').eq(nr).addClass('active');
		},

		navigate : function( event, index ){

			if( index == null ){
				index = $(event.currentTarget).data('index');
			}

			var position = - index * $(window).width();

			$('#days').css({ 
                '-webkit-transform' : 'translate3d(' + position + 'px, 0, 0)',
                '-webkit-transition' :  '400ms cubic-bezier(0.1, 0.57, 0.1, 1)',
                'transition' : '400ms cubic-bezier(0.1, 0.57, 0.1, 1)'
            });

            $(document).scrollTop(true)

            this.updateNav(null, index);
            
            event && event.preventDefault();
		},

		timestamp : function(){
			var d = new Date(),
  				day = d.getDate(),
  				month = d.getMonth() + 1,
  				year = d.getFullYear();

			return (day < 10 ? '0' : '') + day + (month < 10 ? '0' : '') + month + year;
		},
	});
}();