import { MapViewComp } from './components/MapView/MapViewComp'
import { GeoObjectCreatorComp } from './components/GeoObjectCreator/GeoObjectCreatorComp'
import { MapDataPresenterComp } from './components/MapDataPresenter/MapDataPresenterComp'
import styles from './App.module.scss';
import { CreatorOwner } from '../src/components/Common/enums'


const App = () => {
  return (
    <div className={styles['App']}>
      <div className={styles['left-panel']}>
        <div id="map">
          <MapViewComp mapStateHeader='Map is ready'/>
        </div>
      </div>

      <div className={styles['right-panel']}>
        <div className={styles['right-section-top']}>
          <GeoObjectCreatorComp hasSaveButton={false} creatorTitle='Create Polygon' owner={CreatorOwner.Polygon}/>
        </div>
        <div className={styles['right-section-middle']}>
          <GeoObjectCreatorComp hasSaveButton={true} creatorTitle='Create Points' owner={CreatorOwner.Point}/>
        </div>
        <div className={styles['right-section-bottom']}>
          <MapDataPresenterComp tableTitle='Geo Data'/>
        </div>
      </div>
    </div>
  );
}
export default App;
