!function(){
	happn.Views.MenuSlider = happn.Views.View.extend({
		
		springSystem : new SpringSystem(),
		springCache : {},

		events : {
			'touchstart .nav li' : 'navigate',
			'touchstart .make-photo' : 'isLoggedIn',
			'click .no-image' : 'isLoggedIn',
			'touchstart .meal-like' : 'like'
		},
	
		initialize : function( parent, $view, mensa ){
			this.$el = $view;
			this.mensa = mensa;
			this.requireTemplate('menuNav', 'menuBase', 'menuDay', 'menuItem', 'mealPic');
			this.fetch();
		},

		fetch : function(){
			$.getJSON("http://appserver.happn.de:8010/v2/week/" + this.mensa.id + "/" + this.timestamp(),
				this.render.bind(this))
		},

		render : function( response ){
			var dates = _.pluck(response.data, 'date').map(function(d){ 
				return d.split('.')[0];
			});

			var $nav = this.$templates.menuNav({ dates : dates, mensa : this.mensa.name }),
				$baseTmpl = this.$templates.menuBase(),
				likes = this.getStorage('likes') || [],
				tileWidth = $(window).width(),
				self = this;

			$baseTmpl.find('header').html($nav);
			
			response.data.forEach(function( day ){
				var $day = this.$templates.menuDay(day),
					$menus = $day.find('.menus');
				
				day.menus.forEach( function( menu ){
					menu.menu = menu.menu.replace('*', '<br><b>');
					menu.menu = menu.menu.replace('*', '</b><br>')
					menu.menu = menu.menu.replace(/kein Angebot/g, '');
					menu.width = menu.pictures.length * 100;

					var $menu = this.$templates.menuItem({ menu : menu });

					if( likes.indexOf(menu.mid) > -1){
						$menu.find('.meal-like').addClass('liked');
					}

					$day.append($menu);

					menu.pictures.forEach(function(p){
						this.loadPost(p, menu.mid, menu.pictures.length);
					}, this)
				}, this)

				$baseTmpl.find('#days > section').append($day);
			}, this);

			this.$el.empty().html($baseTmpl);

			this.$el.find('.meal-pictures:not(.no-image)').each(function( ele ){
				var $ele = $(this);

				$ele.cantTouchThis({
					tile : { width : tileWidth },
					tiles : $ele.children().length
				})
				.on('tileChange', self.tileChange.bind(self))
			});
				
			this.$el.find('.meal-dots').each(function(){
				$(this).find('span.dot').first().addClass('active');
			});

			// if date > 4 ? date = 4
			this.navigate(null, Math.min(4, new Date().getDay() -1 ));
		},

		loadPost : function( post_id , mid, tiles){
			$.getJSON('https://app.heythere.de/posts/' + post_id + ".json", function( post ){
				var author = _.findWhere( post.users, { id : post.author }),
					$img = this.$templates.mealPic({
						username : author.username,
						userpicture : author.picture.small,
						picture : post.meta.image.post,
						width : 100 / tiles
					});
				this.$el.find('.meal-pictures[data-mid="' + mid + '"]').append($img);
			}.bind(this));
		},

		isLoggedIn: function( event ){
			var self = this;
			event.preventDefault();
			event.stopPropagation();
			this.curMid = $(event.currentTarget).data('mid');

			if(!this.curMid){
				this.curMid = $(event.currentTarget).parents('.meal-like').data('mid');
			}

			$.ajax({method:'GET', url: 'https://app.heythere.de/user/loggedIn.json', success: function(){
				self.showPhoto();
			}, error: function(){
				self.loggIn();
			}});
		},

		loggIn: function(){
			var self = this

			$.blockUI({ message: $('#question'), css: { width: '75%', left:'12.5%', top:'15%' } });

			$('#yes').click(function( event ) { 
				event.preventDefault();

				$.ajax({method:'POST', url: 'https://app.heythere.de/user/login.json', data: {password: $('#inputPassword').val(), emailOrUsername: $('#inputEmail').val()}, success: function(){
					self.showPhoto();
				}, error: function(xhr, status, error){
					
				}});

				$.unblockUI(); 
	            return true;
        	}); 
 
	        $('#no').click(function() { 
	            $.unblockUI(); 
	            return false; 
	        });
		},

		showPhoto : function (){
			navigator.camera.getPicture(this.uploadPhoto.bind(this), function(){}, { 
				quality: 50, 
    			destinationType: Camera.DestinationType.FILE_URI 
    		}); 
		},

		uploadPhoto: function(image){
			$('.loader').fadeIn();

			var options = new FileUploadOptions();
			  	options.fileKey = "meta[image]";
			  	options.fileName = "benjamin";
			  	options.mimeType = "image/jpeg";
			  	options.params = {
			  		content : "Posted from Happn",
			  		venue :  this.mensa.id
			  	};

		 	var ft = new FileTransfer();

		  	ft.upload(image, 'https://app.heythere.de/posts/', function(r){
		  		var post = JSON.parse(r.response);
		  		this.post(post.id);
		  	}.bind(this), function(error){
		  		$('.loader').fadeOut();
		  		alert("Upload ist fehlgeschlagen");
		  	}, options);
		},

		post : function(post_id ){
			$.ajax({
				url : 'http://appserver.happn.de:8010/v2/post/' + this.curMid,
				data : {
					heythere_post_id : post_id
				},
				method : 'post',
				success : function(){
					window.location.reload(true);
				},
				error : function(x, y, z){
					$('.loader').fadeOut();
				}	
			})
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

			// this.animateSpring($posterDude);
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
			var d = new Date();
			
			if( d.getDay() === 0){ d = new Date( Date.now() + 24*60*60*1000); }
			if( d.getDay() === 6){ d = new Date( Date.now() + 24*60*60*1000*2)}

			var day = d.getDate(),
  				month = d.getMonth() + 1,
  				year = d.getFullYear();

			return (day < 10 ? '0' : '') + day + (month < 10 ? '0' : '') + month + year;
		},

		like : function( event ){
			var $target = $(event.currentTarget),
				mid = $target.data('mid'),
				likesCount = $target.data('likes'),
				likes = this.getStorage('likes') || [],
				hadAlreadyLiked = likes.indexOf(mid) != -1;

			$.post('http://appserver.happn.de:8010/v2/' + (hadAlreadyLiked ? 'unlike' : 'like') + '/' + mid + ".json").done(function(data){
				alert(JSON.stringify(data));
			});

			if( hadAlreadyLiked ){
				var index = likes.indexOf(mid);
				likes.splice(index,  1);
				$target.removeClass('liked');
				likesCount--;
			} else {
				likes.push(mid)
				$target.addClass('liked');
				likesCount++;
			}
			
			$target.data('likes', likesCount);
			$target.find('.meal-like-circle a').text(likesCount);
			this.setStorage("likes", likes);


		},
	});
}();
