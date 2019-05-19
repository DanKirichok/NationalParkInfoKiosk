$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

/*
 * Dictionary that has park codes as
 * keys to the parks general information 
 */
var apiResult = {};

$("form").submit(function(e) {
	e.preventDefault(e);
});

$("#searchBtn").click(function(){
	$("#searchBtn").css("display", "none");
	$(".loading").css("display", "block");
	
	data = {
		state: $('#stateSelector').find(":selected").val(),
		query: $('#search-name-input').val(),
	}	
	
	$.ajax({
		url: "search/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {
			$("#searchBtn").css("display", "inline-block");
			$(".loading").css("display", "none");
			
			$("#search-results-list").empty();
			$("#stateResults").css("display", "block");
			
			$('html, body').animate({
				scrollTop: $("#stateResults").offset().top
			}, 2000);
			
			console.log(result["data"]["data"]);
			$("#num-results").text(result["data"]["total"]);
			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				parkName = result["data"]["data"][i]["name"];
				parkDesc = result["data"]["data"][i]["description"];
				parkDesig = result["data"]["data"][i]["designation"];
				parkCode = result["data"]["data"][i]["parkCode"];
				parkStates = result["data"]["data"][i]["states"];
				
				apiResult[parkCode] = result["data"]["data"][i];
				
				addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates);
				
			}
			
			parkResultHandler();
			
	    },
	    error: function(data){
		    console.log("ERROR DOING PARK CALL");
			$("#searchBtn").css("display", "inline-block");
			$(".loading").css("display", "none");
		}
	});
});

function parkResultHandler() {
	$(".park-result").click(function(){
		var parkCode = $(this).attr("id");
		
		$("#park-name-modal").text(getParkFullName(parkCode));
		
		$("#park-description-modal").text(getParkDescription(parkCode));
				
		getVisitorCenterResult(parkCode);
		getCampgroundResult(parkCode);
		getEventsResult(parkCode);
		getAlertsResult(parkCode);
		getNewsResult(parkCode);
		getLessonsResult(parkCode);
		getArticlesResult(parkCode);
		getPeopleResult(parkCode);
		getPlacesResult(parkCode);
		insertParkImages(getParkImages(parkCode));
		
		/*
		 * Ensures that overview is always the active tab when opening
		 */ 
		$("#modal-tabs>li>a.active").removeClass("active");
		$("#modal-tab-content>.active.show").removeClass("active show");
		
		$("#overview-tab").addClass("active");
		$("#overview-tab-content").addClass("active show");
		
		$(".park-result-modal").modal("show");
	});
}

function addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates) {
	var parkResultHTML = ` 
		<a id = ${parkCode} class="list-group-item list-group-item-action flex-column align-items-start park-result">
			<div class="d-flex w-100 justify-content-between">
			  <h5 class="mb-1 park-name"><strong>${parkName}</strong></h5>
			  <small class = "park-desig">${parkDesig}</small>
			</div>
			<small class="text-muted">${parkStates}</small>
		</a>
	`
		
	$("#search-results-list").append(parkResultHTML);
}

function getParkDescription(parkCode) {
	return apiResult[parkCode]["description"];
}

function getParkDesignation(parkCode) {
	return apiResult[parkCode]["designation"];
}

function getParkFullName(parkCode) {
	return apiResult[parkCode]["fullName"];
}

function getParkImages(parkCode) {
	return apiResult[parkCode]["images"]
}

function insertParkImages(images) {
	// Clears the carousel for new images
	$("#park-images-container").empty();
	
	for (var i = 0; i < images.length; i++) {
		var imgURL = images[i]["url"];
		
		var imgHTML = `
			<div class="carousel-item">
				<img class="d-block car-img mx-auto" src=${imgURL} alt="Park image">
			</div>
		`
		
		$("#park-images-container").append(imgHTML);
	}
	
	$('.carousel-item:first').addClass('active');
}

