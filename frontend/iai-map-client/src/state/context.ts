import { createContext } from 'react';
import { ToolStatus, GeoObject } from './types'

type AppState = {
  //Handle map state
  toolStatus: ToolStatus;
  setToolStatus: (tool: ToolStatus) => void;
  //Handle new geo object
  unsavedObjects: GeoObject[];
  addUnsavedObject: (obj: GeoObject) => void;
  //Contains the saved objects for the table
  savedObjects: GeoObject[];
  setSavedObjects: (objs: GeoObject[]) => void;
  //Delegate for cleaning the unsaved obj pool
  clearUnsavedObjects: () => void;
};

export const AppStateContext = createContext<AppState | null>(null);
