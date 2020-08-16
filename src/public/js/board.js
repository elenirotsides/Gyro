function allowDrop(ev) {
	ev.preventDefault();
	return event.target.className == 'drop-target';
}

function drag(ev) {
	ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	if (!allowDrop(ev)) return;

	// move the HTML element
	var taskID = ev.dataTransfer.getData('text');
	ev.target.appendChild(document.getElementById(taskID));

	let newTaskStage = $(ev.target).attr('task-stage');
	console.log('change to ' + newTaskStage);
	console.log(taskID);

	let command = {
		_id: taskID,
		stage: newTaskStage
	};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(command),
		contentType: 'application/json',
		url: '/tasks/<ID>/drag',
		success: function (res) {
			console.log('success');
			console.log(JSON.stringify(res));
		},
		error: function (res) {
			console.log('failed to update stage');
		}
	});
}

$('#add_task').click(function () {
	let addTaskArea = $('#add_task-area');

	event.preventDefault();

	let requestConfig = {
		method: 'GET',
		url: '/tasks/create',
		contentType: 'application/json',
		data: JSON.stringify({})
	};
	$.ajax(requestConfig).then(function (responseMessage) {
		console.log(responseMessage);
		var newElement = $(responseMessage);
		var currentLink = $(this);
		var currentId = currentLink.data('id');

		addTaskArea.append(newElement);
	});
});

$('#Task_Submit').submit(function () {
	$('#add_task-area').hide();
});
