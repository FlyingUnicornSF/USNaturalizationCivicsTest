/**
 * Question APIs
 */

 // TODO: Investicage how to hide this in the class.
const _questionsStorageKey = 'questions';

/** TODO: Add docs. */
export class AllQuestionsStorage {
	/** TODO: Add docs. */
	static get() {
		return new Promise(resolve => {
			chrome.storage.local.get([_questionsStorageKey], function(result) {
				if (_questionsStorageKey in result) {
					resolve(result[_questionsStorageKey]);
				} else {
                    resolve([]);
				}
			});
		});
	}

	/** TODO: Add docs. */
	static set(questions) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.set({ [_questionsStorageKey]: questions }, function() {
				var error = chrome.runtime.lastError;
				if (error) {
					console.error(error);
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	static removeAll() {
		return new Promise((resolve, reject) => {
			chrome.storage.local.remove(_questionsStorageKey, function() {
				var error = chrome.runtime.lastError;
				if (error) {
					console.error(error);
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}

/**
 * Unanswered Question Indexes APIs
 */

const _unansweredIndexesStorageKey = 'unanswered';

/** TODO: Add docs. */
export class UnansweredQuestionIndexesStorage {
	/** TODO: Add docs. */
	static get() {
		let indexes = [];
		let indexesString = window.localStorage.getItem(
			_unansweredIndexesStorageKey
		);
		if (typeof indexesString === 'string') {
			indexes = JSON.parse(indexesString);
		}
		return indexes;
	}

	/** TODO: Add docs. */
	static set(indexes) {
		let indexesString = JSON.stringify(indexes);
		window.localStorage.setItem(
			_unansweredIndexesStorageKey,
			indexesString
		);
	}

	/** TODO: Add docs. */
	static remove(index) {
		let indexes = UnansweredQuestionIndexesStorage.get();
		indexes = indexes.filter(value => value !== index);
		UnansweredQuestionIndexesStorage.set(indexes);
	}

	/** TODO: Add docs. */
	static removeAll() {
		window.localStorage.removeItem(_unansweredIndexesStorageKey);
	}
}
