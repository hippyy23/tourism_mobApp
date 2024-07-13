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
import { useState } from "react";
import {
  chevronBack,
  arrowBack,
  ellipsisHorizontal,
  ellipsisVertical,
} from "ionicons/icons";
import naturalValenceIcon from "../assets/images/natural_valence.svg"; // Icona chiesa filtro
import hisCultValenceIcon from "../assets/images/his_cult_valence.svg"; // Icona monumento filtro
import activityIcon from "../assets/images/activity.svg"; // Icona museo filtro
import toolbarIcon from "../assets/images/logo.png";
import { i18n } from "i18next";
import PopoverList from "../components/PopoverList";
import { LanguageCode, POI, POIDetails, TourDetails } from "../types/app_types";
import POIModal from "./POIModal";
import { fetchPOIDetails } from "../components/Functions";

var poi_details: POIDetails;

function SearchModal(props: {
  openCondition: boolean;
  onDismissConditions: (arg0: boolean) => void;
  POIListData: POI[];
  i18n: i18n;
  setTourDetails: (arg0: TourDetails) => void;
  closeAllModals: () => void;
}) {
  const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la modale con i dettagli del punto di interesse
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
      props.i18n.t("cat_natural_valence", { lng: "it" }),
      props.i18n.t("cat_his_cult_valence", { lng: "it" }),
      props.i18n.t("cat_activity", { lng: "it" }),
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
    if (category === props.i18n.t("cat_natural_valence", { lng: "it" })) {
      return naturalValenceIcon;
    } else if (category === props.i18n.t("cat_his_cult_valence", { lng: "it" })) {
      return hisCultValenceIcon;
    } /*if (category === t("cat_museums", {"lng": "it"}))*/ else {
      return activityIcon;
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
  const listPOI = data.map((POI: POI) => (
    <IonItem
      key={POI.properties.id_art}
      hidden={
        POIname(POI).toLowerCase().indexOf(searchText.toLowerCase()) < 0
      }
      onClick={() =>
        fetchPOIDetails(POI.properties.id_art, (poi_data: POIDetails) => {
          poi_details = poi_data;
          setShowPOIModal(true);
        })
      }
      button
    >
      <IonIcon
        icon={icon(POI.properties.category_it)}
        className="ion-margin-end"
      />
      <IonLabel>{POIname(POI)}</IonLabel>
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
        {/* Search Bar */}
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => {
            setSearchText(e.detail.value!);
          }}
        />

        {/* Lista  Poi*/}
        <IonList>{listPOI}</IonList>

        {/* Modal delle informazioni riguardanti il punto di interesse cliccato */}
        {showPOIModal && (
          <POIModal
            openCondition={showPOIModal}
            onDismissConditions={setShowPOIModal}
            data={poi_details}
            i18n={props.i18n}
            setTourDetails={props.setTourDetails}
            closeAllModals={() => {
              props.closeAllModals();
              setShowPOIModal(false);
            }}
          />
        )}
      </IonContent>
    </IonModal>
  );
}

export default SearchModal;
