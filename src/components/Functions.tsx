import { Device, DeviceId } from "@capacitor/device";
import { Position } from "@capacitor/geolocation";
import L from "leaflet";
import { LOG_SERVER_DOMAIN, SERVER_DOMAIN } from "../configVar";

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
// Invia la posizione del device al server se ci si sposta di più di 100 metri oppure ogni 30 secondi
export async function sendPosition(id: DeviceId, pos: Position) {
  if (lastPos) {
    let lastPosll = L.latLng(lastPos.coords.latitude, lastPos.coords.longitude);
    let posll = L.latLng(pos.coords.latitude, pos.coords.longitude);
    let timeDiff = pos.timestamp - lastPos.timestamp;
    if (posll.distanceTo(lastPosll) < 100 && timeDiff < 30000) return;
  }
  //alert("Invio al server i dati " + { id: id, position: pos });
  let deviceId = await Device.getId();
  sendToLogServer("location", {
    id: deviceId.uuid,
    timestamp: new Date(pos.timestamp).toISOString(),
    coords: pos.coords,
  }).catch(() => {
    console.log("Impossibile contattare il server di log");
  });
  lastPos = pos;
}

// Ritorna la lista di tutti i punti di interesse con le coordinate e i nomi
export async function getPOIListFromWebServer() {
  const artCategoryRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art_space" +
    "&outputFormat=json";

  return fetch(artCategoryRequest).then((response) => response.json());
}

// Ritorna i dettagli di un punto specifico
export async function getPOIDetailsFromWebServer(id: string) {
  const classIdRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art" +
    "&cql_filter=(classid=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}

// Ritorna i media di un punto specifico
export async function getPOIMediaFromWebServer(id: string) {
  const classIdRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_art_media" +
    "&cql_filter=(art=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}

// Ritorna l'occupazione di un punto specifico
export async function getCrowdingFromWebServer(id: string) {
  const classIdRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:crowding" +
    "&cql_filter=(punto_di_interesse=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}

// Ritorna la lista di tutti gli itinerari
export async function getTourListFromWebServer() {
  const artCategoryRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_tour_space" +
    "&outputFormat=json";

  return fetch(artCategoryRequest).then((response) => response.json());
}

// Ritorna i dettagli di un itinerario specifico
export async function getTourDetailsFromWebServer(id: string) {
  const classIdRequest =
    SERVER_DOMAIN +
    "geoserver/tourism/ows?service=WFS&version=1.0.0" +
    "&request=GetFeature" +
    "&typeName=tourism:v_tour" +
    "&cql_filter=(classid=" +
    id +
    ")" +
    "&outputFormat=json";

  return fetch(classIdRequest).then((response) => response.json());
}

export async function sendLanguage(chooseLng: string) {
  let deviceId = await Device.getId();
  let deviceInfo = await Device.getInfo();
  let deviceLng = await Device.getLanguageCode();

  sendToLogServer("language", {
    id: deviceId.uuid,
    platform: deviceInfo.platform,
    deviceLng: deviceLng.value.substr(0, 2),
    chooseLng: chooseLng,
  }).catch(() => {
    console.log("Impossibile contattare il server di log");
  });
}

export async function sendToLogServer(path: string, data: Object) {
  return fetch(LOG_SERVER_DOMAIN + path, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
