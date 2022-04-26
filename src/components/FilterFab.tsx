import { IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/react";
import { i18n } from "i18next";
import churchIconFilter from "../assets/images/art_church.svg"; // Icona chiesa filtro
import monumentIconFilter from "../assets/images/art_monument.svg"; // Icona monumento filtro
import museumIconFilter from "../assets/images/art_museum.svg"; // Icona museo filtro
import { layers } from "ionicons/icons";

function FilterFab(props: {
  i18n: i18n;
  churchersFilter: boolean;
  setChurchersFilter: (arg0: boolean) => void;
  monumentsFilter: boolean;
  setMonumentsFilter: (arg0: boolean) => void;
  museumsFilter: boolean;
  setMuseumsFilter: (arg0: boolean) => void;
  fabRef: React.RefObject<HTMLIonFabElement>;
}) {
  return (
    <IonFab
      vertical="bottom"
      horizontal="end"
      className="ion-margin-bottom"
      ref={props.fabRef}
    >
      <IonFabButton>
        <IonIcon icon={layers} />
      </IonFabButton>
      <IonFabList side="top">
        <IonFabButton
          class={
            props.churchersFilter
              ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
              : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
          }
          onClick={() => {
            props.setChurchersFilter(!props.churchersFilter);
          }}
          data-desc={props.i18n.t("cat_churches")}
          data-bool={props.churchersFilter}
        >
          <IonIcon
            icon={churchIconFilter}
            class={
              props.churchersFilter
                ? "my-icon md hydrated"
                : "my-icon-opacity md hydrated"
            }
          />
        </IonFabButton>
        <IonFabButton
          class={
            props.monumentsFilter
              ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
              : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
          }
          onClick={() => props.setMonumentsFilter(!props.monumentsFilter)}
          data-desc={props.i18n.t("cat_monuments")}
        >
          <IonIcon
            icon={monumentIconFilter}
            class={
              props.monumentsFilter
                ? "my-icon md hydrated"
                : "my-icon-opacity md hydrated"
            }
          />
        </IonFabButton>
        <IonFabButton
          class={
            props.museumsFilter
              ? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
              : "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
          }
          onClick={() => props.setMuseumsFilter(!props.museumsFilter)}
          data-desc={props.i18n.t("cat_museums")}
        >
          <IonIcon
            icon={museumIconFilter}
            class={
              props.museumsFilter
                ? "my-icon md hydrated"
                : "my-icon-opacity md hydrated"
            }
          />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
}

export default FilterFab;
