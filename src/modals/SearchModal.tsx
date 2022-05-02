import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonToolbar,
  useIonPopover,
} from "@ionic/react";
import { ReactElement, useState } from "react";
import {
  chevronBack,
  arrowBack,
  ellipsisHorizontal,
  ellipsisVertical,
} from "ionicons/icons";
import churchIcon from "../assets/images/art_church.svg"; // Icona chiesa filtro
import monumentIcon from "../assets/images/art_monument.svg"; // Icona monumento filtro
import museumIcon from "../assets/images/art_museum.svg"; // Icona museo filtro
import toolbarIcon from "../assets/images/logo.png";
import { i18n } from "i18next";
import PopoverList from "../components/PopoverList";
import { LanguageCode, POI } from "../types/app_types";

function SearchModal(props: {
  openCondition: boolean;
  onDismissConditions: (arg0: boolean) => void;
  POIListData: POI[];
  i18n: i18n;
}) {
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });
  const [searchText, setSearchText] = useState<string>(""); // Valore searchbar

  const lang_code: LanguageCode = props.i18n.language as LanguageCode;

  /**
   * Vengono filtrati i POI e tolti quelli non appartenti alle tre categorie
   */
  var data = props.POIListData.filter((element: POI) =>
    [
      props.i18n.t("cat_churches", { lng: "it" }),
      props.i18n.t("cat_monuments", { lng: "it" }),
      props.i18n.t("cat_museums", { lng: "it" }),
    ].includes(element.properties.category_it)
  ).sort((a: POI, b: POI) =>
    a.properties.name_it.localeCompare(b.properties.name_it)
  );

  /**
   * Restituisce l'icona corretta in base alla categoria del POI
   * @param category Categoria del POI
   * @returns Icona
   */
  const icon = (category: string) => {
    if (category === props.i18n.t("cat_churches", { lng: "it" })) {
      return churchIcon;
    } else if (category === props.i18n.t("cat_monuments", { lng: "it" })) {
      return monumentIcon;
    } /*if (category === t("cat_museums", {"lng": "it"}))*/ else {
      return museumIcon;
    }
  };

  const POIname = (POI: POI) => {
    return POI.properties[`name_${lang_code}`] !== null
      ? POI.properties[`name_${lang_code}`]
      : POI.properties.name_en;
  };

  /**
   * Crea la lista di POI
   */
  const listPOI = data.map((element: POI) => (
    <IonItem key={element.properties.id_art} hidden={POIname(element).toLowerCase().indexOf(searchText)==-1}>
      <IonIcon
        icon={icon(element.properties.category_it)}
        className="ion-margin-end"
      />
      <IonLabel>{POIname(element)}</IonLabel>
    </IonItem>
  ));

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => props.onDismissConditions(false)}
    >
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
        {/* SEARCH BAR */}
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => {
            setSearchText(e.detail.value!);
          }}
        />

        {/* LISTA  TODO*/}
        <IonList>{listPOI}</IonList>
      </IonContent>
    </IonModal>
  );
}

export default SearchModal;
