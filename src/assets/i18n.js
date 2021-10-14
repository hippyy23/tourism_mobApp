import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    it: {
      translation: {
        cat_churches: "Chiese",
        cat_monuments: "Monumenti",
        cat_museums: "Musei e Centri Espositivi",
        user_position: "Ti trovi qui",
        close: "Chiudi",
      },
    },
    en: {
      translation: {
        cat_churches: "Churches",
        cat_monuments: "Monuments",
        cat_museums: "Museums and Exhibition Centers",
        user_position: "You are here",
        close: "Close",
      },
    },
    de: {
      translation: {
        cat_churches: "Kirchen",
        cat_monuments: "Denkmäler",
        cat_museums: "Museen und Ausstellungszentren",
        user_position: "Du bist hier",
        close: "Close",
      },
    },
    fr: {
      translation: {
        cat_churches: "Église",
        cat_monuments: "Monuments",
        cat_museums: "Musées et Centres d'Exposition",
        user_position: "Tu es ici",
        close: "Close",
      },
    },
    es: {
      translation: {
        cat_churches: "Iglesias",
        cat_monuments: "Monumentos",
        cat_museums: "Museos y Centros de Exposiciones",
        user_position: "Tú estás aquí",
        close: "Close",
      },
    },
  },
});
