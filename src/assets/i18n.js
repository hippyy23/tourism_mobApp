import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGES } from "../configVar";

i18n.use(initReactI18next).init({
	//debug: true,
	lng: "en",
	supportedLngs: LANGUAGES.concat("dev"),
	resources: {
		it: {
		translation: {
			lang: "Italiano",
			change_language: "Cambia lingua",
			info: "Informazioni",
			tracking: "Tracciamento",
			agree: "Accetta",
			decline: "Rifiuta",
			cat_natural_valence: "Elemento a valenza naturale",
			cat_his_cult_valence: "Elemento a valenza storico/culturale",
			cat_activity: "Attività",
			cat_event: "Evento",
			cat_event_show: "Spettacolo",
			cat_event_meeting: "Incontro",
			cat_event_trip: "Gita",
			user_position: "Ti trovi qui",
			close: "Chiudi",
			description: "Descrizione",
			open_time: "Orario",
			tickets: "Biglietti",
			chart: "Grafico occupazione",
			historical: "Storico",
			real: "Attuale",
			expected: "Previsto",
			day_week_mon: "Lunedì",
			day_week_tue: "Martedì",
			day_week_wed: "Mercoledì",
			day_week_thu: "Giovedì",
			day_week_fri: "Venerdì",
			day_week_sat: "Sabato",
			day_week_sun: "Domenica",
			xlabel: "Orari",
			ylabel: "Affollamento",
			prev: "Precedente",
			next: "Successivo",
			not_supported: "Questo contenuto non è disponibile nella tua lingua.",
			user_offline: "Sei offline",
			user_not_in_verona: "Non sei a Verona",
			details_button: "Dettagli",
			tracking_title: "Privacy alert",
			tracking_message:
			"BaldOutdoor vorrebbe tracciare in maniera anonima i dati della vostra esprerienza.<br/>" +
			"I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?",
			info_title: "Informazioni e contatti",
			info_message:
			"Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica",
			pois: "Punti di interesse",
			tours: "Itinerari",
			events: "Eventi",
			a_tempo: "A tempo",
			storico: "Storico",
			show_tour: "Mostra itinerario",
			tour_alert_title: "Attenzione",
			tour_alert_message:
			"Sei sicuro di voler chiudere la mappa dell'itinerario?",
		},
		},
		en: {
		translation: {
			lang: "English",
			change_language: "Change language",
			info: "Information",
			tracking: "Tracking",
			agree: "Accept",
			decline: "Decline",
			cat_natural_valence: "Natürliches Valenzelement",
			cat_his_cult_valence: "Element von historischer/kultureller Bedeutung",
			cat_activity: "Activity",
			cat_event: "Event",
			cat_event_show: "Show",
			cat_event_meeting: "Meeting",
			cat_event_trip: "Trip",
			user_position: "You are here",
			close: "Close",
			description: "Description",
			open_time: "Open Time",
			tickets: "Tickets",
			chart: "Grafico occupazione", // it
			historical: "Historical",
			real: "Real",
			expected: "Expected",
			day_week_mon: "Monday",
			day_week_tue: "Tuesday",
			day_week_wed: "Wednesay",
			day_week_thu: "Thursday",
			day_week_fri: "Friday",
			day_week_sat: "Saturday",
			day_week_sun: "Sunday",
			xlabel: "Time",
			ylabel: "Crowding",
			prev: "Previous",
			next: "Next",
			not_supported: "This content is not available in your language.",
			user_offline: "You are offline",
			user_not_in_verona: "You are not in Verona",
			details_button: "Details",
			tracking_title: "Privacy alert", // it
			tracking_message:
			"BaldOutdoor vorrebbe tracciare in maniera anonima i dati della vostra esprerienza.<br/>" +
			"I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?", // it
			info_title: "Informazioni e contatti", // it
			info_message:
			"Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica", // it
			pois: "Points of interest",
			tours: "Tours",
			events: "Events",
			a_tempo: "A tempo", // it
			storico: "Storico", // it
			show_tour: "Mostra itinerario", // it
			tour_alert_title: "Attenzione", // it
			tour_alert_message:
			"Sei sicuro di voler chiudere la mappa dell'itinerario?", // it
		},
		},
		de: {
		translation: {
			lang: "Deutsch",
			change_language: "Change language", // en
			info: "Information", // en
			tracking: "Tracciamento", // en
			agree: "Accept", // en
			decline: "Decline", // en
			cat_natural_valence: "Natural valence element",
			cat_his_cult_valence: "Element of historical/cultural significance",
			cat_activity: "Aktivitäten",
			cat_event: "Event",
			cat_event_show: "Anzeigen",
			cat_event_meeting: "Treffen",
			cat_event_trip: "Reise",
			user_position: "Du bist hier",
			close: "Close", // en
			description: "Description", // en
			open_time: "Open Time", // en
			tickets: "Tickets", // en
			chart: "Grafico occupazione", // it
			historical: "Historical", // en
			real: "Real", // en
			expected: "Expected", // en
			day_week_mon: "Monday", // en
			day_week_tue: "Tuesday", // en
			day_week_wed: "Wednesay", // en
			day_week_thu: "Thursday", // en
			day_week_fri: "Friday", // en
			day_week_sat: "Saturday", // en
			day_week_sun: "Sunday", // en
			xlabel: "Time", // en
			ylabel: "Crowding", // en
			prev: "Previous", // en
			next: "Next", // en
			not_supported: "This content is not available in your language.", // en
			user_offline: "You are offline", // en
			user_not_in_verona: "You are not in Verona", // en
			details_button: "details", // en
			tracking_title: "Privacy alert", // it
			tracking_message:
			"BaldOutdoor vorrebbe tracciare in maniera anonima i dati della vostra esprerienza.<br/>" +
			"I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?", // it
			info_title: "Informazioni e contatti", // it
			info_message:
			"Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica", // it
			pois: "Points of interest",
			tours: "Tours", // en
			events: "Events",
			a_tempo: "A tempo", // it
			storico: "Storico", // it
			show_tour: "Mostra itinerario", // it
			tour_alert_title: "Attenzione", // it
			tour_alert_message:
			"Sei sicuro di voler chiudere la mappa dell'itinerario?", // it
		},
		},
		fr: {
		translation: {
			lang: "Français",
			change_language: "Change language", // en
			info: "Information", // en
			tracking: "Tracciamento", //en
			agree: "Accept", // en
			decline: "Decline", // en
			cat_natural_valence: "Élément de valeur naturelle",
			cat_his_cult_valence: "Élément ayant une valeur historique/culturelle",
			cat_activity: "Activité",
			cat_event: "Event",
			cat_event_show: "Divertissement",
			cat_event_meeting: "Meeting",
			cat_event_trip: "Sortie",
			user_position: "Tu es ici",
			close: "Close", // en
			description: "Description", // en
			open_time: "Open Time", // en
			tickets: "Tickets", // en
			chart: "Grafico occupazione", // it
			historical: "Historical", // en
			real: "Real", // en
			expected: "Expected", // en
			day_week_mon: "Monday", // en
			day_week_tue: "Tuesday", // en
			day_week_wed: "Wednesay", // en
			day_week_thu: "Thursday", // en
			day_week_fri: "Friday", // en
			day_week_sat: "Saturday", // en
			day_week_sun: "Sunday", // en
			xlabel: "Time", // en
			ylabel: "Crowding", // en
			prev: "Previous", // en
			next: "Next", // en
			not_supported: "This content is not available in your language.", // en
			user_offline: "You are offline", // en
			user_not_in_verona: "You are not in Verona", // en
			details_button: "details", // en
			tracking_title: "Privacy alert", // it
			tracking_message:
			"BaldOutdoor vorrebbe tracciare in maniera anonima i dati della vostra esprerienza.<br/>" +
			"I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?", // it
			info_title: "Informazioni e contatti", // it
			info_message:
			"Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica", // it
			pois: "Points of interest",
			tours: "Tours", // en
			events: "Events",
			a_tempo: "A tempo", // it
			storico: "Storico", // it
			show_tour: "Mostra itinerario", // it
			tour_alert_title: "Attenzione", // it
			tour_alert_message:
			"Sei sicuro di voler chiudere la mappa dell'itinerario?", // it
		},
		},
		es: {
		translation: {
			lang: "Español",
			change_language: "Change language", // en
			info: "Information", // en
			tracking: "Tracciamento", //en
			agree: "Accept", // en
			decline: "Decline", // en
			cat_natural_valence: "Elemento con valor natural",
			cat_his_cult_valence: "Elemento con valor histórico/cultural",
			cat_activity: "Actividad",
			cat_event: "Event",
			cat_event_show: "Entretenimiento",
			cat_event_meeting: "Encuentro",
			cat_event_trip: "Excursión",
			user_position: "Tú estás aquí",
			close: "Close", // en
			description: "Description", // en
			open_time: "Open Time", // en
			tickets: "Tickets", // en
			chart: "Grafico occupazione", // it
			historical: "Historical", // en
			real: "Real", // en
			expected: "Expected", // en
			day_week_mon: "Monday", // en
			day_week_tue: "Tuesday", // en
			day_week_wed: "Wednesay", // en
			day_week_thu: "Thursday", // en
			day_week_fri: "Friday", // en
			day_week_sat: "Saturday", // en
			day_week_sun: "Sunday", // en
			xlabel: "Time", // en
			ylabel: "Crowding", // en
			prev: "Previous", // en
			next: "Next", // en
			not_supported: "This content is not available in your language.", // en
			user_offline: "You are offline", // en
			user_not_in_verona: "You are not in Verona", // en
			details_button: "details", // en
			tracking_title: "Privacy alert", // it
			tracking_message:
			"BaldOutdoor vorrebbe tracciare in maniera anonima i dati della vostra esprerienza.<br/>" +
			"I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?", // it
			info_title: "Informazioni e contatti", // it
			info_message:
			"Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica", // it
			pois: "Points of interest",
			tours: "Tours", // en
			events: "Events",
			a_tempo: "A tempo", // it
			storico: "Storico", // it
			show_tour: "Mostra itinerario", // it
			tour_alert_title: "Attenzione", // it
			tour_alert_message:
			"Sei sicuro di voler chiudere la mappa dell'itinerario?", // it
		},
		},
	},
});

export default i18n;
