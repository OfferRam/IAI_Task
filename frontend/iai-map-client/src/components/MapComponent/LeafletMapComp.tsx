import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LeafletMapComp.module.scss';
import 'leaflet-draw/dist/leaflet.draw.css';
import DrawController from './DrawController';

const center: LatLngExpression = [51.505, -0.09];

const LeafletMapComp: React.FC = () => {

  return (
    <MapContainer
      center={center}
      zoom={13}
      className={styles['map']}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DrawController />
    </MapContainer>
  );
};

export default LeafletMapComp;