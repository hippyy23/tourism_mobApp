import { DeviceId } from "@capacitor/device";
import { Position } from "@capacitor/geolocation";
import L from "leaflet";

// Trova il centro rispetto a tutti i punti di interesse
export function findCenter(data: any) {
  let x;
  let y;
  let z;
  let sumx = 0;
  let sumy = 0;
  let sumz = 0;
  let latitude;
  let longitude;
  data.forEach((element: any) => {
    element.elements.forEach((value: any) => {
      longitude = (value.coordinates[0] * Math.PI) / 180;
      latitude = (value.coordinates[1] * Math.PI) / 180;
      x = Math.cos(latitude) * Math.cos(longitude);
      y = Math.cos(latitude) * Math.sin(longitude);
      z = Math.sin(latitude);

      sumx += x;
      sumy += y;
      sumz += z;
    });
  });

  sumx /= data.length;
  sumy /= data.length;
  sumz /= data.length;

  let lon = Math.atan2(sumy, sumx);
  let lan = Math.atan2(sumz, Math.sqrt(sumx * sumx + sumy * sumy));

  lan = (lan * 180) / Math.PI;
  lon = (lon * 180) / Math.PI;

  return new L.LatLng(lan, lon);
}

var lastPos: Position;
// Invia la posizione del device al server
export function sendPosition(id: DeviceId, pos: Position) {
  if (lastPos) {
    let lastPosll = L.latLng(lastPos.coords.latitude, lastPos.coords.longitude);
    let posll = L.latLng(pos.coords.latitude, pos.coords.longitude);
    if (posll.distanceTo(lastPosll)<100)
      return;
  }
  alert({ id: id, position: pos });
  lastPos = pos;
}

// Ritorna la lista di tutti i punti di interesse con le coordinate e i nomi
export async function getListFromWebServer() {
  const artCategoryRequest =
    "https://sitavr.scienze.univr.it/geoserver" +
    "/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art_space" +
    "&outputFormat=json";

  return fetch(artCategoryRequest).then((response) => response.json());
}

// Ritorna i dettagli di un punto specifico
export async function getDetailsFromWebServer(id: string) {
  const classIdRequest =
    "https://sitavr.scienze.univr.it/geoserver" +
    "/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art" +
    "&cql_filter=(classid=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}

// Ritorna i media di un punto specifico
export async function getMediaFromWebServer(id: string) {
  const classIdRequest =
    "https://sitavr.scienze.univr.it/geoserver" +
    "/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art_media" +
    "&cql_filter=(art=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}
