import { FC, useState, useContext } from 'react';
import styles from './GeoObjectCreatorComp.module.scss';
import { Button, Typography, ThemeProvider, createTheme } from '@mui/material';
import { CreatorOwner } from '../Common/enums'
import { AppStateContext } from '../../state/context';

//Centered theme for all buttons
const localTheme = createTheme({
  palette: {
    primary: {
      main: '#577aa1ff',
      contrastText: '#ffffffff',
    },
  },
});

export interface GeoObjectCreatorCompProps {
    owner: CreatorOwner;
    creatorTitle: string;
    hasSaveButton: boolean;
}
export const GeoObjectCreatorComp: FC<GeoObjectCreatorCompProps> = ({
    owner,
    creatorTitle,
    hasSaveButton,
    
  }) => {
    const [title, setTitle] = useState(creatorTitle);
    //Get state context
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error('AppStateProvider missing');
    //Handles "Add" State - save to state
    const setAddToolState = () => {
        switch(owner)
        {
            case CreatorOwner.Polygon:
                ctx.setToolStatus('drawPolygon')
                break;
            case CreatorOwner.Point:
                ctx.setToolStatus('drawPoints')
                break;
            default:
                ctx.setToolStatus('idle')
                break;
        }
    }
    //Handles "Delete" State - save to state
    const setDeleteToolState = () => {
        switch(owner)
        {
            case CreatorOwner.Polygon:
                ctx.setToolStatus('deletePolygon')
                break;
            case CreatorOwner.Point:
                ctx.setToolStatus('deletePoints')
                break;
            default:
                ctx.setToolStatus('idle')
                break;
        }
    }
    //Handles "Save" State - save to state
    const setSaveToolState = () => {
        switch(owner)
        {
            case CreatorOwner.Polygon:
                ctx.setToolStatus('savePolygon')
                break;
            case CreatorOwner.Point:
                ctx.setToolStatus('savePoints')
                break;
            default:
                ctx.setToolStatus('idle')
                break;
        }
    }
    
    return (
        <div className={styles['creator-box']}>
            <Typography className={styles['creator-title']}>
                {title}
            </Typography>
            <div className={styles['gridContainer']}>
                <div className={styles['buttonGrid']}>
                    <ThemeProvider theme={localTheme}>
                        <Button variant="contained" color="primary"
                            onClick={setAddToolState}>
                            Add
                        </Button>
                        <Button variant="contained" color="primary"
                            onClick={setDeleteToolState}>
                            Delete
                        </Button>
                        {hasSaveButton && (
                            <Button variant="contained" color="primary"
                                onClick={setSaveToolState}>
                                Save
                            </Button>
                        )}
                    </ThemeProvider>
                </div>
            </div>
        </div>
        );
};