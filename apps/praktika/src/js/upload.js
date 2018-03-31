$(function() {

	$('.images_upload_preview').sortable({
		placeholder: 'placeholder',
		cancel: '.image_description, .image_delete, .image_size, .image_gallery, .image_main',
		sort: function(e) {
			$('.image_description').removeClass('show');
		}
	});

	$('.upload_placeholder').on('click', function(event) {
		$(this).remove();
	});

	$(document).on('mouseup', function(event) {
		if (!/image_description|toggle_eng|image_size|image_gallery/.test(event.target.className)) {
			$('.image_description').removeClass('show');
		}
	});

	$(document).on('click', '.image_upload_preview', function() {
		$('.image_description').removeClass('show');
		$(this).children('.image_description').addClass('show');
		return false;
	});

	$(document).on('click', '.image_upload_preview > .image_delete', function(event) {
		$(this).parent('.image_upload_preview').remove();
	});

	$(document).on('click', '.image_gallery', function(event) {
		var $this = $(this);

		if ($this.children('input').val() == 'true') {
			$this.children('.label').text('---');
			$this.children('input').val('false');
		} else {
			$this.children('.label').text('+++');
			$this.children('input').val('true');
		}
	});

	$(document).on('click', '.image_holder', function(event) {
		var $this = $(this);

		if ($this.children('input').val() == 'true') {
			$this.children('.label').text('◦');
			$this.children('input').val('false');
		} else {
			$this.children('.label').text('●');
			$this.children('input').val('true');
		}
	});

	$(document).on('click', '.image_style', function(event) {
		var $this = $(this);

		var arr_label = ['чф/бт', 'чт/бф'];
		var arr_style = ['white', 'black'];

		var current = $this.children('.label').text();
		var index = arr_label.indexOf(current);

		index + 1 >= arr_label.length
			? index = 0
			: index += 1;

		$this.children('.label').text(arr_label[index]);
		$this.children('input').val(arr_style[index]);
	});

	$('.images_upload_preview').filedrop({
		url: '/admin/preview',
		paramname: 'image',
		fallback_id: 'upload_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 12,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image = $('<div />', {'class': 'image_upload_preview', 'style': 'background-image:url(' + response + ')'});
			var image_delete = $('<div />', {'class': 'image_delete', 'text': '×'});

			var image_style = $('<div />', {'class': 'image_style'});
			var style_label = $('<span />', { 'class': 'label', 'text': 'чф/бт'});
			var style_form = $('<input />', {'class': 'style_form', 'type': 'hidden', 'name': 'images[style][]', 'value': 'white'});

			var image_holder = $('<div />', {'class': 'image_holder'});
			var holder_label = $('<span />', { 'class': 'label', 'text': '◦'});
			var holder_form = $('<input />', {'class': 'holder_form', 'type': 'hidden', 'name': 'images[holder][]', 'value': 'false'});

			var image_description = $('<div />', {'class': 'image_description'});
			var desc_ru = $('<textarea />', {'class': 'image_description_input ru_img', 'name': 'images[description][ru][]', 'placeholder':'Описание'});
			var desc_en = $('<textarea />', {'class': 'image_description_input en_img', 'name': 'images[description][en][]', 'disabled':'disabled', 'placeholder':'Description'});
			var image_form = $('<input />', {'class': 'image_form', 'type': 'hidden', 'name': 'images[path][]', 'value': response});
			$('.images_upload_preview').append(image.append(image_delete, image_style.append(style_label, style_form), image_holder.append(holder_label, holder_form), image_form, image_description.append(desc_ru, desc_en)));
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.images_upload_preview').css('outline', 'none');
		}
	});

});