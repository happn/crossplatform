!function(){
	happn.Views.View = Backbone.View.extend({
		requireTemplate : function(){
			var ctx = this;
			
			if(!this.templates) this.templates = {};
			if(!this.$templates) this.$templates = {};

			[].slice.call(arguments).forEach(function( name ){
				var tmpl = document.getElementById('template-' + name).innerHTML;
				var fn = _.template(tmpl);

				this.templates[ name ] = fn;
				this.$templates[ name ] = function(){
					return $( $.parseHTML( fn.apply(ctx, arguments) ) );
				};
			}, this);
		},

		setStorage : function( key, value ){
			localStorage.setItem("happn-" + key, JSON.stringify(value));
		},

		getStorage : function( key ){
			return JSON.parse(localStorage.getItem( "happn-" + key ));
		}		
	})
}();