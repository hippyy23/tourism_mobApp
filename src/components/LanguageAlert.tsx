import {
  AlertInput,
  IonAlert,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { i18n } from "i18next";
import { LANGUAGES } from "../configVar";
import { sendLanguage } from "./Functions";

function LanguageAlert(props: { i18n: i18n; onDismiss: () => void }) {
  var languageChoice: string;

  var inputs: AlertInput[] = [];

  LANGUAGES.forEach((language: string) => {
    inputs.push({
      name: language,
      type: "radio",
      label: props.i18n.t("lang", {lng: language}),
      checked: props.i18n.language === language,
      handler: () => {
        languageChoice = language;
      },
    });
  });
  //inputs.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <IonAlert
      isOpen={true}
      onDidPresent={() => (languageChoice = props.i18n.language)}
      header={"Choose a language"}
      inputs={inputs}
      buttons={[
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Okay",
          handler: () => {
            if (props.i18n.language !== languageChoice) {
              props.i18n.changeLanguage(languageChoice);
              Storage.set({
                key: "languageCode",
                value: props.i18n.language,
              });
              sendLanguage(props.i18n.language);
            }
          },
        },
      ]}
      onDidDismiss={props.onDismiss}
    />
  );
}

export default LanguageAlert;
