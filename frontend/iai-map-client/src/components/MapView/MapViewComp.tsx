import { FC, useState, useContext, useEffect } from 'react';
import styles from './MapViewComp.module.scss';
import LeafletMapComp from '../MapComponent/LeafletMapComp'
import { AppStateContext } from '../../state/context';

//mapStateHeader - For better clarity shows the current map state to the user
export interface MapViewCompProps {
    mapStateHeader: string;
}

export const MapViewComp: FC<MapViewCompProps> = ({
    mapStateHeader,
  }) => {
    //Get state context
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error('AppStateProvider missing');
    const [mapHeader, setMapHeader] = useState(mapStateHeader);
    
  // Set map label according to selected tool
  useEffect(() => {
    switch(ctx.toolStatus)
    {
        case 'drawPoints':
            setMapHeader("Drawing Points..");
            break;
        case 'drawPolygon':
            setMapHeader("Drawing Polygon..");
            break;
        case 'deletePoints':
            setMapHeader("deleting Points..");
            break;
        case 'deletePolygon':
            setMapHeader("Deleting Polygon..");
            break;
        case 'savePoints':
            setMapHeader("Saving Points..");
            break;
        case 'savePolygon':
            setMapHeader("Saving Polygon..");
            break;
        case 'idle':
            setMapHeader("Map is Ready");
            break;
    }
  }, [ctx.toolStatus]);

    return (
        <div className={styles['map-box']}>
            <label className={styles['map-state-header']}>
                {mapHeader}
            </label>
            <LeafletMapComp />
        </div>
        );
};