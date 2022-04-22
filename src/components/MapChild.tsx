import {
  useIonViewDidEnter,
  IonLoading,
  useIonToast,
  IonFab,
  IonChip,
  IonLabel,
  IonIcon,
  IonFabButton,
} from "@ionic/react";
import { TileLayer, useMap, Marker, Popup, Polyline } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import locationIcon from "../assets/images/location-sharp.svg";
import "../assets/leaflet/leaflet.css";
import { ConnectionStatus, Network } from "@capacitor/network";
import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";
import { Geolocation, Position } from "@capacitor/geolocation";
import {
  findCenter,
  getPOIListFromWebServer,
  getPOIDetailsFromWebServer,
  sendPosition,
  getTourListFromWebServer,
} from "../components/Functions";
import POIModal from "./POIModal";
import { LOCATION_BOUNDS, LANGUAGES } from "../configVar";
import PrivacyAlert from "./PrivacyAlert";
import { POI, POIDetails, Tour, TourDetails } from "../types/app_types";
import { i18n } from "i18next";
import POIMarker from "./POIMarker";
import { footsteps, close } from "ionicons/icons";
import TourListModal from "./TourListModal";
import TourModal from "./TourModal";

var POIListData: POI[];
var POIDetailsData: POIDetails;
var isLoading: boolean = false;
const onlineBounds = L.latLngBounds(
  [46.82405708134416, 10.194074757395123],
  [44.73066988557427, 13.193342264225922]
);
const offlineBounds = L.latLngBounds([45.4568, 10.9625], [45.4203, 11.0227]);
const locationBounds = L.latLngBounds(LOCATION_BOUNDS);
var watchId: string;
var deviceLanguage: string;
var tourListData: Tour[];

