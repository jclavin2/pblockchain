<p>3D version of the <a href="carroll">Carroll County map</a> we shared previously, built from Maryland Department of Environment <a href="https://securemde.mde.state.md.us/_layouts/OLRR/PublicOLRRSearch.aspx" target="_blank">public data</a>.</p>
<script src="https://cdn-webgl.wrld3d.com/wrldjs/dist/latest/wrld.js"></script>
<link crossorigin="" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" rel="stylesheet" />
<!-- Load jQuery and PapaParse to read data from a CSV file -->
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script><!-- Position the map with Cascading Style Sheet (CSS) -->
<link crossorigin="" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" integrity="sha512-BBToHPBStgMiw0lD4AtkRIZmdndhB6aQbXpX7omcrXeG2PauGBl2lzq2xUZTxaLxYz5IDHlmneCZ1IJ+P3kYtQ==" rel="stylesheet" type="text/css" />
<link crossorigin="" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" integrity="sha512-RLEjtaFGdC4iQMJDbMzim/dOvAu+8Qp9sw7QE4wIMYcg2goVoivzwgSZq9CsIxp4xKAZPKh5J2f2lOko2Ze6FQ==" rel="stylesheet" type="text/css" />
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js" integrity="sha512-MQlyPV+ol2lp4KodaU/Xmrn+txc1TP15pOBF/2Sfre7MRsA/pB4Vy58bEqe9u7a7DczMLtU5wT8n7OblJepKbg==" crossorigin=""></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css" rel="stylesheet" />
<style type="text/css">#map {
			width: 800px;
			height: 600px;
		}
</style>
<style type="text/css">.info { padding: 6px 8px; font: 14px/16px Arial, Helvetica, sans-serif; background: white; background: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(0,0,0,0.2); border-radius: 5px; } .info h4 { margin: 0 0 5px; color: #777; }
.legend { text-align: left; line-height: 75px; color: #555;} .legend i { width: 20px; height: 18px; float: left; margin-right: 8px; opacity: 0.8;  }
</style>
<!-- Insert HTML division tag to layout the map -->
<div id="map">&nbsp;</div>
<!-- Insert Javascript (.js) code to create the map -->

<script>

  
  var map = L.Wrld.map("map", "07b6a577a6e8ae7c939fd4c2cdabf572", {
    //center: [39.650605, -78.756452], // EDIT latitude, longitude to re-center map
    center: [ 38.4993294,-76.5032757],  //center of the county
    //center: [ 38.9763071, -76.5043669],  //high density area of the county.
    zoomControl : true,
    zoom: 8  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    //scrollWheelZoom: false,
    //tap: false
  });



  /* Control panel to display map layers */
  var controlLayers = L.control.layers( null, null, {
    position: "topright",
    collapsed: false
  }).addTo(map);

    console.log("0")

    var markers = L.markerClusterGroup();
    var inactives = L.markerClusterGroup();
    var removeds = L.markerClusterGroup();
            
    var removedHTML = "<img src=\"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png\"/>Removed";
    var inactiveHTML = "<img src=\"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png\"/>In-active";
    var activeHTML = "<img src=\"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png\"/>Active";



    var csv_file = "https://www.pblockchain.org/sites/default/files/2021-02/Carroll_County_Md_Geocoded_Lead_Rental_Registry.csv";
    // Stream big file in worker thread
    Papa.parse(csv_file, {
      header: true,
      download:  true,
      step: function(results) {


	if (results.data.Status == "Active")
	{
	  marker_color = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";  	  
	  console.log("DEBUG 1");
      //marker = L.geoJSON(feature).addTo(map)
      var myIcon = new L.Icon({
        iconUrl: marker_color,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      try{
            var marker = L.marker(L.latLng(results.data.Latitude, results.data.Longitude), {icon: myIcon});
            var owner = "Address:  " + results.data.Address + "<BR> Registration Date:  " + results.data['Registration Date'];
            marker.bindPopup(owner);
            marker.addTo(markers);
            markers.addLayer(marker);	
            console.log("DEBUG 2");
            map.addLayer(markers);

      }
      catch(err) {
        console.log(err.message);
      }
     
    }

	else if (results.data.Status == "In-active")
	{	  
      marker_color = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png";	  
      var myIcon = new L.Icon({
        iconUrl: marker_color,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      try{
        var marker = L.marker(L.latLng(results.data.Latitude, results.data.Longitude), {icon: myIcon});
        var owner = "Address:  " + results.data.Address + "<BR> Registration Date:  " + results.data['Registration Date'];
        marker.bindPopup(owner);
        marker.addTo(inactives);
        inactives.addLayer(marker);		  
        console.log("DEBUG 2");
        map.addLayer(inactives);
      }
      catch(err) {
        console.log(err.message);
      }
      
    }

	else  //Removed or something else
	{	  
      marker_color = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";	  
      var myIcon = new L.Icon({
        iconUrl: marker_color,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      try{
        var marker = L.marker(L.latLng(results.data.Latitude, results.data.Longitude), {icon: myIcon});
        var owner = "Address:  " + results.data.Address + "<BR> Registration Date:  " + results.data['Registration Date'];
        marker.bindPopup(owner);
        marker.addTo(removeds);
        removeds.addLayer(marker);
        console.log("DEBUG 2");
        map.addLayer(removeds);
        }
        catch(err) {
            console.log(err.message);
        }

	  
		  
    } 
    

    

 	  // Create geojson of all markers push feature to the declared houses geoJSON
	  	  

      }, complete: function(results){


        controlLayers.addOverlay(markers, activeHTML).addTo(map);        
        controlLayers.addOverlay(inactives, inactiveHTML).addTo(map);
        controlLayers.addOverlay(removeds, removedHTML).addTo(map);
        
	     //map.addLayer(markers);
         console.log("All done");
         
         setTimeout(function() {
            map.setView([39.6605417,-77.175309], 17, {
            headingDegrees: 270,
            animate: true,
            durationSeconds:5
          });          
        }, 5000);         

        setTimeout(function() {
            map.zoomIn();
        }, 10000);     
       
         //document.getElementById('map').style.height = '600px';
         //>map.invalidateSize();
      }
    });

  
    // Use PapaParse to convert string to array of objects
    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required

      console.log("Done")

    


  </script>

  <BR>
  <BR>
  <BR>