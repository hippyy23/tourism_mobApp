import {
	IonButton,
	IonContent,
	IonHeader,
	IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    useIonToast,
    useIonViewDidEnter,
} from "@ionic/react";
import { useState } from "react";
import { ConnectionStatus, Network } from "@capacitor/network";
import { Preferences } from "@capacitor/preferences";
import { Device } from "@capacitor/device";
import {
	fetchTourList,
	fetchPOIList,
	fetchEventList,
} from "../components/Functions";
import { LANGUAGES } from "../configVar";
import { POI, Event, Tour, TourDetails } from "../types/app_types";
import POIListModal from "../modals/POIListModal";
import TourListModal from "../modals/TourListModal";
import EventListModal from "../modals/EventListModal";
import "./Home.css";
import '../assets/i18n'
import { useTranslation } from "react-i18next";

var POIListData: POI[];
var EventListData: Event[];
var tourListData: Tour[];
var deviceLanguage: string;

// var isOpen = true;
const Home: React.FC = () => {
    const [tourDetails, setTourDetails] = useState<TourDetails | undefined>(undefined); // Indica se la mappa del tour è aperta
    const [dataObtained, setDataObtained] = useState<boolean>(false); // Indica se possiedo la lista dei punti di interesse con le loro coordinate (caricati dalla memoria oppure scaricati dal webserver)
	const [dataEventObtained, setEventDataObtained] = useState<boolean>(false); // Indica se possiedo la lista degli eventi con le loro coordinate (caricati dalla memoria oppure scaricati dal webserver)
    const [downloadedData, setDownloadedData] = useState<boolean>(false); // Indica se la lista dei punti di interesse sono stati scaricati dal webserver
	const [downloadedEventData, setDownloadedEventData] = useState<boolean>(false); // Indica se la lista degli eventi sono stati scaricati dal webserver
    const [showPOIListModal, setShowPOIListModal] = useState<boolean>(false); // Mostra la modale con la lista degli eventi
    const [showTourListModal, setShowTourListModal] = useState<boolean>(false); // Mostra la modale con la lista dei tour
	const [showEventListModal, setShowEventListModal] = useState<boolean>(false); // Mostra la modale con la lista degli eventi
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
		// Stato della connessione del dispositivo
		connected: true,
		connectionType: "none",
	});
    const [presentToast] = useIonToast();
	const { i18n } = useTranslation();


    /**
	 * Funzione invocata quando viene creato il componente
	 */
	useIonViewDidEnter(() => {
		// Recupera la lingua scelta precedentemente e salvata, oppure quella del dispositivo, oppure quella di default
		Preferences.get({ key: "languageCode" }).then((result) => {
		if (result.value !== null) {
			i18n.changeLanguage(result.value);
		} else {
			Device.getLanguageCode().then((lang) => {
				deviceLanguage = lang.value;
				if (LANGUAGES.includes(deviceLanguage)) {
					i18n.changeLanguage(deviceLanguage);
				}
			});
		}
		});

		/**
		 * Controlla se l'utente è online o offline
		 * Nel primo caso, viene caricata la lista dei punti di interesse e degli eventi e salvata in locale
		 * Nel secondo caso, viene caricata la lista dei punti di interesse e degli eventi salvata in locale se possibile
		 */
		Network.getStatus().then((netStatus) => {
			setConnectionStatus(netStatus);
			Preferences.get({ key: "baseData" }).then((result) => {
				if (result.value !== null) {
					POIListData = JSON.parse(result.value);
					setDataObtained(true);
				}
			});

			Preferences.get({ key: "baseEventData" }).then((result) => {
				if (result.value !== null) {
					EventListData = JSON.parse(result.value);
					setEventDataObtained(true);
				}
			});

			if (netStatus.connected) {
				getList();
				getEventList();
			} else {
				presentToast({
					message: i18n.t("user_offline"),
					duration: 5000,
				});
			}
		});

	});

    /**
	 * Scarica la lista dei POI dal server e li salva in locale
	 */
	function getList() {
		if (downloadedData) return;
		fetchPOIList((poiList: POI[]) => {
			POIListData = poiList;
			Preferences.set({
				key: "baseData",
				value: JSON.stringify(POIListData),
			});
			setDownloadedData(true);
			setDataObtained(false);
			setDataObtained(true);
		});
	}

    /**
	 * Scarica la lista degli Event dal server e li salva in locale
	 */
	function getEventList() {
		if (downloadedEventData) return;
		fetchEventList((eventList: Event[]) => {
			EventListData = eventList;
			Preferences.set({
				key: "baseEventData",
				value: JSON.stringify(EventListData),
			});
			setDownloadedEventData(true);
			setEventDataObtained(false);
			setEventDataObtained(true);
		});
	}

    /** Richiedi al server la lista dei tour */
	function getTourList() {
		if (connectionStatus.connected) {
            if (tourListData === undefined) {
                fetchTourList((tourList: Tour[]) => {
                    tourListData = tourList;
                    setShowTourListModal(true);
                });
            } else {
                setShowTourListModal(true);
            }
		} else {
            presentToast({
                message: i18n.t("user_offline"),
                duration: 5000,
            });
		}
	}
	
	return (
		<IonPage className="background">
		<IonHeader>
            <IonToolbar color="primary">
                <IonTitle>BALDOUTDOOR</IonTitle>   
			</IonToolbar>
		</IonHeader>
		<IonContent class="home">
            <IonGrid class="home">
                <IonRow class="home">
                    <IonCol class="home">
                        <IonButton className="home" expand="block" href="/map">MAPPA</IonButton>
                    <br />
                        <IonButton 
                            className="home"
                            expand="block"
                            onClick={() => { setShowPOIListModal(true); }}
                            >PUNTI DI INTERESSE</IonButton>
                    <br />
                        <IonButton 
                            className="home" 
                            expand="block"
                            onClick={() => { getTourList(); }}
                            >ITINERARI</IonButton>
                    <br />
                        <IonButton 
                            className="home" 
                            expand="block"
                            onClick={() => { setShowEventListModal(true); }}
                            >EVENTI</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
		</IonContent>
            {showPOIListModal && (
                <POIListModal
                    openCondition={showPOIListModal}
                    onDismissConditions={setShowPOIListModal}
                    data={POIListData}
                    i18n={i18n}
                    setTourDetails={ setTourDetails }
                    closeAllModals={() => {
                        setShowPOIListModal(false);
                    }}
                />
            )}

            {showTourListModal && (
                <TourListModal
                    openCondition={showTourListModal}
                    onDismissConditions={setShowTourListModal}
                    data={tourListData}
                    i18n={i18n}
                    setTourDetails={setTourDetails}
                    closeAllModals={() => {
                        setShowTourListModal(false);
                    }}
                />
            )}

            {showEventListModal && (
                <EventListModal
                    openCondition={showEventListModal}
                    onDismissConditions={setShowEventListModal}
                    data={EventListData}
                    i18n={i18n}
                    closeAllModals={() => {
                        setShowEventListModal(false);
                    }}
                />
            )}
		</IonPage>
	);
};

export default Home;
