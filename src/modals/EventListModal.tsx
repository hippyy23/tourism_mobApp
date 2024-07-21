import {
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
	IonRow,
	IonTitle,
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
import toolbarIcon from "../assets/images/logo.png";
import EventModal from "./EventModal";
import { i18n } from "i18next";
import { LanguageCode, Event, EventDetails } from "../types/app_types";
import PopoverList from "../components/PopoverList";
import { fetchEventDetails } from "../components/Functions";

var event_details: EventDetails;

function EventListModal(props: {
	openCondition: boolean;
	onDismissConditions: (arg0: boolean) => void;
	data: Event[];
	i18n: i18n;
	closeAllModals: () => void;
}) {
	const [showEventModal, setShowEventModal] = useState<boolean>(false); // Mostra o nascondi il modale dell'evento
	const [present, dismiss] = useIonPopover(PopoverList, {
		onHide: () => dismiss(),
	});
	const lng = props.i18n.language as LanguageCode;

	function getEventNameFallback(event: Event): string {
		const name = event.properties[`name_${lng}`];
		return name ? name : event.properties.name_en;
	}

	/** Richiedi al server i dettagli di un evento */
	function getEventDetail(id_event: string) {
		fetchEventDetails(id_event, (event: EventDetails) => {
			event_details = event;
			setShowEventModal(true);
		});
	}

	/** Creazione delle sezioni delle categorie dei poi*/
	function EventList(pr: { category: string }) {
		const filteredEvent = props.data.filter(
			(event: Event) => event.properties.category_it === pr.category
		);
		const n_events = filteredEvent.length;
		const listItems = filteredEvent.map((event: Event, index: number) => (
		<IonItem
			button={ true }
			key={ event.properties.id_event }
			lines={ index < n_events - 1 ? "inset" : "none" }
			onClick={() => {
				getEventDetail(event.properties.id_event);
			}}
		>
			<IonLabel>{ getEventNameFallback(event) }</IonLabel>
		</IonItem>
		));
		return <IonList className="ion-no-padding">{ listItems }</IonList>;
	}

	return (
		<IonModal
			isOpen={ props.openCondition }
			onDidDismiss={ () => props.onDismissConditions(false) }
		>
		{showEventModal && (
			<EventModal
				openCondition={ showEventModal }
				onDismissConditions={ setShowEventModal }
				data={ event_details }
				i18n={ props.i18n }
				closeAllModals={() => {
					props.closeAllModals();
					setShowEventModal(false);
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
					ios={ chevronBack }
					md={ arrowBack }
					onClick={ () => props.onDismissConditions(false) }
				/>
			</IonButtons>

			{/* LOGO COMUNE */}
			<IonItem slot="start" lines="none" color="primary">
				<IonImg src={ toolbarIcon } style={{ height: "80%" }} />
			</IonItem>

			{/* TITOLO */}
			{/* <IonLabel slot="start" className="ion-padding-start">
				{t("tours")}
			</IonLabel> */}

			{/* MENU OPZIONI POPOVER */}
			<IonButtons slot="end" className="ion-margin-end">
				<IonIcon
					slot="icon-only"
					ios={ ellipsisHorizontal }
					md={ ellipsisVertical }
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
				{/* TITOLO ITINERARI */}
				<IonRow>
					<IonCol>
					<IonTitle>
						<h1>{props.i18n.t("events")}</h1>
					</IonTitle>
					</IonCol>
				</IonRow>

				{/* SCHEDA SPETTACOLI */}
				<IonRow>
					<IonCol>
					<IonCard>
						<IonItem
						color="primary" //TITOLO MENU COLORATO
						>
						<IonLabel>{props.i18n.t("cat_event_show")}</IonLabel>
						</IonItem>

						<IonCardContent className="ion-no-padding">
							<EventList category="Spettacolo" />
						</IonCardContent>
					</IonCard>
					</IonCol>
				</IonRow>

				{/* SCHEDA INCONTRI */}
				<IonRow>
					<IonCol>
					<IonCard>
						<IonItem
						color="primary" //TITOLO MENU COLORATO
						>
						<IonLabel>{props.i18n.t("cat_event_meeting")}</IonLabel>
						</IonItem>

						<IonCardContent className="ion-no-padding">
							<EventList category="Incontro" />
						</IonCardContent>
					</IonCard>
					</IonCol>
				</IonRow>

				{/* SCHEDA GITE */}
				<IonRow>
					<IonCol>
					<IonCard>
						<IonItem
						color="primary" //TITOLO MENU COLORATO
						>
						<IonLabel>{props.i18n.t("cat_event_trip")}</IonLabel>
						</IonItem>

						<IonCardContent className="ion-no-padding">
							<EventList category="Gita" />
						</IonCardContent>
					</IonCard>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonContent>
		</IonModal>
	);
}

export default EventListModal;
