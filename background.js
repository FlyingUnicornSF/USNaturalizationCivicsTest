chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.clear(function() {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
			message.innerText = error;
		} else {
			console.log("Good to start!")
		};
	});
	localStorage.removeItem('unanswered');
});
