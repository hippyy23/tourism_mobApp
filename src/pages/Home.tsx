import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";
import { MapContainer } from "react-leaflet";
import React, { useState } from "react";
import "../assets/leaflet/leaflet.css";
import churchIconFilter from "../assets/images/art_church.svg"; // Icona chiesa filtro
import monumentIconFilter from "../assets/images/art_monument.svg"; // Icona monumento filtro
import museumIconFilter from "../assets/images/art_museum.svg"; // Icona museo filtro
import MapChild from "../components/MapChild";
import { ellipsisHorizontal, ellipsisVertical, language, locationOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { Storage } from "@capacitor/storage";

const Home: React.FC = () => {
  const [churchersFilter, setChurchersFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa le chiese
  const [monumentsFilter, setMonumentsFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa i monumenti
  const [museumsFilter, setMuseumsFilter] = useState<boolean>(true); // Variabile che indica se mostrate sulla mappa i musei
  const [dataObtained, setDataObtained] = useState<boolean>(false); // True se possiedo la lista dei punti con le loro coordinate, o sono stati caricati dalla memoria oppure scaricati dal webserver
  const [chooseLanguage, setChooseLanguage] = useState<boolean>(false); // Variabile che indica se mostrare l'alert per la selezione della lingua
  const [centerPosition, setCenterPosition] = useState<boolean>(false);

  const { t, i18n } = useTranslation();
  var languageChoice: string;

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
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end" className="ion-margin-end">
          <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
          </IonButtons>
          <IonTitle>Mappa Verona</IonTitle>
        </IonToolbar>
      </IonHeader>

      
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

        {/* Filtro dei marker */}
        <IonFab
          vertical="bottom"
          horizontal="end"
          className="ion-margin-bottom"
        >
          <IonFabButton>
            <IonIcon icon={ellipsisHorizontal} />
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

          <IonFabList side="start">
            <IonFabButton color="light" onClick={() => setChooseLanguage(true)}>
              <IonIcon icon={language} />
            </IonFabButton>
          </IonFabList>
        </IonFab>

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

        <IonAlert
          isOpen={chooseLanguage}
          onDidPresent={() => (languageChoice = i18n.language)}
          header={"Choose a language"}
          inputs={[
            {
              name: "it",
              type: "radio",
              label: "Italiano",
              checked: i18n.language == "it",
              handler: () => {
                languageChoice = "it";
              },
            },
            {
              name: "en",
              type: "radio",
              label: "English",
              checked: i18n.language == "en",
              handler: () => {
                languageChoice = "en";
              },
            },
            {
              name: "de",
              type: "radio",
              label: "Deutsch",
              checked: i18n.language == "de",
              handler: () => {
                languageChoice = "de";
              },
            },
            {
              name: "fr",
              type: "radio",
              label: "Français",
              checked: i18n.language == "fr",
              handler: () => {
                languageChoice = "fr";
              },
            },
            {
              name: "es",
              type: "radio",
              label: "Español",
              checked: i18n.language == "es",
              handler: () => {
                languageChoice = "es";
              },
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Okay",
              handler: () => {
                if (i18n.language != languageChoice) {
                  i18n.changeLanguage(languageChoice);
                  Storage.set({
                    key: "languageCode",
                    value: i18n.language,
                  });
                }
              },
            },
          ]}
          onDidDismiss={() => setChooseLanguage(false)}
        />
    </IonPage>
  );
};

export default Home;
