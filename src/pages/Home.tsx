import {
  IonAlert,
  IonButtons,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonPage,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import {
  ellipsisHorizontal,
  ellipsisVertical,
  layers,
  locationOutline,
} from "ionicons/icons";
import "./Home.css";
import { MapContainer } from "react-leaflet";
import React, { useRef, useState } from "react";
import "../assets/leaflet/leaflet.css";
import churchIconFilter from "../assets/images/art_church.svg"; // Icona chiesa filtro
import monumentIconFilter from "../assets/images/art_monument.svg"; // Icona monumento filtro
import museumIconFilter from "../assets/images/art_museum.svg"; // Icona museo filtro
import toolbarIcon from "../assets/images/logo.png";
import MapChild from "../components/MapChild";
import LanguageAlert from "../components/LanguageAlert";
import PopoverList from "../components/PopoverList";

import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const [churchersFilter, setChurchersFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa le chiese
  const [monumentsFilter, setMonumentsFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa i monumenti
  const [museumsFilter, setMuseumsFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa i musei
  const [dataObtained, setDataObtained] = useState<boolean>(false); // True se possiedo la lista dei punti con le loro coordinate, o sono stati caricati dalla memoria oppure scaricati dal webserver
  const [chooseLanguage, setChooseLanguage] = useState<boolean>(false); // Variabile che indica se mostrare l'alert per la selezione della lingua
  const [centerPosition, setCenterPosition] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const fabRef = useRef<HTMLIonFabElement>(null);

  const { t, i18n } = useTranslation();

  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
    t,
    setChooseLanguage,
    setShowInfo,
  });

  return (
    <IonPage>
      {/* Utilizzo di css e javascript di leaflet online
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
      ></script>
      */}
      <IonHeader
        onClick={() => {
          if (fabRef.current?.activated) {
            fabRef.current.activated = false;
          }
        }}
      >
        <IonToolbar color="primary">
          <IonItem slot="start" lines="none" color="primary">
            <IonImg src={toolbarIcon} />
          </IonItem>

          <IonButtons slot="end" className="ion-margin-end">
            <IonIcon
              slot="icon-only"
              ios={ellipsisHorizontal}
              md={ellipsisVertical}
              onClick={(e) =>
                present({
                  event: e.nativeEvent,
                })
              }
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/*<div
        onClick={() => {
          if (fabRef.current?.activated) {
            fabRef.current.activated = false;
          }
        }}
        style={{ height: "100%" }}
      >*/}
      <MapContainer
        center={[45.43895, 10.99439]}
        zoom={15}
        minZoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <MapChild
          churchersFilter={churchersFilter}
          monumentsFilter={monumentsFilter}
          museumsFilter={museumsFilter}
          dataObtained={dataObtained}
          setDataObtained={setDataObtained}
          centerPosition={centerPosition}
          setCenterPosition={setCenterPosition}
        />
      </MapContainer>

      {/* Pulsante per centrare nell propria posizione */}
      <IonFab
        vertical="bottom"
        horizontal="start"
        className="ion-margin-bottom"
        onClick={() => {
          setCenterPosition(true);
        }}
      >
        <IonFabButton color="light">
          <IonIcon icon={locationOutline} />
        </IonFabButton>
      </IonFab>
      {/*</div>*/}

      {/* Filtro dei marker */}
      <IonFab
        vertical="bottom"
        horizontal="end"
        className="ion-margin-bottom"
        ref={fabRef}
      >
        <IonFabButton>
          <IonIcon icon={layers} />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton
            class={
              churchersFilter
                ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
                : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
            }
            onClick={() => {
              setChurchersFilter(!churchersFilter);
            }}
            disabled={!dataObtained}
            data-desc={t("cat_churches")}
            data-bool={churchersFilter}
          >
            <IonIcon
              icon={churchIconFilter}
              class={
                churchersFilter
                  ? "my-icon md hydrated"
                  : "my-icon-opacity md hydrated"
              }
            />
          </IonFabButton>
          <IonFabButton
            class={
              monumentsFilter
                ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
                : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
            }
            onClick={() => setMonumentsFilter(!monumentsFilter)}
            disabled={!dataObtained}
            data-desc={t("cat_monuments")}
          >
            <IonIcon
              icon={monumentIconFilter}
              class={
                monumentsFilter
                  ? "my-icon md hydrated"
                  : "my-icon-opacity md hydrated"
              }
            />
          </IonFabButton>
          <IonFabButton
            class={
              museumsFilter
                ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
                : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
            }
            onClick={() => setMuseumsFilter(!museumsFilter)}
            disabled={!dataObtained}
            data-desc={t("cat_museums")}
          >
            <IonIcon
              icon={museumIconFilter}
              class={
                museumsFilter
                  ? "my-icon md hydrated"
                  : "my-icon-opacity md hydrated"
              }
            />
          </IonFabButton>
        </IonFabList>
      </IonFab>

      {chooseLanguage && (
        <LanguageAlert i18n={i18n} onDismiss={() => setChooseLanguage(false)} />
      )}

      <IonAlert
        isOpen={showInfo}
        header={"Informazioni e contatti"}
        onDidDismiss={() => setShowInfo(false)}
        buttons={[{ text: "Close", role: "cancel", cssClass: "secondary" }]}
        message={
          "Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica"
        }
      />
    </IonPage>
  );
};

export default Home;
