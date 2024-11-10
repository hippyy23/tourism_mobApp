import { IonAlert } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { i18n } from "i18next";

function PrivacyAlert(props: {
  i18n: i18n;
  onDismiss: () => void;
  backdropDismiss: boolean;
}) {
  return (
    <>
      {/* Alert che richiede all'utente se acconsente a farsi tracciare anonimamente */}
      <IonAlert
        isOpen={true}
        header={props.i18n.t("tracking_title")}
        message={props.i18n.t("tracking_message")}
        backdropDismiss={props.backdropDismiss}
        onDidDismiss={props.onDismiss}
        buttons={[
          {
            text: props.i18n.t("agree"),
            handler: () => {
              Preferences.set({
                key: "tracking",
                value: "y",
              });
            },
          },
          {
            text: props.i18n.t("decline"),
            handler: () => {
              Preferences.set({
                key: "tracking",
                value: "n",
              });
            },
          },
        ]}
      />
    </>
  );
}

export default PrivacyAlert;
