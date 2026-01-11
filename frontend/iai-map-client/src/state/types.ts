export type ToolStatus = 'idle' | 
                         'drawPoints' | 
                         'savePoints' | 
                         'drawPolygon' | 
                         'savePolygon' |
                         'deletePolygon' |
                         'deletePoints';

export type GeoGeometry = {
  type: string;
  coordinates: number[][][]
}

export type GeoObject = {
  id: string;
  name: string;
  geometry: GeoGeometry;
};
