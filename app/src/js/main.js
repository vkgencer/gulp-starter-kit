var app;
app = {
	
	init: function() {
		console.log('init')
		this.mainMenu();
		this.mainSlider.init();
		this.featuredProducts.init();
		this.opportunityProducts.init();
		this.topSellerProducts.init();
		this.discoverProducts.init();
		this.cartPieceCharger.init();
	},
	
	mainMenu: function() {
		$('.menu-toggle').on('click', function() {
			$(this).parent().toggleClass('opened');
		});
	},
	mainSlider: {
		$el: $(".main-slider"),
		init: function() {
			this.$el.slick()
		},
	},
	featuredProducts: {
		$el: $(".featured-products"),
		init: function() {
			this.tabClick()
		},
		tabClick: function() {
			
			var _self = this;
			
			this.$el.find("nav li a").on('click', function() {
				
				if ($(this).parent().hasClass('active')) {
					return false;
				}
				
				_self.$el.find("nav li").removeClass("active");
				$(this).parent().addClass("active");
				$("#featuredProducts").prev().show();
				$("#featuredProducts").empty();
				
				var data = _self.getContent($(this).data('key'));
				
				data.then(function(response) {
					
					$("#featuredProducts").prev().hide();
					
					if (response !== undefined && response.length > 0) {
						
						if ($("#featuredProducts").hasClass('slick-slider')) {
							$("#featuredProducts").removeClass('slick-initialized slick-slider');
							$("#featuredProducts").slick('unslick');
							$("#featuredProducts").empty();
						}
						
						for (var i = 0; i < response.length; i++) {
							var template = '<div class="product">' +
								'<a href="javascript:;">' +
								'<span class="img">' +
								'<img src="' + response[i].img + '" alt=""/>' +
								'</span>' +
								'<span class="title">' + response[i].title + '</span>' +
								'<span class="desc">' + response[i].desc + '</span>' +
								'<span class="price">' +
								'<span class="old-price">' + response[i].oldPrice.toFixed(2) + '</span>' + response[i].price.toFixed(2) + '</span>' +
								'<span class="shipping">' +
								'<i class="icon-shipping"></i> 100 TL Üzeri Kargo Bedava' +
								'</span>' +
								'</a>' +
								'</div>'
							$("#featuredProducts").append(template);
						}
						
						_self.initSlider()
						
					}
				})
				
			})
			
			this.$el.find("nav li a").eq(0).click();
			
		},
		getContent: function(key) {
			var _self = this;
			return $.getJSON('_assets/json/' + key + '.json', function(response) {
				return response
			}).catch(function(e) {
				$("#featuredProducts").prev().hide();
				
				if (_self.$el.find(".product-list").hasClass('slick-slider')) {
					_self.$el.find(".product-list").removeClass('slick-initialized slick-slider');
					_self.$el.find(".product-list").slick('unslick');
					_self.$el.find(".product-list").empty();
				}
				
				$("#featuredProducts").append('<p class="no-content">İçerik bulunamadı...</p>')
			})
		},
		initSlider: function() {
			
			var _self = this;
			
			if (_self.$el.find(".product-list").hasClass('slick-slider')) {
				_self.$el.find(".product-list").removeClass('slick-initialized slick-slider');
				_self.$el.find(".product-list").slick('unslick');
			}
			
			_self.$el.find(".product-list").slick({
				infinite: false,
				slidesToShow: 5,
				slidesToScroll: 5
			})
			
		}
	},
	topSellerProducts: {
		$el: $('.top-seller-products'),
		init: function() {
			this.$el.find(".product-list").slick({
				infinite: true,
				slidesToShow: 5,
				slidesToScroll: 5
			})
		}
	},
	opportunityProducts: {
		$el: $('.opportunity-products'),
		init: function() {
			this.$el.find(".product-list").slick({
				infinite: true,
				slidesToShow: 5,
				slidesToScroll: 5
			})
		}
	},
	discoverProducts: {
		$el: $(".discover-products"),
		init: function() {
			this.tabClick()
		},
		tabClick: function() {
			
			var _self = this;
			
			this.$el.find("nav li a").on('click', function() {
				
				_self.$el.find("nav li").removeClass("active");
				$(this).parent().addClass("active");
				$("#discoverProducts").prev().show();
				$("#discoverProducts").empty();
				
				var data = _self.getContent($(this).data('key'));
				
				data.then(function(response) {
					
					$("#discoverProducts").prev().hide();
					
					if (response !== undefined && response.length > 0) {
						
						for (var i = 0; i < response.length; i++) {
							var template = '<div class="product">' +
								'<a href="javascript:;">' +
								'<span class="img">' +
								'<img src="' + response[i].img + '" alt=""/>' +
								'</span>' +
								'<span class="title">' + response[i].title + '</span>' +
								'<span class="desc">' + response[i].desc + '</span>' +
								'<span class="price">' +
								'<span class="old-price">' + response[i].oldPrice.toFixed(2) + '</span>' + response[i].price.toFixed(2) + '</span>' +
								'<span class="shipping">' +
								'<i class="icon-shipping"></i> 100 TL Üzeri Kargo Bedava' +
								'</span>' +
								'</a>' +
								'</div>'
							$("#discoverProducts").append(template);
						}
					}
				})
				
			})
			
			this.$el.find("nav li a").eq(0).click();
			
		},
		getContent: function(key) {
			return $.getJSON('_assets/json/' + key + '.json', function(response) {
				return response
			}).catch(function(e) {
				$("#discoverProducts").prev().hide();
				$("#discoverProducts").append('<p class="no-content">İçerik bulunamadı...</p>')
			})
		},
	},
	
	cartPieceCharger: {
		init: function() {
			
			$(".my-cart .piece .add").on('click', function() {
				var el = $(this).parent().find('input');
				el.val(parseFloat(el.val()) + 1)
			});
			
			$(".my-cart .piece .remove").on('click', function() {
				var el = $(this).parent().find('input');
				
				if (el.val() !== "1") {
					el.val(parseFloat(el.val()) - 1)
				}
				
			});
			
		}
	}
	
};

app.init()