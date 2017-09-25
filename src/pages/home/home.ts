import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

declare var google;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
data:any;
destination1: any = 'ม.พะเยา';
MyLocation: any;
MyLocation1: any;
//marker=[];
request:any;
   map: any;
  image: any;
 marker: any;
  //lat:any;
  lon:any;
  infowindow:any;

  arrData = []
  arrLat = []
  arrLon = []
  lat = []
  i:any;
  id:any;
 


constructor(public navCtrl: NavController, public fdb: AngularFireDatabase, public navParams: NavParams) {
  this.current()
      this.fdb.list('shopping-list').subscribe(_data => {
        this.arrData = _data;
        console.log(this.arrData); 
        this.data = this.applyHaversine( this.arrData);
        console.log(this.data); 
      });


}
click(){
  this.calculateAndDisplayRoute();
  this.image='/assets/images/3.png';
  
    let that = this;
    console.log(that.MyLocation1);
    setInterval(function(){
      console.log(that.marker);
      var i;
      if(that.marker){
      that.marker .setMap(null)}
      var image = new google.maps.MarkerImage(
        that.image,
        new google.maps.Size(71, 71),
        new google.maps.Point(0, 0),
        new google.maps.Point(17, 34),
        new google.maps.Size(25, 25));
   that.marker = new google.maps.Marker({
        position : new google.maps.LatLng(that.MyLocation1),
        map: that.map,
        title: 'locationssdasdasdasdasdasdasdasdasasdasasd',
        icon: image
        });
    },2000)
}
clickpop(){

  this.search(this.data);
}

current(){
  let  that = this;
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);
      that.MyLocation1 = pos;
      console.log(that.MyLocation1);
  });
}  
}

navi(){
  var infoWindow;
  infoWindow = new google.maps.InfoWindow;
   infoWindow.setPosition(this.MyLocation1);
   infoWindow.setContent('อยู้นี้');
   infoWindow.open(this.map);
}
calculateAndDisplayRoute() {
    let  that = this;
    let directionsService = new google.maps.DirectionsService();
       let directionsDisplay = new google.maps.DirectionsRenderer();
       that.map = new google.maps.Map(document.getElementById('map'), {
         zoom: 20,
         center: {lat: 19.028470  , lng: 99.896315}
       });
       directionsDisplay.setMap(that.map);
       that.map.setCenter(that.MyLocation1);
       that.MyLocation = new google.maps.LatLng(that.MyLocation1);
   
     that.request={
      origin: that.MyLocation,
      destination: this.destination1,
      travelMode: 'DRIVING'
       };
    directionsService.route(that.request, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(that.map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    
   }

applyHaversine(locations){
             let usersLocation = this.MyLocation1;//{lat: 19.028546, lng: 99.896524 };//
             locations.map((location) => {
                 let placeLocation = {
                     lat: location.itemName,
                     lng: location.itemNumber
                 };
      
                 location.distance = this.getDistanceBetweenPoints(
                     usersLocation,
                     placeLocation,
                     'miles'
                 ).toFixed(2);
             });
      
             return locations;
         }
      
         getDistanceBetweenPoints(start, end, units){
      
             let earthRadius = {
                 miles: 3958.8,
                 km: 6371
             };
      
             let R = earthRadius[units || 'miles'];
             let lat1 = start.lat;
             let lon1 = start.lng;
             let lat2 = end.lat;
             let lon2 = end.lng;
      
             let dLat = this.toRad((lat2 - lat1));
             let dLon = this.toRad((lon2 - lon1));
             let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
             Math.sin(dLon / 2) *
             Math.sin(dLon / 2);
             let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
             let d = R * c;
      
             return d;
         }
         toRad(x){
             return x * Math.PI / 180;
}
      
     
GoogleMap(i){
  console.log(i); 
  console.log(this.arrData);
 let lat = this.arrData;
 console.log(lat);
 var marker,info;
 var lat1 = lat[i-1];
console.log(lat1);

 info = new google.maps.InfoWindow();
 var position = new google.maps.LatLng(lat1.itemName,lat1.itemNumber);
 var image = new Image();
 image.src = lat1.photo;
 document.body.appendChild(image);

 info.setPosition(position);
 info.setContent(image);
 info.open(this.map);
 
// info.setOptions({content: image,position: position});
 //info.setContent(image);
 //info.open(this.map); 
}

search(dataa){
    var i,low=0.5;
    for(i=0;i<dataa.length;i++){
        let data = dataa[i];
        if(data.distance<=low){
                low = data.distance;
                this.id = data.id;
        }
    }
    if(this.id){
      this.GoogleMap(this.id)
    }


}

}


