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
  IonSlides,
  IonSlide,
} from "@ionic/react";
import { useState } from "react";
import {
  chevronBack,
  arrowBack,
  ellipsisHorizontal,
  ellipsisVertical,
  volumeHigh,
  volumeMute,
  addCircle,
  removeCircle,
  navigate,
} from "ionicons/icons";
import logoVerona from "../assets/images/logo_stemma.png";
import PopoverList from "../components/PopoverList";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { fetchPOIDetails, fetchPOIMedia } from "../components/Functions";
import ReactHtmlParser from "react-html-parser";
import POIModal from "./POIModal";
import { i18n } from "i18next";
import { LanguageCode, POIDetails, POIMedia, TourDetails } from "../types/app_types";
import { SERVER_MEDIA } from "../configVar";
import { Browser } from "@capacitor/browser"

var poi_details: POIDetails;
var poi_media: POIMedia[];

function TourModal(props: {
	openCondition: boolean;
	onDismissConditions: (arg0: boolean) => void;
	data: TourDetails;
	i18n: i18n;
	setTourDetails: (arg0: TourDetails) => void;
	closeAllModals: () => void;
}) {
	const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
	const [poiView, setPoiView] = useState<boolean>(false); // Mostra i poi dell'itinerario o no
	const [present, dismiss] = useIonPopover(PopoverList, {
		onHide: () => dismiss(),
	});
	const [showPOIModal, setShowPOIModal] = useState<boolean>(false); // Mostra la POIModal in cui sono presenti i dettagli di un punto di interesse
	var location = useLocation();
	const lng = props.i18n.language as LanguageCode;

	/**
	 * Funzione che manda in riproduzione vocale la descrizione dell'itinerario
	 */
	function speak() {
		let textPlay = document
		.getElementById("description-text")!
		.innerText.replaceAll("\n", " ");
		setTextPlaying(true);
		let lngPlay = getDescription() ? lng + "-" + lng.toUpperCase() : "en-US";
		if (lngPlay === "en-EN") lngPlay = "en-US";
		TextToSpeech.speak({
		text: textPlay,
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

	/** Creazione della lista di itinerari cliccabili */
	function PoiList() {
		const tours_id = props.data.properties.points_tour_id.split(",");
		const tours_name = props.data.properties[`points_tour_name_${lng}`]
			? props.data.properties[`points_tour_name_${lng}`].split(",")
			: props.data.properties.points_tour_name_en.split(",");
		const listItems = tours_id.map((id: string, index: number) => (
		<IonItem
			button={ true }
			key={ id }
			lines={ index < tours_id.length - 1 ? "inset" : "none"} 
			onClick={() =>
				{ fetchPOIDetails(id, (poi: POIDetails) => {
					poi_details = poi;
					setShowPOIModal(true);
				})
				fetchPOIMedia(id, (media: POIMedia[]) => {
					poi_media = media;
				})
				}
			}
		>
			<IonLabel>{index + 1 + ". " + tours_name[index]}</IonLabel>
		</IonItem>
		));
		return <IonList className="ion-no-padding">{ listItems }</IonList>;
	}

	return (
		<IonModal
			isOpen={props.openCondition}
			onDidDismiss={() => {
				props.onDismissConditions(false);
				TextToSpeech.stop();
			}}
		>
		{/* Modal delle informazioni riguardanti il punto di interesse cliccato */}
		{ showPOIModal && (
			<POIModal
				openCondition={ showPOIModal }
				onDismissConditions={ setShowPOIModal }
				data={ poi_details }
				media={ poi_media }
				i18n={ props.i18n }
				setTourDetails={ props.setTourDetails }
				closeAllModals={() => {
					props.closeAllModals();
					setShowPOIModal(false);
				}}
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
						<IonImg src={ SERVER_MEDIA + props.data.properties.image_url } />
					</IonCol>
				</IonRow>

				{/* SCHEDA PUNTI DI INTERESSE */}

				<IonRow>
					<IonCol>
						<IonCard>
							<IonItem
								color="primary" //TITOLO MENU COLORATO
								lines={ poiView ? "inset" : "none" }
								onClick={ () => setPoiView(!poiView) }
							>
								<IonLabel>Punti di interesse:</IonLabel>
								<IonIcon
									slot="end"
									icon={ poiView ? removeCircle : addCircle }
									// color="primary" BOTTONE BIANCO CON TITOLO COLORATO
								/>
							</IonItem>

							{ poiView && (
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

				{/* TASTO PDF */}
				{(props.data.properties['filename']) && (
					<IonRow>
					<IonCol>
						<IonButton
							style={{ width: "100%" }}
							onClick={() => {
								Browser.open({url: SERVER_MEDIA + props.data.properties["filename"]})
							}}
						>
							PDF
						</IonButton>
					</IonCol>
				</IonRow>
				)}
				
				{/* TASTO MOSTRA ITINERARIO */}
				{(location.pathname === "/map") && (
					<IonRow>
						<IonCol>
							<IonButton
								style={{ width: "100%" }}
								onClick={() => {
									props.setTourDetails(props.data);
									props.closeAllModals();
									
								}}
							>
								{props.i18n.t("show_tour")}
							</IonButton>
						</IonCol>
					</IonRow>
				)}
			</IonGrid>
		</IonContent>
		</IonModal>
	);
}

export default TourModal;
