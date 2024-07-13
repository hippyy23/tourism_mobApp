import { IonLabel, IonButton, IonLoading, useIonToast } from "@ionic/react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { i18n } from "i18next";
import { LanguageCode, POI, POIDetails, TourDetails } from "../types/app_types";
import naturalValenceIcon from "../assets/images/natural_valence.png"; // Icona chiesa
import hisCultValenceIcon from "../assets/images/his_cult_valence.png"; // Icona monumento
import activityIcon from "../assets/images/activity.png"; // Icona museo
import { useState } from "react";
import POIModal from "../modals/POIModal";
import { ConnectionStatus } from "@capacitor/network";
import { fetchPOIDetails } from "./Functions";

var POIDetailsData: POIDetails;
var isLoading: boolean = false;

function POIMarker(props: {
	POIIds?: string[];
	POIListData: POI[];
	i18n: i18n;
	naturalValenceFilter: boolean;
	hisCultValenceFilter: boolean;
	activityFilter: boolean;
	setTourDetails: (arg0: TourDetails) => void;
	connectionStatus: ConnectionStatus;
	setMapCenter: (POIList: POI[]) => void;
}) {
	const [showLoading, setShowLoading] = useState<boolean>(false); // Permette di mostrare il componente di caricamento
	const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la modale con i dettagli del punto di interesse
	const [presentToast] = useIonToast();

  	/**
   	* Vengono filtrati i POI e tolti quelli non appartenti alle tre categorie
   	*/
  	var data = props.POIListData.filter((element: POI) =>
		[
			props.i18n.t("cat_natural_valence", { lng: "it" }),
			props.i18n.t("cat_his_cult_valence", { lng: "it" }),
			props.i18n.t("cat_activity", { lng: "it" }),
		].includes(element.properties.category_it)
  	);

	/**
 	* Se presente l'attr POIIds, vengono filtrati i POI e tolti quelli non appartenti all'array
	*/
	if (props.POIIds !== undefined) {
		data = data.filter((element: POI) =>
			props.POIIds!.includes(element.properties.id_art)
		);
  	}

	props.setMapCenter(data);

	/**
	 * Scarica i dettagli di un POI dal server
	 * @param id Identificatore del punto di interesse
	 */
	function getPOIDetails(id: string) {
		if (
			props.connectionStatus.connected &&
			((POIDetailsData !== undefined && POIDetailsData.classid !== id) ||
			POIDetailsData === undefined)
		) {
		fetchPOIDetails(id, (poi: POIDetails) => {
			POIDetailsData = poi;
			if (isLoading) {
				setShowPOIModal(true);
			}
		});
		}
	}

	/**
	 * Funzione che apre la modale di dettaglio del POI selezionato
	 * @param id Identificatore del punto di cui si vogliono i dettagli
	 */
	function openModal(id: string) {
		if (props.connectionStatus.connected) {
			if (POIDetailsData !== undefined && POIDetailsData.classid === id) {
				setShowPOIModal(true);
				isLoading = false;
			} else {
				setShowLoading(true);
				isLoading = true;
			}
		} else {
			presentToast({
				message: props.i18n.t("user_offline"),
				duration: 5000,
			});
		}
	}

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

	/**
	 * Restituisce la variabile del filtro in base alla categoria del POI
	 * @param category Categoria del POI
	 * @returns Filtro della categoria
	 */
	const filter = (category: string) => {
		if (category === props.i18n.t("cat_natural_valence", { lng: "it" })) {
			return props.naturalValenceFilter;
		} else if (category === props.i18n.t("cat_his_cult_valence", { lng: "it" })) {
			return props.hisCultValenceFilter;
		} /*if (category === t("cat_museums", {"lng": "it"}))*/ else {
			return props.activityFilter;
		}
	};

	const lang_code: LanguageCode = props.i18n.language as LanguageCode;

	/**
	 * Crea il marker del POI con il relativo popup
	 */
	const listMarkers = data.map((element: POI) => (
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
				getPOIDetails(element.properties.id_art);
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
					onClick={() => openModal(element.properties.id_art)}
				>
					{props.i18n.t("details_button")}
				</IonButton>
				</div>
			</Popup>
			</Marker>
		)}
		</div>
	));
	return (
		<>
		{listMarkers}
		{showLoading && (
			<IonLoading
			isOpen={showLoading}
			backdropDismiss={true}
			onDidDismiss={() => (isLoading = false)}
			spinner="circular"
			/>
		)}

		{/* Modal delle informazioni riguardanti il punto di interesse cliccato */}
		{showPOIModal && (
			<POIModal
			openCondition={showPOIModal}
			onPresent={() => {
				isLoading = false;
				setShowLoading(false);
			}}
			onDismissConditions={setShowPOIModal}
			data={POIDetailsData}
			i18n={props.i18n}
			setTourDetails={props.setTourDetails}
			closeAllModals={() => {
				setShowPOIModal(false);
			}}
			/>
		)}
		</>
	);
}

export default POIMarker;
