!function(){
	happn.Views.MenuSlider = happn.Views.View.extend({
	

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
				$baseTmpl = this.$templates.menuBase();

			$baseTmpl.find('header').html($nav);
			
			response.data.slice(0, 5).forEach(function( day ){
				var $day = this.$templates.menuDay(day),
					$menus = $day.find('.menus');

				//replace
				day.menu_a.name = "Menü A";
				day.menu_b.name = "Menü B";

				$menus.append( this.templates.menuItem({ menu : day.menu_a }) );
				$menus.append( this.templates.menuItem({ menu : day.menu_b }) );
				//$menus.append( this.templates.menuItem({ menu : day.menu_b }) );
				//$menus.append( this.templates.menuItem({ menu : day.menu_b }) );

				$baseTmpl.find('#days > section').append($day);
			}, this);

			this.$el.empty().html($baseTmpl);
			
			$('.viewport').cantTouchThis({
				container: $baseTmpl.find('#days'),
				tile : { width : $(window).width() },
				tiles : 4
			}).on('tileChange', this.updateNav.bind(this));
		},

		updateNav : function( event, nr ){
			this.$el.find('.nav li').removeClass('active').eq(nr).addClass('active');
		},

		timestamp : function(){
			var d = new Date(),
  				day = d.getDate(),
  				month = d.getMonth() + 1,
  				year = d.getFullYear();

			return (day < 10 ? '0' : '') + day + (month < 10 ? '0' : '') + month + year;
		}
	});
}();