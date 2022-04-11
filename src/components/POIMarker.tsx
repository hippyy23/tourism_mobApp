import {
  IonLabel,
  IonButton,
} from "@ionic/react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { i18n } from "i18next";
import { LanguageCode, POI } from "../types/app_types";
import churchIcon from "../assets/images/art_church.png"; // Icona chiesa
import monumentIcon from "../assets/images/art_monument.png"; // Icona monumento
import museumIcon from "../assets/images/art_museum.png"; // Icona museo

function POIMarker(props: {
  POIList: POI[];
  i18n: i18n;
  churchersFilter: boolean;
  monumentsFilter: boolean;
  museumsFilter: boolean;
  getDetails: (id: string) => void;
  openModal: (id: string) => void;
}) {
  var data = props.POIList.filter((element: POI) =>
    [
      props.i18n.t("cat_churches"),
      props.i18n.t("cat_monuments"),
      props.i18n.t("cat_museums"),
    ].includes(element.properties.category_it)
  );
  const icon = (category: string) => {
    if (category === props.i18n.t("cat_churches", { lng: "it" })) {
      return churchIcon;
    } else if (category === props.i18n.t("cat_monuments", { lng: "it" })) {
      return monumentIcon;
    } /*if (category === t("cat_museums", {"lng": "it"}))*/ else {
      return museumIcon;
    }
  };
  const filter = (category: string) => {
    if (category === props.i18n.t("cat_churches", { lng: "it" })) {
      return props.churchersFilter;
    } else if (category === props.i18n.t("cat_monuments", { lng: "it" })) {
      return props.monumentsFilter;
    } /*if (category === t("cat_museums", {"lng": "it"}))*/ else {
      return props.museumsFilter;
    }
  };
  const lang_code: LanguageCode = props.i18n
    .language as unknown as LanguageCode;
  const listMarkers = data.map((element: POI, index: number) => (
    <div key={element.properties.id_art}>
      {filter(element.properties.category_it) && (
        <Marker
          position={[
            element.geometry.coordinates[1],
            element.geometry.coordinates[0],
          ]}
          icon={L.icon({
            iconUrl: icon(element.properties.category_it),
            iconSize: [30, 30], // size of the icon
          })}
        >
          <Popup
            autoClose={false}
            onOpen={() => {
              props.getDetails(element.properties.id_art);
            }}
            minWidth={125}
            keepInView
          >
            <div style={{ textAlign: "center" }}>
              <IonLabel style={{ fontSize: "14px" }}>
                {element.properties[`name_${lang_code}`] !== null
                  ? element.properties[`name_${lang_code}`]
                  : element.properties.name_en}
              </IonLabel>
              <br />
              <IonButton
                shape="round"
                fill="outline"
                size="small"
                onClick={() => props.openModal(element.properties.id_art)}
              >
                {props.i18n.t("details_button")}
              </IonButton>
            </div>
          </Popup>
        </Marker>
      )}
    </div>
  ));
  return <>{listMarkers}</>;
}

export default POIMarker;
