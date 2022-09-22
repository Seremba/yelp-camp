mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 10,
    projection: 'globe'
});

const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);
