/**
 * This file handles doing the ajax requests to the National Park API
 * and calls the functions inside of html-handler to insert the information
 * from the API into the page in an easy to read format
 */

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
var resultsCounter = 0;
var resultsPerPage = 10;

/*
 * Prevents page refreshing when the form is submitted
 */
$("form").submit(function(e) {
	e.preventDefault(e);
});

/*
 * Used for when the initial search is run by the user on the landing page
 */
$("#searchBtn").click(function(){
	$("#searchBtn").css("display", "none");
	$(".loading").css("display", "block");
	resultsCounter = 0;
	
	data = {
		state: $('#stateSelector').find(":selected").val(),
		query: $('#search-name-input').val(),
		start: 1,
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
			
			var numResults = result["data"]["total"];
			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				parkName = result["data"]["data"][i]["name"];
				parkDesc = result["data"]["data"][i]["description"];
				parkDesig = result["data"]["data"][i]["designation"];
				parkCode = result["data"]["data"][i]["parkCode"];
				parkStates = result["data"]["data"][i]["states"];
				
				apiResult[parkCode] = result["data"]["data"][i];
				
				/*
				 * Since the API doesn't include built in designation
				 * filtering from what it looks like, have to make custom
				 */
				var desigQuery = $('#desigSelector').find(":selected").val();
								
				if (desigQuery != "" && parkDesig.toLowerCase().trim().indexOf(desigQuery) > -1) {
					addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates, true);
				} else {
					addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates, false);
				}
			}
			
			parkResultHandler(numResults, true);
			
			$("#num-results").text(numResults);
			
	    },
	    error: function(data){
		    console.log("ERROR DOING PARK CALL");
			$("#searchBtn").css("display", "inline-block");
			$(".loading").css("display", "none");
		}
	});
});

/*
 * Used for switching pages through pagination
 */
function getParks(pageNum) {
	$(".load-bar").css("display", "block");
	
	data = {
		state: $('#stateSelector').find(":selected").val(),
		query: $('#search-name-input').val(),
		start: ((pageNum - 1) * resultsPerPage) + 1,
	}	
	
	$.ajax({
		url: "search/",
		type: "POST",
	    data: data,
	    dataType: "json",
	    success: function(result) {
			$(".load-bar").css("display", "none");
			
			$("#search-results-list").empty();
			$("#stateResults").css("display", "block");
			
			$('html, body').animate({
				scrollTop: $("#stateResults").offset().top
			}, 2000);
			
			var numResults = result["data"]["total"];
			
			for (var i = 0; i < result["data"]["data"].length; i++) {
				parkName = result["data"]["data"][i]["name"];
				parkDesc = result["data"]["data"][i]["description"];
				parkDesig = result["data"]["data"][i]["designation"];
				parkCode = result["data"]["data"][i]["parkCode"];
				parkStates = result["data"]["data"][i]["states"];
				
				apiResult[parkCode] = result["data"]["data"][i];
				
				/*
				 * Since the API doesn't include built in designation
				 * filtering from what it looks like, have to make custom
				 */
				var desigQuery = $('#desigSelector').find(":selected").val();
				
				if (desigQuery != "" && parkDesig.toLowerCase().trim().indexOf(desigQuery) > -1) {
					addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates, true);
				} else {
					addParkResult(parkName, parkDesc, parkDesig, parkCode, parkStates, false);
				}
			}
			parkResultHandler(numResults, false);
			
			$("#num-results").text(numResults);
	    },
	    error: function(data){
		    console.log("ERROR DOING PARK CALL");
			$("#searchBtn").css("display", "inline-block");
			$(".loading").css("display", "none");
		}
	});
}

function parkResultHandler(numResults, updatePag) {
	if (updatePag) {
		handlePagination(numResults);	
	}
	
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

function handlePagination(numResults) {
	// Resets pagination numbering for when there are new results
	$("#results-pagination").empty();
	var pagBaseHTML = `
		<li class="page-item" id = "prev-btn"><a class="page-link">Previous</a></li>
		<li class="page-item active"><a class="page-link page-num" id = "first-page">1</a></li>
	`
	$("#results-pagination").append(pagBaseHTML);
	
	// Gets the number of pages the results will have
	var numPages = Math.floor(numResults/resultsPerPage);
	
	for (var i = 0; i < numPages; i++) {
		var pageNumHTML = `
			<li class="page-item"><a class="page-link page-num">${i + 2}</a></li>
		`
		
		$("#results-pagination").append(pageNumHTML);
	}
	
	// Ensures that the next button is the last button
	var nextBtnHTML = `
		<li class="page-item" id = "next-btn"><a class="page-link">Next</a></li>
	`
	$("#results-pagination").append(nextBtnHTML);
	
	// Handles changing pages of pagination
	$(".page-item").click(function(){
		if ($(this).attr("id") === "prev-btn") {
			var newPage = $("#results-pagination>li.active").prev();
			
			if (newPage.attr("id") != "prev-btn") {
				$("#results-pagination>li.active").removeClass("active");
			
				newPage.addClass("active");
				getParks(parseInt(newPage.text()));
			}
			
			
		} else if ($(this).attr("id") === "next-btn") {			
			var newPage = $("#results-pagination>li.active").next();
			
			if (newPage.attr("id") != "next-btn") {
				$("#results-pagination>li.active").removeClass("active");
			
				newPage.addClass("active");
				getParks(parseInt(newPage.text()));
			}
		} else {			
			$("#results-pagination>li.active").removeClass("active");
		
			$(this).addClass("active");
			getParks(parseInt($(this).text()));
		}
	});
	
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
		  console.log("ERROR DOING VISITOR CENTER CALL");
		}
	});
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
		  console.log("ERROR DOING CAMPGROUNDS CALL");
		}
	});
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
		  console.log("ERROR DOING EVENTS CALL");
		}
	});
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
		  console.log("ERROR DOING ALERTS CALL");
		}
	});
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
		  console.log("ERROR DOING NEWS RESULTS CALL");
		}
	});
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
		  console.log("ERROR DOING LESSONS CALL");
		}
	});
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
		  console.log("ERROR DOING ARTICLES CALL");
		}
	});
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
		  console.log("ERROR DOING PEOPLE CALL");
		}
	});
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
		  console.log("ERROR DOING PLACES CALL");
		}
	});
}
