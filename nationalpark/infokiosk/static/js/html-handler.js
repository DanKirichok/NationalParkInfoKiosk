/**
 * All functions in this file handle adding HTML code for each individual
 * National Park when it is selected by the user and populating it with
 * the correct information in their proper formats
 */

function addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates, isDesig) {
	resultsCounter += 1;
	
	var parkResultHTML;
	
	if (isDesig) {		
		parkResultHTML = ` 
			<a id = ${parkCode} class="list-group-item list-group-item-action flex-column align-items-start park-result list-group-item-primary">
				<div class="d-flex w-100 justify-content-between">
				  <h5 class="mb-1 park-name"><strong>${parkName}</strong></h5>
				  <small class = "park-desig">${parkDesig}</small>
				</div>
				<small class="text-muted">${parkStates}</small>
			</a>
		`
	} else {
		parkResultHTML = ` 
			<a id = ${parkCode} class="list-group-item list-group-item-action flex-column align-items-start park-result">
				<div class="d-flex w-100 justify-content-between">
				  <h5 class="mb-1 park-name"><strong>${parkName}</strong></h5>
				  <small class = "park-desig">${parkDesig}</small>
				</div>
				<small class="text-muted">${parkStates}</small>
			</a>
		`
	}
	$("#search-results-list").append(parkResultHTML);
}

function addVisitorCenter(centerName, centerDesc, centerURL) {
	var visitorCenterHTML;
	
	// Sometimes the campUrl can be blank, so button if it is
	if (centerURL.length > 0) {
		visitorCenterHTML = `
			<div class="card animated fadeIn">
				<div class="card-body">
					<h5 class="card-title">${centerName}</h5>
					<p class="card-text">${centerDesc}</p>
					<a href=${centerURL} target="_blank" class="card-link">Center Site</a>
				</div>
			</div>
		`
	} else {
		visitorCenterHTML = `
			<div class="card animated fadeIn">
				<div class="card-body">
					<h5 class="card-title">${centerName}</h5>
					<p class="card-text">${centerDesc}</p>
				</div>
			</div>
		`
	}
		
	$("#park-vc-modal").append(visitorCenterHTML);
}

function addCampground(campName, campDesc, campURL) {
	var campgroundHTML;
	
	// Sometimes the campUrl can be blank, so button if it is
	if (campURL.length > 0) {
		campgroundHTML = `
			<div class="card animated fadeIn">
				<div class="card-body">
					<h5 class="card-title">${campName}</h5>
					<p class="card-text">${campDesc}</p>
					<a href=${campURL} target="_blank" class="card-link">Center Site</a>
				</div>
			</div>
		`
	} else {
		campgroundHTML = `
			<div class="card animated fadeIn">
				<div class="card-body">
					<h5 class="card-title">${campName}</h5>
					<p class="card-text">${campDesc}</p>
				</div>
			</div>
		`
	}
	
	$("#park-cg-modal").append(campgroundHTML);
}

function addEvent(eventLoc, eventDate, eventDesc, eventURL, eventTitle) {
	var eventHTML;
	
	if (eventURL.length > 0) {
		eventHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${eventTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${eventDesc}</p>
					<p class="card-text">${eventLoc}</p>
					<a href=${eventURL} target="_blank" class="card-link">More information about the event</a>
				</div>
				<div class="card-footer">
					${eventDate}
				</div>
			</div>
		`
	} else {
		eventHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${eventTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${eventDesc}</p>
					<p class="card-text">${eventLoc}</p>
				</div>
				<div class="card-footer">
					${eventDate}
				</div>
			</div>
		`
	}
	
	$("#park-e-modal").append(eventHTML);
}

function addAlert(alertCat, alertDesc, alertTitle, alertURL) {
	var alertHTML;
	
	if (alertURL.length > 0) {
		alertHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${alertTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${alertDesc}</p>
					<a href=${alertURL} target="_blank" class="card-link">More information about the alert</a>
				</div>
			</div>
		`
	} else {
		alertHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${alertTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${alertDesc}</p>
				</div>
			</div>
		`
	}
	
	$("#park-a-modal").append(alertHTML);
}

function addNews(newsAbs, newsDate, newsTitle, newsURL) {
	var newsHTML;
	
	if (newsURL.length > 0) {
		newsHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${newsTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${newsAbs}</p>
					<a href=${newsURL} target="_blank" class="card-link">More information</a>
				</div>
				<div class="card-footer">
					${newsDate}
				</div>
			</div>
		`
	} else {
		newsHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${newsTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${newsAbs}</p>
				</div>
				<div class="card-footer">
					${newsDate}
				</div>
			</div>
		`
	}
	
	$("#park-n-modal").append(newsHTML);
}

function addLessons(lessonTitle, lessonURL, lessonGrade, lessonObj, lessonSub) {
	var lessonsHTML;
	
	if (lessonURL.length > 0) {
		lessonsHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${lessonTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${lessonObj}</p>
					<p class="badge badge-primary">${lessonSub}</p>
					<br />
					<a href=${lessonURL} target="_blank" class="card-link">More information about the lesson</a>
				</div>
				<div class="card-footer">
					${lessonGrade}
				</div>
			</div>
		`
	} else {
		lessonsHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${lessonTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${lessonObj}</p>
					<p class="badge badge-primary">${lessonSub}</p>	
				</div>
				<div class="card-footer">
					${lessonGrade}
				</div>
			</div>
		`
	}
	
	$("#park-l-modal").append(lessonsHTML);
}

function addArticles(articleTitle, articleURL, articleDesc) {
	var articlesHTML;
	
	if (articleURL.length > 0) {
		articlesHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${articleTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${articleDesc}</p>
				</div>
				<div class="card-footer">
					<a href=${articleURL} target="_blank" class="card-link">Click Here For Full Article</a>
				</div>
			</div>
		`
	} else {
		articlesHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${articleTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${articleDesc}</p>
				</div>
			</div>
		`
	}
	
	$("#park-ar-modal").append(articlesHTML);
}


function addPeople(peopleTitle, peopleURL, peopleDesc) {
	var peopleHTML;
	
	if (peopleURL.length > 0) {
		peopleHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${peopleTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${peopleDesc}</p>
				</div>
				<div class="card-footer">
					<a href=${peopleURL} target="_blank" class="card-link">Click here for more information</a>
				</div>
			</div>
		`
	} else {
		peopleHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${peopleTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${peopleDesc}</p>
				</div>
			</div>
		`
	}
	
	$("#park-pe-modal").append(peopleHTML);
}

function addPlaces(placesTitle, placesURL, placesDesc) {
	var placesHTML;
	
	if (placesURL.length > 0) {
		placesHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${placesTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${placesDesc}</p>
				</div>
				<div class="card-footer">
					<a href=${placesURL} target="_blank" class="card-link">Click here for more information</a>
				</div>
			</div>
		`
	} else {
		placesHTML = `
			<div class="card mt-3">
				<div class="card-header">
					${placesTitle}
				</div>
				<div class="card-body">
					<p class="card-text">${placesDesc}</p>
				</div>
			</div>
		`
	}
	
	$("#park-pl-modal").append(placesHTML);
}
