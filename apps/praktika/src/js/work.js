$(function() {

	$('.gallery-block').each(function() {
		var $this = $(this);

		var gallery = new Swiper($this.children('.swiper-container'), {
			keyboardControl: true,
			nextButton: $this.children('.swiper-button-next'),
			prevButton: $this.children('.swiper-button-prev'),
			spaceBetween: 40,
			autoHeight: true,
			slidesPerView: 1,

			preloadImages: false,
			lazyLoading: true,
			lazyLoadingInPrevNext: true,
			lazyLoadingInPrevNextAmount: 2
		});

		gallery.once('lazyImageReady', function(swiper) {
			setTimeout(function() {
				$(swiper.wrapper).height($(swiper.slides).eq(swiper.activeIndex).height());
			}, 300);
		});

	});

	var $images = $('.image').one('load', function(e) {
		$(this).parent('.image_item').addClass('loaded');
	});

	var $document = $(document).on('scroll', function(e) {

		$images.each(function() {
			var $this = $(this);
			var height = $(window).height();

			if ($document.scrollTop() + height + ($document.width() / height < 1 ? 100 : -100) > $this.offset().top) {
				$this.attr('src', $this.attr('data-src'));

				if ($images.length - 1 > 0) {
					$images = $images.not(this);
				} else {
					$document.off('scroll');
				}
			}
		});
	});

});