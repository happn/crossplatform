!function(){
	happn.Views.RootView = happn.Views.View.extend({
		router : new Backbone.Router(),
		
		currentMensa : null,
		currentUser : null, 

		initialize : function( options ){
			this.currentMensa = this.getStorage("mensa");
			this.currentUser = this.getStorage("user");	
			var uuid = this.getStorage('uuid');

			if(!uuid){
				var uuid = Math.random().toString().substring(2,8);

				if(typeof device != "undefined" && device.uuid){
					uuid = device.uuid;	
				}

				this.setStorage('uuid', uuid);
			}
			
			this.on('mensa-change', function( mensa ){
				this.currentMensa = mensa;
				this.setStorage("mensa", mensa);
			});

			this.on('navigate', function( route ){
				this.router.navigate(route, {trigger : true });
			}.bind(this));

			this.setupRouting();
			
			if( !this.currentMensa){
				this.router.navigate('select-mensa', {trigger: true, replace: true});
			} else {
				this.router.navigate('menu', {trigger: true, replace: true});
			}
		},

		setupRouting : function(){
			this.router.route('select-mensa', function(){
				var $div = $('<div />');
				$('.viewport').empty().append($div);
				this.view = new happn.Views.MensaChooser( this, $div );
			}.bind(this));

			this.router.route('show-map', function(){
				this.view = new happn.Views.MensaChooser( this, $('.viewport'));
			}.bind(this));

			this.router.route('menu', function(){
				this.view = new happn.Views.MenuSlider( this, $('.viewport'), this.currentMensa); 
			}.bind(this));

			Backbone.history.start(); 
		},

		render : function(){

		}
	});


}();