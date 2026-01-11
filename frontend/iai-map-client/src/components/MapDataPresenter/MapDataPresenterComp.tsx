import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { GeoObject } from '../../state/types';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import styles from './MapDataPresenterComp.module.scss';

export interface MapDataPresenterCompProps {
    tableTitle: string;
}

export const MapDataPresenterComp: React.FC<MapDataPresenterCompProps> = ({
    tableTitle,
}) => {
  const { savedObjects } = useAppState();
  const [title, setTitle] = useState(tableTitle);
  const [tableData, setTableData] = useState([]);

  //** Helper to get lat/lng from geometry **
  //DB holds different nested coordinate structure for point and polygon
  const getLatLng = (geo: GeoObject) => {
    var formatedCoords = undefined;
    const coordinates = geo.geometry.coordinates;
    
    switch(geo.geometry.type)
    {
        case 'Polygon':
            formatedCoords = coordinates?.[0]?.[0] || [0, 0];
            break;
        case 'Point':
            formatedCoords = [geo.geometry.coordinates[0],geo.geometry.coordinates[1]];
            break;
        default:
            formatedCoords = [0.0, 0.0];
            break;
    }
    return { lat: formatedCoords[1], lng: formatedCoords[0] };
  };

  //Update table on data change
  useEffect(() => {
    setTableData(savedObjects);
  }, [savedObjects]);

  return (
    <div className={styles['table-box']}>
        <Typography className={styles['table-title']}>
            {title}
        </Typography>
        <div className={styles['grid-Container']}>
            <TableContainer className={styles['table-Container']}
                component={Paper} >
                <Table stickyHeader size="small" >
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Lat</TableCell>
                        <TableCell>Long</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {tableData.map((obj: GeoObject) => {
                        const { lat, lng } = getLatLng(obj);
                        return (
                        <TableRow key={obj.id} 
                            //MUI is not always tolerant with scss styling - seting font size here
                            sx={{
                            '& .MuiTableCell-root': {
                            fontSize: '0.8rem',
                            },
                        }}>
                            <TableCell>{obj.name}</TableCell>
                            <TableCell>{obj.geometry.type}</TableCell>
                            <TableCell>{lat.toFixed(2)}</TableCell>
                            <TableCell>{lng.toFixed(2)}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>
  );
};

export default MapDataPresenterComp;