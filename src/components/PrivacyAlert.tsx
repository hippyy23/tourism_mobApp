import { IonAlert } from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { i18n } from "i18next";

function PrivacyAlert(props: {
  i18n: i18n;
  onDismiss: () => void;
  backdropDismiss: boolean;
}) {
  //const [showPrivacyAlert, setShowPrivacyAlert] = useState<boolean>(false); // Indica se mostrare o meno l'alert della privacy
  //const [showPrivacyInfo, setShowPrivacyInfo] = useState<boolean>(false); // Indica se è da mostrare l'alert che visualizza le informazioni che tracciamo dell'utente

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
              Storage.set({
                key: "tracking",
                value: "y",
              });
            },
          },
          {
            text: props.i18n.t("decline"),
            handler: () => {
              Storage.set({
                key: "tracking",
                value: "n",
              });
            },
          },
          /*
                    {
                    text: "Info",
                    handler: () => { setShowPrivacyInfo(true); },
                    }
                    */
        ]}
      />
      {/*
            /* Alert che mostra i dati che vengono tracciati, raggiungibile attraverso il pulsante info 
            <IonAlert
                isOpen={showPrivacyInfo}
                header={"Informazioni tracciate"}
                message={"Informazioni tracciate in forma anonima a fini statistici: "}
                onDidDismiss={() => { setShowPrivacyInfo(false); }}
                buttons={[{ text: "Close", role: "cancel", cssClass: "secondary" }]}
            />
            */}
    </>
  );
}

export default PrivacyAlert;
