//add in Google API information

var geocodeApi = "AIzaSyBUOuAwLVAbvO0rtxxLDyeJlLN4uyESD-I"


//add the map to the document via leaflet, using a tile set from mapbox
//this adds the map to the map div, and sets where the view is
var map = L.map('map').setView([41.850033, -87.6500523], 4);

//adds the mapbox tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZm5jcmVhdGl2ZWNvbnNvbGUiLCJhIjoiY2l4ZG8zMnV6MDBtYjJvbDhubm95czhociJ9.X1spJQNzD9LWMktot87ZiQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZm5jcmVhdGl2ZWNvbnNvbGUiLCJhIjoiY2l4ZG8zMnV6MDBtYjJvbDhubm95czhociJ9.X1spJQNzD9LWMktot87ZiQ'
}).addTo(map);

// mapboxgl.accessToken = 'pk.eyJ1IjoiZm5jcmVhdGl2ZWNvbnNvbGUiLCJhIjoiY2l4ZG8zMnV6MDBtYjJvbDhubm95czhociJ9.X1spJQNzD9LWMktot87ZiQ';
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/light-v9'
// });

//init firebase

  var config = {
    apiKey: "AIzaSyAIpCnywNn-qazsWBIHtcI0HziZVkyZ4oA",
    authDomain: "the-survivor-project.firebaseapp.com",
    databaseURL: "https://the-survivor-project.firebaseio.com",
    projectId: "the-survivor-project",
    storageBucket: "the-survivor-project.appspot.com",
    messagingSenderId: "234541834503"
  };
  firebase.initializeApp(config);

//var for the database
  var database = firebase.database();

//Once the page has loaded, trigger the modal explaining the trigger warning
$(document).ready(function(){

$('#trigger-warning').modal();

});


//connect data from the form into firebase, clear form after it was filled out

//function to add the story submission into the database

$("#submit-button").on("click", function(event) {
	 event.preventDefault();
	//variables to get the info filled out by user
	var zipcode = $("#zipcode").val().trim();
	var story = $("#story").val().trim();
	//ajax call using Google API - the URL incorporates the zipcode and my API
	$.ajax({
        url:  "https://maps.googleapis.com/maps/api/geocode/json?address="+ zipcode +"&key="+ geocodeApi,
        method: "GET"
      }).done(function(response) {
      	//latLong variable reaches in for the exact lat and long that comes back for the specific zipcode
      	var latLong =  response.results[0].geometry.location;
      	console.log(latLong);

      	
      	//this then creates a variable called userEntry which creates key value pairs that will go into the database
		var userEntry = {
		  latlong: latLong,
		  lat: latLong.lat,
		  long: latLong.lng,
		  zipcode: zipcode,
		  story: story
		}; 

		//pushes user entries + the new latlong into the database
		database.ref().push(userEntry);

		//clear all data from form text boxes

		  $("#zipcode").val("");
		  $("#story").val("");
		  $('.story-page').modal('hide')
      });
  
});

//fuction to pull the data from firebase

database.ref("/").on("child_added", function(childSnapshot, prevChildKey) {
	//create variables for each child of the entry, allowing us to reference these vars to add them to the map
	console.log(childSnapshot.val());
	var lat = childSnapshot.val().lat;
	var long = childSnapshot.val().long;
	var zipcode = childSnapshot.val().zipcode;
	var story = childSnapshot.val().story;
	


	//create a custom node that is the marker
	var iconForMap = L.icon({
    iconUrl: 'assets/images/icon-for-map.png',
    iconSize: [12, 12],
});

	//add a node to the map based on the longlat that was created 
	var marker = L.marker([lat, long], {icon: iconForMap}).addTo(map);

	//on hover of the node, a popup shows indicating "Click to Read Story"
		//marker.on()
	//make the node clickable

	//trigger the modal when the marker is clicked (do we need to add a modal to it first??)
	marker.on("click", function(event){
		$('#stories-modal').modal();
	//pull content from firebase to populate the content of the modal
		$("#story-title").html(zipcode);
		$("#story-content").html(story);

	});






//additional thinking stuff - read above (and dont forget to spiderify below!!)
//on the node: create a clickable functionality and a pop-up fuctionality 
//(make sure pop-ups close when another is opened - alternatively, have a pop-up ligthbox page open for the content, and make sure that lightbox page is scrollable - good for mobile)

//pull from firebase to add custom node

//pull information from firebase to populate the pop-up - 


});



//spiderify nodes to prevent overlap














