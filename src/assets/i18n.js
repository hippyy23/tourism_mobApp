import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  debug: true,
  lng: "en",
  fallbackLng: "en",
  resources: {
    it: {
      translation: {
        change_language: "Cambia lingua",
        info: "Informazioni",
        cat_churches: "Chiese",
        cat_monuments: "Monumenti",
        cat_museums: "Musei e Centri Espositivi",
        user_position: "Ti trovi qui",
        close: "Chiudi",
        description: "Descrizione",
        open_time: "Orario",
        tickets: "Biglietti",
        chart: "Grafico occupazione",
        historical : "Storico",
        real : "Attuale",
        expected : "Previsto",
        day_week_mon : "Lunedì",
        day_week_tue : "Martedì",
        day_week_wed : "Mercoledì",
        day_week_thu : "Giovedì",
        day_week_fri : "Venerdì",
        day_week_sat : "Sabato",
        day_week_sun : "Domenica"
      },
    },
    en: {
      translation: {
        change_language: "Change language",
        info: "Information",
        cat_churches: "Churches",
        cat_monuments: "Monuments",
        cat_museums: "Museums and Exhibition Centers",
        user_position: "You are here",
        close: "Close",
        description: "Description",
        open_time: "Open Time",
        tickets: "Tickets",
        chart: "Grafico occupazione", // it
        historical : "Historical",
        real : "Real",
        expected : "Expected",
        day_week_mon : "Monday",
        day_week_tue : "Tuesday",
        day_week_wed : "Wednesay",
        day_week_thu : "Thursday",
        day_week_fri : "Friday",
        day_week_sat : "Saturday",
        day_week_sun : "Sunday"
      },
    },
    de: {
      translation: {
        change_language: "Change language", // en
        info: "Information", // en
        cat_churches: "Kirchen",
        cat_monuments: "Denkmäler",
        cat_museums: "Museen und Ausstellungszentren",
        user_position: "Du bist hier",
        close: "Close", // en
        description: "Description", // en
        open_time: "Open Time", // en
        tickets: "Tickets", // en
        chart: "Grafico occupazione", // it
        historical : "Historical", // en
        real : "Real", // en
        expected : "Expected", // en
        day_week_mon : "Monday", // en
        day_week_tue : "Tuesday", // en
        day_week_wed : "Wednesay", // en
        day_week_thu : "Thursday", // en
        day_week_fri : "Friday", // en
        day_week_sat : "Saturday", // en
        day_week_sun : "Sunday" // en
      }, // en
    },
    fr: {
      translation: {
        change_language: "Change language", // en
        info: "Information", // en
        cat_churches: "Église",
        cat_monuments: "Monuments",
        cat_museums: "Musées et Centres d'Exposition",
        user_position: "Tu es ici",
        close: "Close", // en
        description: "Description", // en
        open_time: "Open Time", // en
        tickets: "Tickets", // en
        chart: "Grafico occupazione", // it
        historical : "Historical", // en
        real : "Real", // en
        expected : "Expected", // en
        day_week_mon : "Monday", // en
        day_week_tue : "Tuesday", // en
        day_week_wed : "Wednesay", // en
        day_week_thu : "Thursday", // en
        day_week_fri : "Friday", // en
        day_week_sat : "Saturday", // en
        day_week_sun : "Sunday" // en
      },
    },
    es: {
      translation: {
        change_language: "Change language", // en
        info: "Information", // en
        cat_churches: "Iglesias",
        cat_monuments: "Monumentos",
        cat_museums: "Museos y Centros de Exposiciones",
        user_position: "Tú estás aquí",
        close: "Close", // en
        description: "Description", // en
        open_time: "Open Time", // en
        tickets: "Tickets", // en
        chart: "Grafico occupazione", // it
        historical : "Historical", // en
        real : "Real", // en
        expected : "Expected", // en
        day_week_mon : "Monday", // en
        day_week_tue : "Tuesday", // en
        day_week_wed : "Wednesay", // en
        day_week_thu : "Thursday", // en
        day_week_fri : "Friday", // en
        day_week_sat : "Saturday", // en
        day_week_sun : "Sunday" // en
      },
    },
  },
});
