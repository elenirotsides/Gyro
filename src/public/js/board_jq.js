$('#add_task').click(function (event) {
	event.preventDefault();
	$('#task_form-area').empty();

	let requestConfig = {
		method: 'GET',
		url: '/tasks/create',
		contentType: 'application/json',
		data: JSON.stringify({})
	};
	$.ajax(requestConfig).then(function (responseMessage) {
		console.log(responseMessage);
		let newElement = $(responseMessage);
		let currentLink = $(this);
		let currentId = currentLink.data('id');

		$('#task_form-area').append(newElement);
	});
});

$('.delete_task').click(function (event) {
	let task_id = this.id.slice(15); //account for 'delete_comment_' preceding ID

	event.preventDefault();
	$('#task_form-area').empty();

	let requestConfig = {
		method: 'DELETE',
		url: `/tasks/${task_id}`,
		contentType: 'application/json',
		data: JSON.stringify({})
	};

	$.ajax(requestConfig).then(function (responseMessage) {
		console.log(responseMessage);
		let newElement = $(responseMessage);
		let currentLink = $(this);
		let currentId = currentLink.data('id');
	});

	location.reload(true);
});

$('#Task_Submit').submit(function (event) {
	$('#task_form-area').hide();
});

$('.tickets').click(function (event) {
	event.preventDefault();
	$('#task_form-area').empty();

	let requestConfig = {
		method: 'GET',
		url: `/tasks/${this.id}/edit`,
		contentType: 'application/json',
		data: JSON.stringify({})
	};
	$.ajax(requestConfig).then(function (responseMessage) {
		console.log(responseMessage);
		let newElement = $(responseMessage);
		let currentLink = $(this);
		let currentId = currentLink.data('id');

		$('#task_form-area').append(newElement);
	});
});
