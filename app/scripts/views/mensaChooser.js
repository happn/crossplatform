!function(){
	happn.Views.MensaChooser = happn.Views.View.extend({
		mensa : null,

		initialize : function( parent, $view, mensa ){
			this.parent = parent;
			
			if(mensa){
				this.mensa = mensa;
			}

			this.$el = $view;
			this.requireTemplate('mensen');
			this.fetch();
		},

		events : {
			'click li' : 'selectMensa',
			'click button' : 'close'
		},

		fetch : function(){
			$.getJSON('mensen.json', this.render.bind(this));
		},

		render : function( data ){
			if(data){
				this.mensen = new Backbone.Collection(data.mensen);
			}

			this.$templates.mensen(data).appendTo(this.$el);
		},

		selectMensa : function( event ){
			var $target = $(event.currentTarget);

			this.mensa = this.mensen.findWhere({ id : $target.data('id') });
			this.parent.trigger('mensa-change', this.mensa.toJSON() );

			this.$el.find('li.selected').removeClass('selected');
			$target.addClass('selected');
			event.preventDefault();
		},

		close : function(){
			if(this.mensa){
				this.parent.trigger('navigate', 'menu');
				this.remove();
			}
		}
	})
}();