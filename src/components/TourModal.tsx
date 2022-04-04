import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonRow,
  IonText,
  IonThumbnail,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  chevronBack,
  arrowBack,
  ellipsisHorizontal,
  ellipsisVertical,
  volumeHigh,
  volumeMute,
  addCircle,
  removeCircle,
} from "ionicons/icons";
import logoVerona from "../assets/images/logo_stemma.png";
import PopoverList from "./PopoverList";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { getPOIDetailsFromWebServer } from "./Functions";
import POIModal from "./POIModal";
import L from "leaflet";
import monumentIcon from "../assets/images/art_monument.png"; // Icona monumento

var poi_details: any;

function TourModal(props: {
  openCondition: any;
  onDismissConditions: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  code: any;
}) {
  const { t, i18n } = useTranslation();
  const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
  const [poiView, setPoiView] = useState<boolean>(false); // Mostra i poi dell'itinerario o no
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });
  const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la POIModal in cui sono presenti i dettagli di un punto di interesse

  function speak() {
    setTextPlaying(true);
    let lngPlay = getDescription()
      ? i18n.language + "-" + i18n.language.toUpperCase()
      : "en-US";
    if (lngPlay === "en-EN") lngPlay = "en-US";
    TextToSpeech.speak({
      text: removeDoubleSlashN(getDescriptionFallback()),
      lang: lngPlay,
    }).then(() => setTextPlaying(false));
  }

  function stop() {
    TextToSpeech.stop();
    setTextPlaying(false);
  }

  function getDescription() {
    return props.data.properties["descr_" + props.code];
  }

  function getDescriptionFallback(): string {
    let description = getDescription();
    return description ? description : props.data.properties["descr_en"];
  }

  const removeDoubleSlashN = (str: string) => {
    if (str) return str.replace(/\\n/g, "");
    return "No description for this POI.";
  };

  function getPOIDetail(id_tour: string) {
    getPOIDetailsFromWebServer(id_tour)
      .then((json) => {
        poi_details = json.features[0].properties;
        setShowPOIModal(true);
      })
      .catch(() => {
        //TODO: Gestire errore
      });
  }

  const polylineTour = props.data.geometry.coordinates[0].map(
    (coordinates: any[]) => [coordinates[1], coordinates[0]]
  ); // Coordinate del tour

  function PoiMarker() {
    const tour_coordinates = props.data.properties.points_geom
      .split(",")
      .map((coordinate: string) =>
        coordinate.substring(6, coordinate.length - 1).split(" ")
      );
    const listItems = tour_coordinates.map(
      (coordinates: any, index: number) => (
        <Marker key={index} position={[coordinates[1], coordinates[0]]} 
        icon={L.icon({
          iconUrl: monumentIcon,
          iconSize: [30, 30], // size of the icon
        })}/>
      )
    );
    return <>{listItems}</>;
  }

  /** Creazione della lista di itinerari cliccabili TODO*/
  function PoiList() {
    const tours_id = props.data.properties.points_tour_id.split(",");
    const tours_name = props.data.properties["points_tour_name_" + props.code]
      ? props.data.properties["points_tour_name_" + props.code].split(",")
      : props.data.properties.points_tour_name_en.split(",");
    const listItems = tours_id.map((id: string, index: number) => (
      <IonItem
        button={true}
        key={id}
        lines={index < tours_id.length - 1 ? "inset" : "none"}
        onClick={() => getPOIDetail(id)}
      >
        <IonLabel>{index + 1 + ". " + tours_name[index]}</IonLabel>
      </IonItem>
    ));
    return <IonList className="ion-no-padding">{listItems}</IonList>;
  }

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => props.onDismissConditions(false)}
    >
      {/* Modal delle informazioni riguardanti il punto di interesse cliccato */}
      {showPOIModal && (
        <POIModal
          openCondition={showPOIModal}
          onPresent={() => {}}
          onDismissConditions={setShowPOIModal}
          data={poi_details}
          code={i18n.language}
        />
      )}

      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          {/* FRECCIA INDIETRO */}
          <IonButtons slot="start" className="ion-margin">
            <IonIcon
              slot="icon-only"
              ios={chevronBack}
              md={arrowBack}
              onClick={() => props.onDismissConditions(false)}
            />
          </IonButtons>

          {/* LOGO COMUNE */}
          <IonThumbnail slot="start">
            <img src={logoVerona} alt="Logo Comune di Verona" />
          </IonThumbnail>

          {/* NOME TOUR */}
          <IonLabel slot="start" className="ion-padding-start">
            {props.data.properties["name_" + props.code] !== null
              ? props.data.properties["name_" + props.code]
              : props.data.properties["name_en"]}
          </IonLabel>

          {/* MENU OPZIONI POPOVER */}
          <IonButtons slot="end" className="ion-margin-end">
            <IonIcon
              slot="icon-only"
              ios={ellipsisHorizontal}
              md={ellipsisVertical}
              onClick={(e: any) =>
                present({
                  event: e.nativeEvent,
                })
              }
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid fixed={true}>
          {/* IMMAGINE */}
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonImg src={props.data.properties.image_url} />
            </IonCol>
          </IonRow>

          {/* SCHEDA PUNTI DI INTERESSE */}

          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                  lines={poiView ? "inset" : "none"}
                  onClick={() => setPoiView(!poiView)}
                >
                  <IonLabel>Punti di interesse:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={poiView ? removeCircle : addCircle}
                    // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
                  />
                </IonItem>

                {poiView && (
                  <IonCardContent className="ion-no-padding">
                    <PoiList />
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>

          {/* SCHEDA DESCRIZIONE */}
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                >
                  <IonLabel>{t("description")}:</IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={textPlaying ? stop : speak}
                  >
                    <IonIcon
                      slot="icon-only"
                      color="light"
                      icon={textPlaying ? volumeMute : volumeHigh}
                    />
                  </IonButton>
                </IonItem>

                <IonCardContent>
                  {!getDescription() && (
                    <IonNote color="danger">
                      {t("not_supported")}
                      <br />
                      <br />
                    </IonNote>
                  )}
                  <IonText color="dark" class="format-text">
                    {removeDoubleSlashN(getDescriptionFallback())}
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* SCHEDA MAPPA ITINERARIO */}
          {/* <IonRow>
            <IonCol>
              <IonCard onClick={() => console.log("aaa")}>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                >
                  <IonLabel>{t("mappa")}:</IonLabel>
                </IonItem>

                <IonCardContent>
                  <MapContainer
                    center={[45.43895, 10.99439]}
                    zoom={15}
                    minZoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "200px", width: "100%" }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={polylineTour} />
                    <PoiMarker />
                  </MapContainer>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow> */}

          <IonRow>
            <IonCol>
              <IonButton style={{ width: "100%" }}>Apri la mappa</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}

export default TourModal;
