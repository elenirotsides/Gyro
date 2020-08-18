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
		initTagInputs();
	});
});

$('#Task_Submit').submit(function (event) {
	$('#task_form-area').hide();
});
$('.tickets').on('click', function (event) {
	event.preventDefault();

	let requestConfig = {
		method: 'GET',
		url: `/tasks/${this.id}/view`,
		contentType: 'application/json',
		data: JSON.stringify({})
	};
	$.ajax(requestConfig).then(function (responseMessage) {
		console.log(responseMessage);
		let newElement = $(responseMessage);

		$('#task_form-area').empty();
		$('#task_form-area').append(newElement);
		initTagInputs();
	});
});

$('.edit_task').click(function (event) {
	let task_id = $(this).attr('data-task_id'); //account for 'edit_' preceding ID

	event.preventDefault();
	event.stopPropagation();

	let requestConfig = {
		method: 'GET',
		url: `/tasks/${task_id}/edit`,
		contentType: 'application/json',
		data: JSON.stringify({}),
		success: function (responseMessage) {
			let newElement = $(responseMessage);
			$('#task_form-area').empty();
			$('#task_form-area').append(newElement);
			initTagInputs();
		},
		error: function (error) {
			console.log('Error: ' + error);
		}
	};
	$.ajax(requestConfig);
});

$('.delete_task').click(function (event) {
	let task_id = $(this).attr('data-task_id');

	event.preventDefault();
	event.stopPropagation();

	let requestConfig = {
		method: 'POST',
		url: `/tasks/${task_id}/delete`,
		contentType: 'application/json',
		data: JSON.stringify({}),
		success: function (responseMessage) {
			let newElement = $(responseMessage);
			$('#task_form-area').empty();
			initTagInputs();
			location.reload(true);
		},
		error: function (error) {
			console.log('Error: ' + error);
		}
	};
	$.ajax(requestConfig);
});
