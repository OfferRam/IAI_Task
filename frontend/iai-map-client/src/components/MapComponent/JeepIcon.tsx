//Jeep Icon
import L from 'leaflet';
//Icon
import jeepMainIcon from '../../icons/jeep.png';
//Icon Shadow
import jeepShadowIcon from '../../icons/jeepShadow.png';
var jeepIcon = L.icon({
    iconUrl: jeepMainIcon,
    shadowUrl: jeepShadowIcon,
    iconSize:     [40, 50], // size of the icon
    shadowSize:   [50, 50], // size of the shadow
    iconAnchor:   [0, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [-10, 40],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

export default jeepIcon;