import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useAppState  } from '../../hooks/useAppState';
import { GeoObject, GeoGeometry } from '../../state/types';
import { ObjectId } from 'bson';
import { FeatureCollection, Feature } from 'geojson';
import jeepIcon from './JeepIcon';
import { BASE_API_URL, BATCH_URL } from '../Common/constants';
import { GeoObjectType } from '../Common/enums';


const DrawController: React.FC = () => {
  //Colors
  const polygonGreen = '#2e7d32'

  //Ref to the map
  const map = useMap();
  //Ref to the map ctrl
  const drawControlRef = useRef<L.Draw.Feature  | null>(null);
  //State objects
  const { toolStatus, setToolStatus, addUnsavedObject, unsavedObjects, clearUnsavedObjects} = useAppState();
  //Fetched Json data to load 
  const [geoJsonData, setGeoJsonData] = useState(null);
  //Update the returned items from BE
  const { savedObjects, setSavedObjects } = useAppState();

  //Close the created open polygon --> close polygon (MongoDb constrain)
  //Called on each polygon creation
  const ClosePolygonBeforePost = (geo: GeoGeometry) =>{
    const firstPoint = geo.coordinates[0][0];
    geo.coordinates[0].push(firstPoint);
    return geo;
  }

  //Reset map after a geo object successfull creation
  const CleanAndReloadMap = () => {
    //First clean the map
    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });
    //Clean the unsaved objects
    clearUnsavedObjects();
    //Fetch all object from backend
    const loadObjects = async () => {
      try
      {
        const response = await fetch(BASE_API_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
        {
          alert("Bad Request. HTTP response: " + response.status);
        }else{
          const data = await response.json();
          setGeoJsonData(data);
          setSavedObjects(data);
        }
      } catch (err) {
        throw new Error('Exception loading map data', err);
      }
    }
    loadObjects();
  }

  //Function wrap geo object collection as a whole FeatureCollection object
  function toFeatureCollection(data: any[]): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: data.map((item): Feature => ({
        type: 'Feature',
        id: item.id,
        properties: {
          name: item.name,
        },
        geometry: item.geometry,
      })),
    };
  }

  //Function saves the accumulated unsaved GeoObjects and POST to BE
  function SaveAccumulatedPoints(objects: GeoObject[]){
    const loadPoints = async () => {
      try
      {
        const response = await fetch(BASE_API_URL + BATCH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(objects),
        });
        if (!response.ok)
        {
          alert("Bad Request. HTTP response: " + response.status);
        }else{
          CleanAndReloadMap();
        }
      } catch (err) {
        throw new Error('Exception saving points', err);
      }
      // Switch back to idle
      setToolStatus('idle');
    }
    loadPoints();
  }

  //Function Delete selected object if "delete" tool is on and geo object was cliked on the map
  function deleteSelectedGeoObject(objId: string)
  {
    const deleteGeoObject = async () => {
      try
      {
        var str = BASE_API_URL + "/" + objId;
        const response = await fetch(str, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
        {
          alert("Bad Request. HTTP response: " + response.status);
        }else{
          CleanAndReloadMap();
        }
      } catch (err) {
        throw new Error('Exception deleting object', err);
      }
      // Switch back to idle
      setToolStatus('idle');
    }
    deleteGeoObject();
  }

  //Function return now short format - For object meaningful name
  function DateTimeNowShrtFormat()
  {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0');
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    
    return `${hours}:${minutes}:${seconds}`;
  }

  //*** Hooks *** */
  //Initial map load
  useEffect(() => {
    //Fetch all saved object on app load
    CleanAndReloadMap();
  }, []);

  //Load geo data to map ON EACH new fetch
  useEffect(() => {
    //Validate not empty
    if (!geoJsonData) return;
    //Wrap respone inside features layer
    const featureCollection = toFeatureCollection(geoJsonData);
    //Create a geo layer
    const geoLayer = L.geoJSON(featureCollection, {
      //Points
      pointToLayer: (_feature, latlng) =>
        L.marker(latlng, { icon: jeepIcon,}),
      //Polygons
      style: feature => {
        if (feature?.geometry.type === GeoObjectType.Polygon) {
          return {
            color: polygonGreen,
            weight: 2,
            fillOpacity: 0.3,
          };
        }
        return {};
      },
      //Add all features to the layer
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties?.name ?? '');
        // Add click listener
        layer.on('click', () => {
          const id = feature.id as string; // the feature's id
          //Ristrict only for Point when deletePoints tool, Polygon when deletePolygon tool
          if((toolStatus === 'deletePoints' && feature.geometry.type === GeoObjectType.Point) || 
             (toolStatus === 'deletePolygon' && feature.geometry.type === GeoObjectType.Polygon))
          {
            deleteSelectedGeoObject(id);
          }
        });
      },
    });
    //Add layer to map
    geoLayer.addTo(map);
    
    //Free the layer
    return () => {
      geoLayer.remove();
    };
  }, [geoJsonData, toolStatus]);

  //Called when application tools state changes
  useEffect(() => {
    //Set Map ctrl to current drew state
    switch(toolStatus){
      case 'drawPolygon':
        drawControlRef.current = new L.Draw.Polygon(map as any, {
          allowIntersection: false,
          showArea: true,
        });
        drawControlRef.current.enable();
        break;
      case 'drawPoints':
        drawControlRef.current = new L.Draw.Marker(map as any, { icon: jeepIcon,});
        drawControlRef.current.enable();
        break;
      case 'savePoints':
        SaveAccumulatedPoints(unsavedObjects);
        break;
      default:
        drawControlRef.current?.disable();
        drawControlRef.current = null;
        break;
    }

    return () => {
      drawControlRef.current?.disable();
    };
  }, [toolStatus, map]);

  //Called on the creation of a new geo oblect
  useEffect(() => {
    const onCreated = async (e: L.DrawEvents.Created) => {
      //*** POLYGON creation
      if (e.layerType === 'polygon') {
        //Prepare a layer for the new obj
        const layer = e.layer as L.Polygon;
        // Add the layer to the map to map
        map.addLayer(layer);
        // Convert Leaflet polygon to GeoGeometry format
        const geoGeometry = {
          type: GeoObjectType.Polygon,
          coordinates: (layer.getLatLngs() as L.LatLng[][]).map((ring) => ring.map((latlng) => [latlng.lng, latlng.lat])
          ),
        };
        //Prepare th polygon for (MongoDb format)
        const closedGeoGeometry = ClosePolygonBeforePost(geoGeometry);
        // Create Polygon GeoObject
        var polygonName = 'Polygon ' + DateTimeNowShrtFormat();
        const unsavedPolygon: GeoObject = {
          id: new ObjectId().toHexString(),
          name: polygonName,
          geometry: closedGeoGeometry,
        };
        // Add to context
        addUnsavedObject(unsavedPolygon);
        
        //Send to Web Service using POST
        try
        {
          const response = await fetch(BASE_API_URL +  BATCH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( [unsavedPolygon] ),
          });
          if (!response.ok)
          {
            if(response.status === 422)
            {
              alert("Polygon illigle. No support for interscting verteces polygons");
            }
          }
          CleanAndReloadMap();
        } catch (err) {
          throw new Error('Exception saving polygon', err);
        }

        // Switch back to idle
        setToolStatus('idle');
      }
      if (e.layerType === 'marker'){
        //Maybe one global for all points ???
        const layer = e.layer as L.Marker;
        map.addLayer(layer);
        //Get coords
        const latlng = (layer as L.Marker).getLatLng();
        //Create point GeoObject
        var pointName = 'Point ' + DateTimeNowShrtFormat();
        const unsavedPoint: GeoObject = {
          id: new ObjectId().toHexString(),
          name: pointName,
          geometry: {
            type: GeoObjectType.Point,
            coordinates:  [[[latlng.lng, latlng.lat]]],
          },
        };
        // Add to context Unsaved Object - Waiting for the save action
        addUnsavedObject(unsavedPoint);
        
        // Re-enable point drawing so user can click another point
        drawControlRef.current = new L.Draw.Marker(map as any, { icon: jeepIcon,});
        drawControlRef.current.enable();
      }
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    return () => {
          map.off(L.Draw.Event.CREATED, onCreated);
        };
  }, [map]);

  return null;
};
export default DrawController;