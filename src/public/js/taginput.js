// this script will, on document load, go through all elements with the "tag-input" class and convert it to the interactible we all know and love.

window.onload = function () {
	$('.tag-input').each(function (input) {
		$(this).tagsInput({ width: '500px', height: '60px' });
	});
};
