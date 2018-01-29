//Global Variables

Google_key = "AIzaSyCtciJzVjiayoYmvxjhunlA_NP6byTwx5M";
var currentPlace;
var places;
var mymap;


$(document).on("click", "#refresh", function() {
    //Prevent default behaviour
    event.preventDefault();

    //1. Get Current Location
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key="+Google_key,
        function (response) {
            //alert("Lat: "+response.location.lat+" Lon: "+response.location.lng);
            lat = response.location.lat;
            lng = response.location.lng;
             call_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+"&rankby=distance&types=food&key="+Google_key;
           $.getJSON(call_url,
                function (data) {
                    //Process Response from google API Call
                    places = data.results;
                    //Remove previous stations
                    $('#places_list li').remove();
                    //Add new Places to the list
                    for(var index=0;index<places.length;index++){
                        //console.log(stations[index].opening_hours);
                        if(places[index].opening_hours) {
                            if (places[index].opening_hours.open_now) {
                                //console.log(stations[index]);
                                 $('#places_list').append(
                            '<li><a id="to_details" href="#">'+places[index].name+
                             '<span id="'+index+'" class="ui-li-count">'+places[index].rating+'</span>'+
                            '</a></li>');

                            }

                        } 
                    }
                    //Refresh list content
                    $('#places_list').listview('refresh');

            });
    })

});

$(document).on('pagebeforeshow','#home', function () {
   $(document).on('click','#to_details',function (e) {
       e.preventDefault();
       e.stopImmediatePropagation();
       //Store the Places ID
       currentPlace = places[e.target.children[0].id];
       //Change to Details Page
       $.mobile.changePage("#details");
   })
});

//Update Details Page
$(document).on('pagebeforeshow','#details', function (e) {
    e.preventDefault();
    console.log(currentPlace);
    $('#placeIcon').attr('src',currentPlace.icon);
    $('#placeName').text(currentPlace.name);
    $('#name').text('Name: '+currentPlace.name);
    $('#rate').text('rating: '+currentPlace.rating);
    $('#vicinity').text('vicinity: '+currentPlace.vicinity);
    $('#open').text('Open_now: '+currentPlace.opening_hours.open_now);
    $('#type').text('type: '+currentPlace.types[0]);
    $('#location').text('Show in map');
});

$(document).on('click','#toMap',function (e) {
   // document.getElementById("map-canvas").innerHTML='<iframe width="100%"  height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key='+Google_key+'&q='+currentPlace.geometry.location.lat+','+currentPlace.geometry.location.lng+'" allowfullscreen></iframe>';
    if(mymap){
      mymap.off();
      mymap.remove();
    }
  mymap = L.map('map-canvas').setView([currentPlace.geometry.location.lat, currentPlace.geometry.location.lng], 15);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);
  var marker = L.marker([currentPlace.geometry.location.lat, currentPlace.geometry.location.lng]).addTo(mymap);
  marker.bindPopup(currentPlace.name);
  setTimeout(function()
    { mymap.invalidateSize()}, 400);

})