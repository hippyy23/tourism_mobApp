import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGES } from "../configVar";

i18n.use(initReactI18next).init({
  debug: true,
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
        decline: "Non accettare",
        cat_churches: "Chiese",
        cat_monuments: "Monumenti",
        cat_museums: "Musei e Centri Espositivi",
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
        cat_churches: "Churches",
        cat_monuments: "Monuments",
        cat_museums: "Museums and Exhibition Centers",
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
        cat_churches: "Kirchen",
        cat_monuments: "Denkmäler",
        cat_museums: "Museen und Ausstellungszentren",
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
        user_offline: "You are offline",  // en
        user_not_in_verona: "You are not in Verona", // en
        details_button: "details", // en
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
        cat_churches: "Église",
        cat_monuments: "Monuments",
        cat_museums: "Musées et Centres d'Exposition",
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
        user_offline: "You are offline",  // en
        user_not_in_verona: "You are not in Verona", // en
        details_button: "details", // en
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
        cat_churches: "Iglesias",
        cat_monuments: "Monumentos",
        cat_museums: "Museos y Centros de Exposiciones",
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
        user_offline: "You are offline",  // en
        user_not_in_verona: "You are not in Verona", // en
        details_button: "details", // en
      },
    },
  },
});

export default i18n;
