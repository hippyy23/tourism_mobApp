import {
  IonAlert,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { i18n } from "i18next";
import { footsteps, map } from "ionicons/icons";
import { Polyline } from "react-leaflet";
import { useState } from "react";
import { TourDetails, POI } from "../types/app_types";
import POIMarker from "./POIMarker";
import TourModal from "../modals/TourModal";

function TourOnMap(props: {
  i18n: i18n;
  setShowTourModal: (arg0: boolean) => void;
  tourDetails: TourDetails;
  setTourDetails: (arg0: TourDetails | undefined) => void;
  POIListData: POI[];
}) {
  const [closeTourAlert, setCloseTourAlert] = useState<boolean>(false); // Indica se mostrare l'alert di conferma chiusura del tour
  const [showTourModal, setShowTourModal] = useState<boolean>(false); // Mostra la modale dell'itinerario

  /** Coordinate che disegnano l'interesse, vengono invertite di posizione rispetto a quelle ricevute */
  const polylineTour: [number, number][] =
    props.tourDetails.geometry.coordinates[0].map(
      (coordinates: [number, number]) => [coordinates[1], coordinates[0]]
    );

  return (
    <>
      {/* Titolo itinerario */}
      <IonFab style={{ width: "-webkit-fill-available" }}>
        <IonChip
          class="chip"
          className="ion-margin-top ion-margin-end"
          onClick={() => {
            props.setShowTourModal(true);
          }}
        >
          <IonIcon icon={footsteps} color="primary" />
          <IonLabel class="chip-label">
            {
              props.tourDetails.properties
                .name_it /** DA SISTEMARE CON LA TRADUZIONE */
            }
          </IonLabel>
        </IonChip>
      </IonFab>

      {/* Pulsante per tornare alla mappa originale */}

      <IonFab
        vertical="bottom"
        horizontal="end"
        className="ion-margin-bottom"
        onClick={() => setCloseTourAlert(true)}
      >
        <IonFabButton color="light">
          <IonIcon icon={map} color="primary" />
        </IonFabButton>
      </IonFab>

      {/* Alert di conferma chiusura itinerario */}
      <IonAlert
        isOpen={closeTourAlert}
        header={props.i18n.t("tour_alert_title")}
        message={props.i18n.t("tour_alert_message")}
        onDidDismiss={() => {
          setCloseTourAlert(false);
        }}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Okay",
            handler: () => {
              props.setTourDetails(undefined);
            },
          },
        ]}
      />

      <POIMarker
        POIListData={props.POIListData}
        i18n={props.i18n}
        churchersFilter={true}
        monumentsFilter={true}
        museumsFilter={true}
        POIIds={props.tourDetails.properties.points_tour_id.split(",")}
      />
      <Polyline positions={polylineTour} />

      {showTourModal && (
        <TourModal
          openCondition={showTourModal}
          onDismissConditions={setShowTourModal}
          data={props.tourDetails}
          i18n={props.i18n}
          setTourDetails={props.setTourDetails}
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

export default TourOnMap;
