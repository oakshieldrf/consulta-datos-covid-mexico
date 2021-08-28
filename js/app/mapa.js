import {statesData} from './data-mapa.js';

let geojson;
let mymap;
let info;
let markers;

export function iniciarMapa(datosMapa=null) {

    if (!mymap) {

        mymap = L.map('mapid').setView([24.572, -103.366], 4.53);
    
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicGVkcml0b210eiIsImEiOiJja3NwMXR0Nm0wMW54Mndtcmo4dm9qbnY4In0.yqd46_AxB6xwHkNavSLwfQ'
        }).addTo(mymap);

    }
    

    if(geojson !== undefined) {
        geojson.resetStyle({style:style, onEachFeature: onEachFeature});
    }

    geojson = L.geoJson(datosMapa, {style: style, onEachFeature: onEachFeature}).addTo(mymap);

    if(info !== undefined) {
        info.removeFrom(mymap);
    }

    info = L.control();

    info.onAdd = function (map) {

        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {


        this._div.innerHTML = '<h5>Estadísticas</h5>' +  (props ?
            '<b>' + props.name + '<br>' + '<span>Población: </span>'  + props.poblacion +'<br>'+ '<span>Casos: </span>' + props.density
            : 'Selecciona un estado');
        
    };

    info.addTo(mymap);
    
   
}

function getColor(d) {

    return d > 900000 ? '#800026' :
           d > 250000  ? '#BD0026' :
           d > 100000  ? '#E31A1C' :
           d > 70000  ? '#FC4E2A' :
           d > 50000   ? '#FD8D3C' :
           d > 10000   ? '#FEB24C' :
           d > 1000   ? '#FED976' :
                      '#FFEDA0';
}

export function style (feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: .8,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
}

function highlightFeature(e) {
    var layer = e.target; 

    layer.setStyle({
        weight: 5,
        color:'#666',
        dashArray: '3',
        fillOpacity:0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighLight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighLight,
        click: zoomToFeature,
        onload: resetHighLight,
    });
}

// AGREGAR POBLACIONES Y TOTALES DE CASOS POR ESTADO PARA MOSTRAR EN EL MAPA
export function cargarDataMapa(poblaciones, totales){
    
    let datosMapa = statesData.features;


    for(var i=0; i<datosMapa.length; i++) {
        datosMapa[i].properties.poblacion = poblaciones[i];
        datosMapa[i].properties.density = totales[i];
    }
    console.log(datosMapa);

    statesData.features = datosMapa;

    return datosMapa;


}

    // L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10?title=true&access_token=pk.eyJ1IjoicGVkcml0b210eiIsImEiOiJja3NwMXR0Nm0wMW54Mndtcmo4dm9qbnY4In0.yqd46_AxB6xwHkNavSLwfQ/23.93/-102.12').addTo(mymap);

    //Marcadores
//     var marker = L.marker([19.4978, -99.1269]).addTo(mymap);

//     //Circulos
//     var circle = L.circle([19.4978, -99.1275], {
//         color: 'purple',
//         fillColor: '#f03',
//         fillOpacity: 0.4,
//         radio: 600,
//     }).addTo(mymap);

//     //Poligonos
//     var polygon = L.polygon([
//     [19.4978, -99.1269],
//     [19.4950, -99.1280],
//     [19.4920, -99.1230]
// ]).addTo(mymap);

//     //Marcadores
//     marker.bindPopup(
//         `<strong>Hola mundo</strong>
//         <br>
//         <span>Soy el primer popup</span>`
//         ).openPopup();

//     circle.bindPopup("Soy un circulo UwU");
//     polygon.bindPopup("Soy un Poligono OwO");

//     //Eventos
// var popup = L.popup();


//     function mapclick(e){
//         popup
//             .setLatLng(e.latlng)
//             .setContent("Clickeaste el mapa en: " + e.latlng.toString())
//             .openOn(mymap);

//     } 
    
//     mymap.on('click', mapclick);
    