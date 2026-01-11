import { useState, useCallback, useMemo} from 'react';
import { ToolStatus, GeoObject } from './types'
import { AppStateContext } from'./context';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //Handles the tool state
  const [toolStatus, setToolStatus] = useState<ToolStatus>('idle');
  //Handle a collection of unsaved objects to send to BE
  const [unsavedObjects, setUnsavedObjects] = useState<GeoObject[]>([]);
  //Hndles the saved object retrieved fro BE for the data table
  const [savedObjects, setSavedObjects] = useState<GeoObject[]>([]);

  const addUnsavedObject = useCallback((obj: GeoObject) => {
    setUnsavedObjects(prev => [...prev, obj]);
  }, []);

  const clearUnsavedObjects = useCallback(() => {
    setUnsavedObjects([]);
  }, []);

  const updateSavedObjects = useCallback((objs: GeoObject[]) => {
    setSavedObjects(objs);
  }, []);

  //*** performance optimization hook:
  // Without it - every render creates a new object
  // Only recalculated when its dependencies change
  const value = useMemo(() => ({
    toolStatus,
    setToolStatus,
    unsavedObjects,
    addUnsavedObject,
    clearUnsavedObjects,
    savedObjects,
    setSavedObjects: updateSavedObjects,
  }),[
    toolStatus,
    unsavedObjects,
    addUnsavedObject,
    clearUnsavedObjects,
    savedObjects,
  ]); 

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
