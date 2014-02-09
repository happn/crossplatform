!function(){
	happn.Views.MensaChooser = happn.Views.View.extend({
		mensa : null,

		initialize : function( parent, $view, mensa ){
			this.parent = parent;
			
			if(mensa){
				this.mensa = mensa;
			}

			this.$el = $view;
			this.requireTemplate('mensen','map');
			this.fetch();
		},

		events : {
			'click li' : 'selectMensa',
			'click .direct' : 'close',
			'click .position' : 'fuckYouMap'
		},

		fetch : function(){
			$.getJSON('mensen.json', this.render.bind(this));
		},

		render : function( data, map ){
			if(data){
				this.mensen = new Backbone.Collection(data.mensen);
			}
			if (map == 'map'){
				this.$templates.map().appendTo(this.$el.empty());
			}
			else{
				this.$templates.mensen(data).appendTo(this.$el.empty());
			}
		},

		selectMensa : function( event ){
			var $target = $(event.currentTarget);

			this.mensa = this.mensen.findWhere({ id : $target.data('id') });
			this.parent.trigger('mensa-change', this.mensa.toJSON() );

			this.$el.find('li.selected').removeClass('selected');
			$target.addClass('selected');
			event.preventDefault();
		},

		fuckYouMap : function(){
			this.render(null,'map');
			this.showMap();
		},

		showMap : function( event ){

			var nearestMensa = function(position){

				var nearest = Infinity;
				var nearestMensa = null;

				console.log(this.mensen);

				this.mensen.forEach(function( mensa ){
	    			var dist = calcDistance(position, mensa.get('location').lat, mensa.get('location').lng)
	    
				    if(dist < nearest){
				        nearest = dist;
				        nearestMensa = mensa;
				    }
				});

				return nearestMensa;

				/*
				$.getJSON('mensen.json', function(data){
					var mensen = new Backbone.Collection(data.mensen);

					mensen.forEach(function( mens ){
	    				var dist = calcDistance(position, mens.get('location').lat, mens.get('location').lng)
	    
				    	if(dist < nearest){
				        	nearest = dist;
				        	mensa = mens;
				    	}
					});

					return mensa;
				});*/
			}

			var calcDistance = function(position, lat1, lon1){

				var lat2 = position.coords.latitude;
                var lon2 = position.coords.longitude;

				var R = 6371; // km
				var dLat = (lat2-lat1).toRad();
				var dLon = (lon2-lon1).toRad();
				var lat1 = lat1.toRad();
				var lat2 = lat2.toRad();

				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = R * c;

				return d;
			}
			
			var onSuccess = function(position) {//position

				var mensa = nearestMensa.call(this, position);

				console.log(mensa.get('name'));

                var myLat = mensa.get('location').lat;
                var myLong = mensa.get('location').lng;

                //MAP
                var mapOptions = {
                    center: new google.maps.LatLng(myLat, myLong),
                    zoom: 17,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                };

            	var map = new google.maps.Map(document.getElementById('map-panel'),
                                              mapOptions);

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(myLat, myLong),
                    map: map
                });

                infoWindow = new google.maps.InfoWindow();
    			infoWindow.setOptions({
        			content: "<div>" + mensa.get('name') + "</div>",
        			minWidth: 150,
        			//position: new google.maps.LatLng(48.05007, 8.20634)
    			});
    			infoWindow.open(map, marker); 
            }

            // onError Callback receives a PositionError object
			//
			function onError(error) {
			    alert('code: '    + error.code    + '\n' +
			          'message: ' + error.message + '\n');
			}

			navigator.geolocation.getCurrentPosition(onSuccess.bind(this), onError);

            //onSuccess(48.05007, 8.20634);		
		},

		close : function(){
			if(this.mensa){
				this.remove();
				this.parent.trigger('navigate', 'menu');
			}
		}
	})
}();