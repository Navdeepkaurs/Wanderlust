mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // Set the style
    center: coordinates, // Center matches coordinates
    zoom: 9
});


console.log(coordinates)
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates) // Set marker coordinates
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Offset prevents popup from overlapping the marker
            .setHTML(`<h4><p><i>Exact location provided after booking!</i></p></h4>`) // Popup content
    )
    .addTo(map);