function MapChild(props: {
  churchersFilter: boolean;
  monumentsFilter: boolean;
  museumsFilter: boolean;
  dataObtained: boolean;
  setDataObtained: (arg0: boolean) => void;
  centerPosition: boolean;
  setCenterPosition: (arg0: boolean) => void;
  i18n: i18n;
}) {
  const [downloadedData, setDownloadedData] = useState<boolean>(false); // True se la lista dei punti con le loro coordinate sono stati scaricati dal webserver
  const [showLoading, setShowLoading] = useState<boolean>(false); // Permette di mostrare il componente di caricamento
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    // Stato della connessione del dispositivo
    connected: true,
    connectionType: "none",
  });
  const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la POIModal in cui sono presenti i dettagli di un punto di interesse
  const [position, setPosition] = useState<Position>(); // Variabile che contiene la posizione dell'utente
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false); // Variabile che contiene se si ha il permesso di ottenere la posizione dell'utente
  const [showLocationMarker, setShowLocationMarker] = useState<boolean>(false); // Indica se è da mostrare il marker della posizione dell'utente
  const [showPrivacyAlert, setShowPrivacyAlert] = useState<boolean>(false); // Indica se mostrare o meno l'alert della privacy
  const [tourDetails, setTourDetails] = useState<TourDetails | undefined>(
    undefined
  ); // Indica se mostrare o meno l'alert della privacy
  const [showTourListModal, setShowTourListModal] = useState<boolean>(false); // Mostra la modale con la lista dei tour
  const [showTourModal, setShowTourModal] = useState<boolean>(false); // Mostra o nascondi il modale dell'itinerario
  const map = useMap();
  const [presentToast] = useIonToast();
  var trackingEnable = true;

  function setCenterData() {
    map.panTo(findCenter(POIListData));
  }
  function setOfflineBounds() {
    map.setMaxBounds(offlineBounds);
  }
  function setOnlineBounds() {
    map.setMaxBounds(onlineBounds);
  }

  /**
   * Se lutente ha già dato il permesso di ottenere la posizione, viene richiamata questa funzione quando viene
   * premuto il pulsante di posizione. Viene centrata la mappa sulla posizione dell'utente e si tiene
   * aggiornato il marker della posizione dell'utente.
   */
  function setCenterPosition() {
    if (permissionGranted) {
      Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: 0,
      }).then((pos) => {
        if (pos) {
          let posll = L.latLng(pos.coords.latitude, pos.coords.longitude);
          if (locationBounds.contains(posll)) {
            map.panTo(posll);
            Geolocation.watchPosition(
              { enableHighAccuracy: true },
              updateUserPosition
            ).then((id) => (watchId = id));
          } else {
            Geolocation.clearWatch({ id: watchId });
            setShowLocationMarker(false);
            presentToast({
              /*buttons: [{ text: "hide", handler: () => dismissToast() }],*/
              message: props.i18n.t("user_not_in_verona"),
              duration: 5000,
            });
          }
        }
      });
    } else {
      checkLocationPermission();
    }
    props.setCenterPosition(false);
  }

  /**
   * Funzione che permette di aggiornare la posizione dell'utente, se l'utente è fuori dal bound della città di Verona
   * non viene più aggiornata la posizione dell'utente
   * @param pos Posizione dell'utente
   */
  function updateUserPosition(pos: Position | null) {
    if (pos) {
      if (trackingEnable) {
        Device.getId().then((id) => sendPosition(id, pos));
      }
      setPosition(pos);
      let posll = L.latLng(pos.coords.latitude, pos.coords.longitude);
      if (!locationBounds.contains(posll)) {
        Geolocation.clearWatch({ id: watchId });
        setShowLocationMarker(false);
      } else setShowLocationMarker(true);
    }
  }

  /**
   * Funzione che controlla se l'utente ha dato il permesso di ottenere la posizione,
   * se non ha dato alcuna preferenza viene mostrato un alert per chiedere il permesso
   */
  function checkLocationPermission() {
    Geolocation.requestPermissions()
      .then((permission) => {
        switch (permission.location) {
          case "denied":
            return;
          case "granted":
            setPermissionGranted(true);
            Geolocation.watchPosition(
              { enableHighAccuracy: true },
              updateUserPosition
            ).then((id) => (watchId = id));
            break;
        }
      })
      .catch(() => console.log("Browser not implemented"));
  }

  /**
   * Funzione invocata quando viene creato il componente
   */
  useIonViewDidEnter(() => {
    // Ridisegna la mappa, senza questa funzione non viene mostrata correttamente la mappa
    map.invalidateSize();

    checkLocationPermission();

    /**
     * Controlla se l'utente è online o offline
     * Nel primo caso, viene caricata la lista dei punti di interesse e salvata in locale
     * Nel secondo caso, viene caricata la lista dei punti di interesse salvata in locale se possibile
     */
    Network.getStatus().then((netStatus) => {
      setConnectionStatus(netStatus);
      Storage.get({ key: "baseData" }).then((result) => {
        if (result.value !== null) {
          POIListData = JSON.parse(result.value);
          props.setDataObtained(true);
          setCenterData();
          setOnlineBounds();
        }
      });

      if (netStatus.connected) {
        getList();
      } else {
        setOfflineBounds();
        presentToast({
          /*buttons: [{ text: "hide", handler: () => dismissToast() }],*/
          message: props.i18n.t("user_offline"),
          duration: 5000,
        });
      }
    });

    // Recupera la lingua scelta precedentemente e salvata, oppure quella del dispositivo, oppure quella di default
    Storage.get({ key: "languageCode" }).then((result) => {
      if (result.value !== null) {
        props.i18n.changeLanguage(result.value);
      } else {
        Device.getLanguageCode().then((lang) => {
          deviceLanguage = lang.value;
          if (LANGUAGES.includes(deviceLanguage)) {
            props.i18n.changeLanguage(deviceLanguage);
          }
        });
      }
    });

    // Tracciamento dell'utente
    Storage.get({ key: "tracking" }).then((result) => {
      if (result.value !== null) {
        // Impostare di non tracciare l'utente
        trackingEnable = result.value === "y";
      } else {
        // L'utente deve ancora esprimere la sua preferenza
        setShowPrivacyAlert(true);
      }
    });
  });

  /**
   * Intercetta il cambiamento dello stato della connessione, se l'utente torna online,
   * si ricarica la lista dei punti di interesse e cambia i limiti della mappa, altrimenti
   * si mostra un toast che indica che l'utente non è connesso a internet
   */
  Network.addListener("networkStatusChange", (status) => {
    console.log("Network status changed", status);
    if (status.connected) {
      getList();
      setOnlineBounds();
    } else {
      setOfflineBounds();
      presentToast({
        /*buttons: [{ text: "hide", handler: () => dismissToast() }],*/
        message: props.i18n.t("user_offline"),
        duration: 5000,
      });
    }
    setConnectionStatus(status);
  });

  /**
   * Scarica la lista dei POI dal server e li salva in locale
   */
  function getList() {
    if (downloadedData) return;
    getPOIListFromWebServer()
      .then((json: { features: POI[] }) => {
        POIListData = json.features;

        Storage.set({
          key: "baseData",
          value: JSON.stringify(POIListData),
        });
        setDownloadedData(true);
        props.setDataObtained(false);
        props.setDataObtained(true);
        setCenterData();
      })
      .catch((error) => {
        //console.error(error);
        alert(
          "Server non disponibile. I dettagli dei POI non possono essere mostrati."
        );
      });
  }

  /**
   * Scarica i dettagli di un POI dal server
   * @param id Identificatore del punto di interesse
   */
  function getPOIDetail(id: string) {
    if (
      connectionStatus.connected &&
      ((POIDetailsData !== undefined && POIDetailsData.classid !== id) ||
        POIDetailsData === undefined)
    ) {
      getPOIDetailsFromWebServer(id)
        .then(
          (json: {
            numberReturned: number;
            features: { properties: POIDetails }[];
          }) => {
            if (json.numberReturned === 1) {
              POIDetailsData = json.features[0].properties;
              if (isLoading) {
                setShowPOIModal(true);
              }
            }
          }
        )
        .catch(() => {
          isLoading = false;
          setShowLoading(false);
        });
    }
  }

  /**
   * Funzione che apre la modale di dettaglio del POI selezionato
   * @param id Identificatore del punto di cui si vogliono i dettagli
   */
  function openModal(id: string) {
    if (connectionStatus.connected) {
      if (POIDetailsData !== undefined && POIDetailsData.classid === id) {
        setShowPOIModal(true);
        isLoading = false;
      } else {
        setShowLoading(true);
        isLoading = true;
      }
    } else {
      presentToast({
        message: props.i18n.t("user_offline"),
        duration: 5000,
      });
    }
  }

  /** Richiedi al server la lista dei tour */
  function getTourList() {
    if (tourListData === undefined) {
      getTourListFromWebServer()
        .then((json: { features: Tour[] }) => {
          tourListData = json.features;
          setShowTourListModal(true);
        })
        .catch(() => {
          //TODO: Gestire errore
        });
    } else {
      setShowTourListModal(true);
    }
  }

  /** Coordinate che disegnano l'interesse, vengono invertite di posizione rispetto a quelle ricevute */
  const polylineTour: [number, number][] = tourDetails
    ? tourDetails.geometry.coordinates[0].map(
        (coordinates: [number, number]) => [coordinates[1], coordinates[0]]
      )
    : [];

  return (
    <>
      {/* Pulsante per aprire la lista di itinerari */}
      {!tourDetails && (
        <IonFab
          vertical="top"
          horizontal="end"
          onClick={() => {
            getTourList();
          }}
        >
          <IonFabButton color="light">
            <IonIcon icon={footsteps} color="primary" />
          </IonFabButton>
        </IonFab>
      )}

      {tourDetails && (
        <IonFab style={{ width: "-webkit-fill-available" }}>
          <IonChip
            class="chip"
            className="ion-margin-top ion-margin-end"
            onClick={() => {
              setShowTourModal(true);
            }}
          >
            <IonIcon icon={footsteps} color="primary" />
            <IonLabel class="chip-label">
              {tourDetails.properties.name_it}
            </IonLabel>

            <IonIcon
              icon={close}
              className="ion-align-items-end"
              color="danger"
              onClick={() => {
                setTourDetails(undefined);
              }}
            />
          </IonChip>
        </IonFab>
      )}

      {/** Alert che richiede all'utente se vuole essere tracciato anonimamente */}
      {showPrivacyAlert && (
        <PrivacyAlert
          i18n={props.i18n}
          onDismiss={() => setShowPrivacyAlert(false)}
          backdropDismiss={true}
        />
      )}

      {props.centerPosition && setCenterPosition()}

      {connectionStatus?.connected && (
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      {!connectionStatus?.connected && (
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="/tiles/{z}/{x}/{y}.png"
        />
      )}
      {showLoading && (
        <IonLoading
          isOpen={showLoading}
          backdropDismiss={true}
          onDidDismiss={() => (isLoading = false)}
          spinner="circular"
        />
      )}

      {/* Marker della posizione corrente dell'utente */}
      {showLocationMarker && (
        <Marker
          position={[position!.coords.latitude, position!.coords.longitude]}
          icon={L.icon({
            iconUrl: locationIcon,
            iconSize: [40, 40], // size of the icon
          })}
        >
          <Popup>{props.i18n.t("user_position")}</Popup>
        </Marker>
      )}

      {/* Creazione dinamica dei marker dei POI */}
      {!tourDetails && props.dataObtained && (
        <POIMarker
          POIList={POIListData}
          i18n={props.i18n}
          churchersFilter={props.churchersFilter}
          monumentsFilter={props.monumentsFilter}
          museumsFilter={props.museumsFilter}
          getDetails={getPOIDetail}
          openModal={openModal}
        />
      )}

      {/* Creazione dinamica dei marker dei POI */}
      {tourDetails && props.dataObtained && (
        <>
          <POIMarker
            POIList={POIListData}
            i18n={props.i18n}
            churchersFilter={props.churchersFilter}
            monumentsFilter={props.monumentsFilter}
            museumsFilter={props.museumsFilter}
            getDetails={getPOIDetail}
            openModal={openModal}
            POIIds={tourDetails.properties.points_tour_id.split(",")}
          />
          <Polyline positions={polylineTour} />
        </>
      )}

      {showTourListModal && (
        <TourListModal
          openCondition={showTourListModal}
          onDismissConditions={setShowTourListModal}
          data={tourListData}
          i18n={props.i18n}
          setTourDetails={setTourDetails}
          closeAllModals={() => {
            setShowTourModal(false);
            setShowTourListModal(false);
            setShowPOIModal(false);
          }}
        />
      )}

      {/* Modal delle informazioni riguardanti il punto di interesse cliccato */}
      {showPOIModal && (
        <POIModal
          openCondition={showPOIModal}
          onPresent={setShowLoading}
          onDismissConditions={setShowPOIModal}
          data={POIDetailsData}
          i18n={props.i18n}
          setTourDetails={setTourDetails}
          closeAllModals={() => {
            setShowTourModal(false);
            setShowTourListModal(false);
            setShowPOIModal(false);
          }}
        />
      )}

      {showTourModal && tourDetails && (
        <TourModal
          openCondition={showTourModal}
          onDismissConditions={setShowTourModal}
          data={tourDetails}
          i18n={props.i18n}
          setTourDetails={setTourDetails}
          closeAllModals={() => {
            setShowTourModal(false);
            setShowTourListModal(false);
            setShowPOIModal(false);
          }}
        />
      )}
    </>
  );
}

export default MapChild;
