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
import { getPOIDetailsFromWebServer } from "./Functions";
import ReactHtmlParser from "react-html-parser";
import POIModal from "./POIModal";
import TourMapModal from "./TourMapModal";
import { i18n } from "i18next";
import { LanguageCode, POIDetails, TourDetails } from "../types/app_types";

var poi_details: POIDetails;

function TourModal(props: {
  openCondition: boolean;
  onDismissConditions: (arg0: boolean) => void;
  data: TourDetails;
  i18n: i18n;
}) {
  const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
  const [poiView, setPoiView] = useState<boolean>(false); // Mostra i poi dell'itinerario o no
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });
  const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la POIModal in cui sono presenti i dettagli di un punto di interesse
  const [showTourMapModal, setShowTourMapModal] = useState<boolean>(false); // Mostra la POIModal in cui sono presenti i dettagli di un punto di interesse

  const lng = props.i18n.language as LanguageCode;

  /**
   * Funzione che manda in riproduzione vocale la descrizione dell'itinerario
   */
  function speak() {
    setTextPlaying(true);
    let lngPlay = getDescription() ? lng + "-" + lng.toUpperCase() : "en-US";
    if (lngPlay === "en-EN") lngPlay = "en-US";
    TextToSpeech.speak({
      text: document
        .getElementById("description-text")!
        .innerText.replaceAll("\n", " "),
      lang: lngPlay,
    }).then(() => setTextPlaying(false));
  }

  /**
   * Ferma la riproduzione vocale
   */
  function stop() {
    TextToSpeech.stop();
    setTextPlaying(false);
  }

  function getDescription() {
    return props.data.properties[`descr_${lng}`];
  }

  function getDescriptionFallback(): string {
    let description = getDescription();
    return description ? description : props.data.properties["descr_en"];
  }

  const removeDoubleSlashN = (str: string) => {
    if (str) return str.replace(/\\n/g, "");
    return "No description for this POI.";
  };

  /**
   * Scarica i dettagli di un punto di interesse e apre la modale per visualizzarli
   * @param id_poi Identificativo del poi
   */
  function getPOIDetail(id_poi: string) {
    getPOIDetailsFromWebServer(id_poi)
      .then((json: { features: { properties: POIDetails }[] }) => {
        poi_details = json.features[0].properties;
        setShowPOIModal(true);
      })
      .catch(() => {
        //TODO: Gestire errore
      });
  }

  /** Coordinate che disegnano l'interesse, vengono invertite di posizione rispetto a quelle ricevute */
  const polylineTour: [number, number][] =
    props.data.geometry.coordinates[0].map((coordinates: [number, number]) => [
      coordinates[1],
      coordinates[0],
    ]);

  /** Creazione della lista di itinerari cliccabili */
  function PoiList() {
    const tours_id = props.data.properties.points_tour_id.split(",");
    const tours_name = props.data.properties[`points_tour_name_${lng}`]
      ? props.data.properties[`points_tour_name_${lng}`].split(",")
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
          onDismissConditions={setShowPOIModal}
          data={poi_details}
          i18n={props.i18n}
        />
      )}

      {/* Modal della mappa del tour */}
      {showTourMapModal && (
        <TourMapModal
          openCondition={showTourMapModal}
          onDismissConditions={setShowTourMapModal}
          data={{
            points_geom: props.data.properties.points_geom,
            polylineTour: polylineTour,
          }}
          i18n={props.i18n}
        />
      )}

      {/* HEADER */}
      <IonHeader>
        <IonToolbar color="primary">
          {/* FRECCIA INDIETRO */}
          <IonButtons slot="start" class="toolbar_back_button">
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
          <IonLabel slot="start" class="toolbar_label">
            {props.data.properties[`name_${lng}`] !== null
              ? props.data.properties[`name_${lng}`]
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
                  <IonLabel>{props.i18n.t("description")}:</IonLabel>
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
                      {props.i18n.t("not_supported")}
                      <br />
                      <br />
                    </IonNote>
                  )}
                  <IonText
                    color="dark"
                    class="format-text"
                    id="description-text"
                  >
                    {ReactHtmlParser(
                      removeDoubleSlashN(getDescriptionFallback())
                    )}
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton
                style={{ width: "100%" }}
                onClick={() => {
                  props.onDismissConditions(false);
                }}
              >
                Apri la mappa
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}

export default TourModal;
