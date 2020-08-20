var storedId;

$('#add_task')
	.unbind()
	.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		$('#task_form-area').empty();

		let requestConfig = {
			method: 'GET',
			url: '/tasks/create',
			contentType: 'application/json',
			data: JSON.stringify({})
		};
		$.ajax(requestConfig).then(function (responseMessage) {
			let newElement = $(responseMessage);

			$('#task_form-area').append(newElement);
			initTagInputs();
		});
	});

$('#Task_Submit').submit(function (event) {
	$('#task_form-area').hide();
});
$('.tickets').on('click', function (event) {
	event.preventDefault();
	storedId = this.id;

	let requestConfig = {
		method: 'GET',
		url: `/tasks/${this.id}/view`,
		contentType: 'application/json',
		data: JSON.stringify({}),
		success: function (response) {
			console.log('success:' + JSON.stringify(response));
			let newElement = $(response);
			$('#task_form-area').empty();
			$('#task_form-area').append(newElement);
			initTagInputs();
		},
		error: function (error) {
			console.log('error: ' + JSON.stringify(error));
		}
	};
	$.ajax(requestConfig);
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
function displayComments() {
	console.log(storedId);
	let requestConfig2 = {
		method: 'GET',
		url: `/tasks/${storedId}/view`,
		contentType: 'application/json',
		data: JSON.stringify({})
	};
	$.ajax(requestConfig2)
		.then(function (responseMessage) {
			let newElement = $(responseMessage);

			$('#task_form-area').empty();
			$('#task_form-area').append(newElement);
			initTagInputs();
		})
		.catch(function (error) {
			console.log('error: ' + JSON.stringify(responseMessage));
		});
}
$('#comment_form').submit(function (event) {
	let task_id = $(this).attr('data-task_id');

	event.preventDefault();
	event.stopPropagation();

	var data = {};
	data.comment = document.getElementById('comment').value;
	let requestConfig = {
		method: 'POST',
		url: `/tasks/` + task_id + `/comments/create`,
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (responseMessage) {
			displayComments();
		},
		error: function (error) {
			console.log('Error: ' + JSON.stringify(error));
		}
	};
	$.ajax(requestConfig);
});

function getFormObj(form) {
	var formObj = {};
	var inputs = form.serializeArray();
	$.each(inputs, function (i, input) {
		formObj[input.name] = input.value;
	});
	return formObj;
}

$('#task_form').submit(function (event) {
	event.preventDefault();
	let url = $(this).attr('action');

	let data = getFormObj($(this));

	console.log(data);
	console.log(JSON.stringify(data));

	$.ajax({
		method: 'POST',
		url: url,
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			window.location.replace('/');
		},
		error: function (error) {
			$('#taskFormError')
				.show()
				.html(
					'Error submitting: check that tags are less than 25 characters long.'
				);
		}
	});
});
