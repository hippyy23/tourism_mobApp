import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonIcon,
	IonImg,
	IonItem,
	IonLabel,
	IonModal,
	IonRow,
	IonText,
	IonToolbar,
	// IonicSwiper,
	IonHeader,
	useIonPopover,
	IonButtons,
	IonThumbnail,
	IonNote,
	IonList,
} from "@ionic/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import {
	addCircle,
	arrowBack,
	chevronBack,
	ellipsisHorizontal,
	ellipsisVertical,
	removeCircle,
	volumeHigh,
  	volumeMute,
} from "ionicons/icons";
import ReactHtmlParser from "html-react-parser";
import { fetchTourDetails } from "../components/Functions";
// import SwiperCore, { Navigation, Pagination } from "swiper";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import ReactPlayer from "react-player/file";
import "swiper/css";
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import "@ionic/react/css/ionic-swiper.css";
import PopoverList from "../components/PopoverList";
import logoVerona from "../assets/images/logo_stemma.png";
import TourModal from "./TourModal";
import { i18n } from "i18next";
import { LanguageCode, POIDetails, TourDetails, POIMedia } from "../types/app_types";
import { SERVER_MEDIA } from "../configVar";
import { useRef } from "react"

var tour_details: TourDetails;

function POIModal(props: {
	openCondition: boolean;
	onPresent?: (arg0: boolean) => void;
	onDismissConditions: (arg0: boolean) => void;
	data: POIDetails;
	media: POIMedia[];
	i18n: i18n;
	setTourDetails: (arg0: TourDetails) => void;
	closeAllModals: () => void;
}) {
	const [openTimeView, setOpenTimeView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli orari del punto di interesse
	const [ticketsView, setTicketsView] = useState<boolean>(false); // Mostra o nascondi il testo relativo al prezzo dei biglietti del punto di interesse
	const [toursView, setToursView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli itinerari
	const [urlMedia, setUrlMedia] = useState<string>(); // Imposta la URL da dove caricare il video del POI se è presente
	const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
	const [showTourModal, setShowTourModal] = useState<boolean>(false); // Mostra o nascondi il modale dell'itinerario

	/**
	 * Conta il numero di itinerari in cui il punto di interesse è presente
	 */
	const n_tours = props.data.tours_id
		? props.data.tours_id.split(",").length
		: 0;

  /**
   * Funzione che manda in riproduzione vocale la descrizione del punto di interesse
   */
	function speak() {
		setTextPlaying(true);
		let lngPlay = getDescription()
			? props.i18n.language + "-" + props.i18n.language.toUpperCase()
			: "en-US";
		if (lngPlay === "en-EN") lngPlay = "en-US";
		TextToSpeech.speak({
			text: removeDoubleSlashN(getDescriptionFallback()),
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
	const code = props.i18n.language as LanguageCode;

	/**
	 * Funzioni che restituiscono orari, biglietti e descrizione nel linguaggio scelto,
	 * servono anche a controllare se il contenuto è disponibile in quella lingua
	 */
	const getOpenTime = () => {
		if (code === "it") return props.data.open_time;
		return props.data[`open_time_${code}`];
	};
	const getTickets = () => {
		if (code === "it") return props.data.tickets;
		return props.data[`tickets_${code}`];
	};
	function getDescription() {
		return props.data[`descr_${code}`];
	}

	/**
	 * Funzioni che restituiscono il contenuto da visualizzare nelle schede nella propria lingua,
	 * se presente oppure in inglese
	 */
	const getOpenTimeFallback = () => {
		let openTime = getOpenTime();
		return openTime ? openTime : props.data["open_time_en"];
	};
	const getTicketsFallback = () => {
		let tickets = getTickets();
		return tickets ? tickets : props.data["tickets_en"];
	};
	function getDescriptionFallback(): string {
		let description = getDescription();
		return description ? description : props.data["descr_en"];
	}

	const removeDoubleSlashN = (str: string) => {
		if (str) return str.replace(/\\n/g, "");
		return "No description for this POI.";
	};

	/** Menu opzioni */
	const [present, dismiss] = useIonPopover(PopoverList, {
		onHide: () => dismiss(),
	});

	/**
	 * Scarica i dettagli di un itinerario e apre la modale per visualizzarli
	 * @param id_tour Identificativo del tour
	 */
	function getTourDetail(id_tour: string) {
		fetchTourDetails(id_tour, (tour: TourDetails) => {
			tour_details = tour;
			setShowTourModal(true);
		});
	}

	/** Creazione della lista di itinerari cliccabili */
	function TourList() {
		var tours_id = props.data.tours_id.split(",");
		tours_id = tours_id.filter(function (item, pos) {
			return tours_id.indexOf(item) === pos;
		});
		const tours_name = props.data[`tours_name_${code}`]
			? props.data[`tours_name_${code}`].split(",")
			: props.data.tours_name_en.split(",");
		console.log(tours_id);
		const listItems = tours_id.map((id: string, index: number) => (
			<IonItem
				button={ true }
				key={ id }
				lines={ index < n_tours - 1 ? "inset" : "none" }
				onClick={() => {
					getTourDetail(id);
				}}
			>
				<IonLabel>{ tours_name[index] }</IonLabel>
			</IonItem>
		));
		return <IonList className="ion-no-padding">{ listItems }</IonList>;
	}

	function Carousel() {
		var mediaPath: string[] = [];

		props.media.forEach((obj) => (
			mediaPath.push(SERVER_MEDIA + obj.properties.path)
		));
		
		const slides = mediaPath.map((path: string, index: number) => (
			<SwiperSlide key={ index }>
				<IonImg src={ path } />
			</SwiperSlide>
		));

		if (mediaPath.length) {
			return (
				<IonCol>
					<Swiper 
						modules={ [Autoplay, Keyboard, Pagination, Scrollbar, Zoom] }
						keyboard={ true }
						scrollbar={ true }
						zoom={ true }
					>{ slides }</Swiper>
				</IonCol>
			)
		} else {
			return (
				<IonCol>
					<Swiper>{ slides }</Swiper>
				</IonCol>
			)
		}
	}

	return (
		<IonModal
			isOpen={props.openCondition}
			onDidDismiss={() => {
				props.onDismissConditions(false);
				TextToSpeech.stop();
			}}
			onWillPresent={() => {
				props.onPresent?.(false);
				// fetchPOIMedia(props.data.classid, (poiMediaList: POIMedia[]) => {
				// 	console.log(poiMediaList);
				// 	// for (var path of poiMediaList) {
				// 	// 	console.log(path.properties.path);
				// 	// }
				// });
			}}
		>
		{showTourModal && (
			<TourModal
				openCondition={showTourModal}
				onDismissConditions={setShowTourModal}
				data={tour_details}
				i18n={props.i18n}
				setTourDetails={props.setTourDetails}
				closeAllModals={() => {
					props.closeAllModals();
					setShowTourModal(false);
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

			{/* NOME POI */}
			<IonLabel slot="start" class="toolbar_label">
				{props.data[`name_${code}`] !== null
				? props.data[`name_${code}`]
				: props.data["name_en"]}
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
				{/* <IonCol>
					<IonImg src={SERVER_MEDIA + props.data.image_url} />
				</IonCol> */}

				<Carousel />
			</IonRow>

			{/* SCHEDA ORARI */}
			<IonRow>
				<IonCol>
				<IonCard>
					<IonItem
						color="primary" //TITOLO MENU COLORATO
						lines={openTimeView ? "inset" : "none"}
						onClick={() => setOpenTimeView(!openTimeView)}
					>
					<IonLabel>{props.i18n.t("open_time")}:</IonLabel>
					<IonIcon
						slot="end"
						icon={openTimeView ? removeCircle : addCircle}
						// color="primary" BOTTONE BIANCO CON TITOLO COLORATO
					/>
					</IonItem>

					{openTimeView && (
					<IonCardContent>
						{!getOpenTime() && (
						<IonNote color="danger">
							{props.i18n.t("not_supported")}
							<br />
							<br />
						</IonNote>
						)}
						<IonLabel color="dark">
						{ReactHtmlParser(getOpenTimeFallback())}
						</IonLabel>
					</IonCardContent>
					)}
				</IonCard>
				</IonCol>
			</IonRow>

			{/* SCHEDA BIGLIETTI */}
			<IonRow>
				<IonCol>
				<IonCard>
					<IonItem
						color="primary" //TITOLO MENU COLORATO
						lines={ticketsView ? "inset" : "none"}
						onClick={() => setTicketsView(!ticketsView)}
					>
					<IonLabel>{props.i18n.t("tickets")}:</IonLabel>
					<IonIcon
						slot="end"
						icon={ticketsView ? removeCircle : addCircle}
						// color="primary" BOTTONE BIANCO CON TITOLO COLORATO
					/>
					</IonItem>

					{ticketsView && (
					<IonCardContent>
						{!getTickets() && (
						<IonNote color="danger">
							{props.i18n.t("not_supported")}
							<br />
							<br />
						</IonNote>
						)}
						<IonLabel color="dark">
						{ReactHtmlParser(getTicketsFallback())}
						</IonLabel>
					</IonCardContent>
					)}
				</IonCard>
				</IonCol>
			</IonRow>

			{/* SCHEDA ITINERARI */}
			{n_tours > 0 && (
				<IonRow>
					<IonCol>
						<IonCard>
							<IonItem
								color="primary" //TITOLO MENU COLORATO
								lines={toursView ? "inset" : "none"}
								onClick={() => setToursView(!toursView)}
							>
								<IonLabel>{props.i18n.t("tours")}:</IonLabel>
								<IonIcon
									slot="end"
									icon={toursView ? removeCircle : addCircle}
									// color="primary" BOTTONE BIANCO CON TITOLO COLORATO
								/>
							</IonItem>

							{toursView && (
								<IonCardContent className="ion-no-padding">
									<TourList />
								</IonCardContent>
							)}
						</IonCard>
					</IonCol>
				</IonRow>
			)}

			{/* SCHEDA OCCUPAZIONE */}
			{
				// <IonRow>
				//   <IonCol>
				//     <IonCard>
				//       <IonItem
				//         color="primary" //TITOLO MENU COLORATO
				//         lines={graphView ? "inset" : "none"}
				//         onClick={() => setGraphView(!graphView)}
				//       >
				//         <IonLabel>{t("chart")}:</IonLabel>
				//         <IonIcon
				//           slot="end"
				//           icon={graphView ? removeCircle : addCircle}
				//           // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
				//         />
				//       </IonItem>
				//       {graphView && (
				//         <IonCardContent>
				//           {/*<IonLabel>{(new Date()).toDateString()}</IonLabel>*/}
				//           <Swiper
				//             pagination={{
				//               clickable: true,
				//             }}
				//             onSwiper={(swiper) => setSwiperInstance(swiper)}
				//             onAfterInit={() =>
				//               setTimeout(
				//                 () => window.dispatchEvent(new Event("resize")),
				//                 10
				//               )
				//             }
				//           >
				//             <SwiperSlide>
				//               <BarChart data={data1} />
				//             </SwiperSlide>
				//             <SwiperSlide>
				//               <BarChart data={data2} />
				//             </SwiperSlide>
				//             <SwiperSlide>
				//               <BarChart data={data3} />
				//             </SwiperSlide>
				//           </Swiper>
				//           <IonGrid fixed={true} class="ion-buttons-grid">
				//             <IonRow>
				//               <IonCol>
				//                 <IonButton
				//                   onClick={() => swiperInstance?.slidePrev()}
				//                 >
				//                   {t("prev")}
				//                   {/*<IonIcon icon={arrowBack}/>*/}
				//                 </IonButton>
				//               </IonCol>
				//               <IonCol className="ion-text-right">
				//                 <IonButton
				//                   onClick={() => swiperInstance?.slideNext()}
				//                 >
				//                   {t("next")}
				//                 </IonButton>
				//               </IonCol>
				//             </IonRow>
				//           </IonGrid>
				//         </IonCardContent>
				//       )}
				//     </IonCard>
				//   </IonCol>
				// </IonRow>
			}

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
					<IonText color="dark" class="format-text">
						{removeDoubleSlashN(getDescriptionFallback())}
					</IonText>
					</IonCardContent>
				</IonCard>
				</IonCol>
			</IonRow>

			{/* Visualizzazione del contenuto multimediale (video) */}
			{urlMedia && (
				<IonRow className="player-wrapper">
				<IonCol>
					<ReactPlayer
					className="react-player"
					url="https://sitavr.scienze.univr.it/veronapp/ArenaEsterno.mp4" /*DA INSERIRE urlMedia per utilizzare il PATH CORRETTO*/
					width="100%"
					height="100%"
					controls
					/>
				</IonCol>
				</IonRow>
			)}
			</IonGrid>
		</IonContent>
		</IonModal>
	);
}

export default POIModal;
