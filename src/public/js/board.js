function getDropTarget(element) {
	let currentElement = $(element);
	if (currentElement.hasClass('drop-target')) return element;

	let ancestry = currentElement.parents();
	let result = null;
	ancestry.each(function () {
		if ($(this).hasClass('drop-target')) result = this;
	});
	return result;
}

function hasDropTarget(event) {
	let res = getDropTarget(event.target) !== null;
	return res;
}

function drag(ev) {
	console.log('drag start');
	console.log(ev);
	ev.dataTransfer.setData('id', ev.target.id);
}

function drop(ev) {
	console.log('ayy');
	ev.preventDefault();
	console.log(hasDropTarget(ev));
	if (!hasDropTarget(ev)) return;
	let dropTarget = getDropTarget(ev.target);

	// move the HTML element
	var taskID = ev.dataTransfer.getData('id');
	console.log(taskID);
	console.log(dropTarget);
	dropTarget.appendChild(document.getElementById(taskID));

	let newTaskStage = $(dropTarget).attr('task-stage');
	console.log('change to ' + newTaskStage);
	console.log(taskID);

	let command = {
		stage: newTaskStage
	};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(command),
		contentType: 'application/json',
		url: '/tasks/' + taskID + '/drag',
		success: function (res) {
			console.log('success');
			console.log(JSON.stringify(res));
		},
		error: function (res) {
			console.log('failed to update stage');
		}
	});
}

$(function () {
	$('.drop-target').each(function () {
		$(this).on('drop', function (event) {
			drop(event.originalEvent);
		});
		$(this).on('dragover', function (event) {
			return !hasDropTarget(event.originalEvent);
		});
	});
	$('.tickets').each(function () {
		$(this).on('dragstart', function (event) {
			drag(event.originalEvent);
		});
	});
});
