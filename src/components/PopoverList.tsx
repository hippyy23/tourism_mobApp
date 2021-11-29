import { IonAlert, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { informationCircle, language } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageAlert from "./LanguageAlert";

const PopoverList: React.FC<{
  onHide: () => void;
}> = ({ onHide }) => {
  const [chooseLanguage, setChooseLanguage] = useState<boolean>(false); // Indica se mostrare l'alert per la selezione della lingua
  const [showInfo, setShowInfo] = useState<boolean>(false); // Indica se mostrare l'alert delle informazioni
  const { t, i18n } = useTranslation();

  return (
    <>
      <IonList>
        <IonItem
          detail={false}
          button
          onClick={() => {
            setChooseLanguage(true);
            onHide();
          }}
        >
          <IonIcon icon={language} />
          <IonLabel className="ion-margin-start">
            {t("change_language")}
          </IonLabel>
        </IonItem>
        <IonItem
          lines="none"
          detail={false}
          onClick={() => {
            setShowInfo(true);
            onHide();
          }}
          button
        >
          <IonIcon icon={informationCircle} />
          <IonLabel className="ion-padding-start">{t("info")}</IonLabel>
        </IonItem>
      </IonList>

      {chooseLanguage && (
        <LanguageAlert i18n={i18n} onDismiss={() => setChooseLanguage(false)} />
      )}

      <IonAlert
        isOpen={showInfo}
        header={"Informazioni e contatti"}
        onDidDismiss={() => setShowInfo(false)}
        buttons={[{ text: "Close", role: "cancel", cssClass: "secondary" }]}
        message={
          "Prototipo realizzato dal comune di Verona con la collaborazione dell'Università degli studi di Verona - Dipartimento di Informatica"
        }
      />
    </>
  );
};

export default PopoverList;