function getVisitorCenterResult(parkCode) {	
	$("#vc-label").css("display", "none");
	$("#park-vc-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "visitorcenter/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have visitor centers, so hides title
				 * until there is a visitor center added
				 */
				if ($("#vc-label").css("display") == "none") {
					$("#vc-label").css("display", "block");
					$("#vc-label").addClass("animated fadeIn");
				}
				
				var centerName = result["data"]["data"][i]["name"];
				var centerDesc = result["data"]["data"][i]["description"];
				var centerURL = result["data"]["data"][i]["url"];
				
				addVisitorCenter(centerName, centerDesc, centerURL);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getCampgroundResult(parkCode) {
	$("#cg-label").css("display", "none");
	$("#park-cg-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "campground/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#cg-label").css("display") == "none") {
					$("#cg-label").css("display", "block");
					$("#cg-label").addClass("animated fadeIn");
				}
				
				var campName = result["data"]["data"][i]["name"];
				var campDesc = result["data"]["data"][i]["description"];
				var campURL = result["data"]["data"][i]["directionsUrl"];
				
				addCampground(campName, campDesc, campURL);
				
				// apiVisitorCenter.push(result["data"]["data"][i]);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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


function getEventsResult(parkCode) {
	$("#event-tab").css("display", "none");
	$("#park-e-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "events/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#event-tab").css("display") == "none") {
					$("#event-tab").css("display", "block");
					$("#event-tab").addClass("animated fadeIn");
				}
				
				var eventLoc = result["data"]["data"][i]["location"];
				var eventDate = result["data"]["data"][i]["datestart"];
				var eventDesc = result["data"]["data"][i]["description"];
				var eventURL = result["data"]["data"][i]["infourl"];
				var eventTitle = result["data"]["data"][i]["title"];
				
				addEvent(eventLoc, eventDate, eventDesc, eventURL, eventTitle);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getAlertsResult(parkCode) {
	$("#alert-tab").css("display", "none");
	$("#park-a-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "alerts/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#alert-tab").css("display") == "none") {
					$("#alert-tab").css("display", "block");
					$("#alert-tab").addClass("animated fadeIn");
				}
				
				var alertCat = result["data"]["data"][i]["category"];
				var alertDesc = result["data"]["data"][i]["description"];
				var alertTitle = result["data"]["data"][i]["title"];
				var alertURL = result["data"]["data"][i]["url"];
	
				addAlert(alertCat, alertDesc, alertTitle, alertURL);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getNewsResult(parkCode) {
	$("#news-tab").css("display", "none");
	$("#park-n-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "newsreleases/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#news-tab").css("display") == "none") {
					$("#news-tab").css("display", "block");
					$("#news-tab").addClass("animated fadeIn");

				}
				
				var newsAbs = result["data"]["data"][i]["abstract"];
				var newsDate = result["data"]["data"][i]["releasedate"];
				var newsTitle = result["data"]["data"][i]["title"];
				var newsURL = result["data"]["data"][i]["url"];
	
				addNews(newsAbs, newsDate, newsTitle, newsURL);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getLessonsResult(parkCode) {
	$("#lessons-tab").css("display", "none");
	$("#park-l-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "lessonplans/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#lessons-tab").css("display") == "none") {
					$("#lessons-tab").css("display", "block");
					$("#lessons-tab").addClass("animated fadeIn");
				}
				
				var lessonTitle = result["data"]["data"][i]["title"];
				var lessonURL = result["data"]["data"][i]["url"];
				var lessonGrade = result["data"]["data"][i]["gradelevel"];
				var lessonObj = result["data"]["data"][i]["questionobjective"];
				var lessonSub = result["data"]["data"][i]["subject"];
	
				addLessons(lessonTitle, lessonURL, lessonGrade, lessonObj, lessonSub);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getArticlesResult(parkCode) {
	$("#articles-tab").css("display", "none");
	$("#park-ar-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "articles/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#articles-tab").css("display") == "none") {
					$("#articles-tab").css("display", "block");
					$("#articles-tab").addClass("animated fadeIn");
				}
				
				var articleTitle = result["data"]["data"][i]["title"];
				var articleURL = result["data"]["data"][i]["url"];
				var articleDesc = result["data"]["data"][i]["listingdescription"];
	
				addArticles(articleTitle, articleURL, articleDesc);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getPeopleResult(parkCode) {
	$("#people-tab").css("display", "none");
	$("#park-pe-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "people/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {
			for (var i = 0; i < result["data"]["data"].length; i++) {
				
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#people-tab").css("display") == "none") {
					$("#people-tab").css("display", "block");
					$("#people-tab").addClass("animated fadeIn");
				}
				
				var peopleTitle = result["data"]["data"][i]["title"];
				var peopleURL = result["data"]["data"][i]["url"];
				var peopleDesc = result["data"]["data"][i]["listingdescription"];
	
				addPeople(peopleTitle, peopleURL, peopleDesc);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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

function getPlacesResult(parkCode) {
	$("#places-tab").css("display", "none");
	$("#park-pl-modal").empty();
	
	data = {
		parkCode: parkCode,
	}	
	
	$.ajax({
		url: "places/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {
			for (var i = 0; i < result["data"]["data"].length; i++) {
				/* 
				 * Not all parks have campgrounds, so hides title
				 * until there is a visitor center added
				 */
				if ($("#places-tab").css("display") == "none") {
					$("#places-tab").css("display", "block");
					$("#places-tab").addClass("animated fadeIn");
				}
				
				var placesTitle = result["data"]["data"][i]["title"];
				var placesURL = result["data"]["data"][i]["url"];
				var placesDesc = result["data"]["data"][i]["listingdescription"];
	
				addPlaces(placesTitle, placesURL, placesDesc);
			}
	    },
	    error: function(data){
		  console.log("ERROR");
		}
	});
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
