import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonModal,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import React from "react";
import {
  chevronBack,
  arrowBack,
  ellipsisHorizontal,
  ellipsisVertical,
  locationOutline,
} from "ionicons/icons";
import PopoverList from "./PopoverList";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import toolbarIcon from "../assets/images/logo.png";
import monumentIcon from "../assets/images/art_monument.png"; // Icona monumento
import { i18n } from "i18next";

function TourModal(props: {
  openCondition: boolean;
  onDismissConditions: (arg0: boolean) => void;
  data: { polylineTour: [number, number][]; points_geom: string };
  i18n: i18n;
}) {
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });

  function PoiMarker() {
    const tour_coordinates = props.data.points_geom
      .split(",")
      .map((coordinate: string) =>
        coordinate.substring(6, coordinate.length - 1).split(" ")
      );
    const listItems = tour_coordinates.map(
      (coordinates:string[], index: number) => (
        <Marker
          key={index}
          position={[Number(coordinates[1]), Number(coordinates[0])]}
          icon={L.icon({
            iconUrl: monumentIcon,
            iconSize: [30, 30], // size of the icon
          })}
        />
      )
    );
    return <>{listItems}</>;
  }

  let max = props.data.polylineTour.reduce((max : [number, number], curr : [number, number]) => [max[0]>curr[0]?max[0]:curr[0], max[1]>curr[1]?max[1]:curr[1]], [-100,-100]);
  let min = props.data.polylineTour.reduce((min : [number, number], curr : [number, number]) => [min[0]<curr[0]?min[0]:curr[0], min[1]<curr[1]?min[1]:curr[1]], [100,100]);
  const tourCenter : [number, number] = [(max[0]+min[0])/2, (max[1]+min[1])/2];

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => props.onDismissConditions(false)}
    >
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
          <IonItem slot="start" lines="none" color="primary">
            <IonImg src={toolbarIcon} style={{ height: "80%" }} />
          </IonItem>

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
        {/* Pulsante per centrare nell propria posizione */}
        <IonFab
          vertical="bottom"
          horizontal="start"
          className="ion-margin-bottom"
          onClick={() => {
            // setCenterPosition(true);
          }}
        >
          <IonFabButton color="light">
            <IonIcon icon={locationOutline} color="primary"/>
          </IonFabButton>
        </IonFab>
        
        {/* SCHEDA MAPPA ITINERARIO */}
        <MapContainer
          center={tourCenter}
          zoom={15}
          minZoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          whenCreated={(mapInstance) => {
            setTimeout(() => mapInstance.invalidateSize(), 100);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={props.data.polylineTour} />
          <PoiMarker />
        </MapContainer>
      </IonContent>
    </IonModal>
  );
}

export default TourModal;
