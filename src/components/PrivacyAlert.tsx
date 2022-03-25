import {
    IonAlert,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { i18n } from "i18next";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function PrivacyAlert(props: { i18n: i18n; onDismiss: any; backdropDismiss: boolean; }) {
    //const [showPrivacyAlert, setShowPrivacyAlert] = useState<boolean>(false); // Indica se mostrare o meno l'alert della privacy
    //const [showPrivacyInfo, setShowPrivacyInfo] = useState<boolean>(false); // Indica se è da mostrare l'alert che visualizza le informazioni che tracciamo dell'utente
    const { t, i18n } = useTranslation();

    return (
        <>
            {/* Alert che richiede all'utente se acconsente a farsi tracciare anonimamente */}
            <IonAlert
                isOpen={true}
                header={"Privacy alert"}
                message={"TurismoVerona vorrebbe tracciare in maniera anonima i dati della vostra esprerienza." +
                 '<br/>' + "I dati raccolti sono: identificatore anonimo, posizione, lingua e sistema operativo.<br/>Vuoi partecipare?"}
                backdropDismiss={props.backdropDismiss}
                onDidDismiss={props.onDismiss}
                buttons={[
                    {
                        text: t("accept"),
                        handler: () => { console.log("Si"); },
                    },
                    {
                        text: t("decline"),
                        handler: () => { console.log("No"); },
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