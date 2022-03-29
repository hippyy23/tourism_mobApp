import { IonAlert, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { informationCircle, language, lockClosed } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageAlert from "./LanguageAlert";
import PrivacyAlert from "./PrivacyAlert";

const PopoverList: React.FC<{
  onHide: () => void;
}> = ({ onHide }) => {
  const [chooseLanguage, setChooseLanguage] = useState<boolean>(false); // Indica se mostrare l'alert per la selezione della lingua
  const [showInfo, setShowInfo] = useState<boolean>(false); // Indica se mostrare l'alert delle informazioni
  const [showPrivacyAlert, setShowPrivacyAlert] = useState<boolean>(false); // Indica se mostrare o meno l'alert della privacy
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
          detail={false}
          onClick={() => {
            setShowPrivacyAlert(true);
            onHide();
          }}
        >
          <IonIcon icon={lockClosed} />
          <IonLabel className="ion-padding-start">{t("tracking")}</IonLabel>
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

      {showPrivacyAlert && (
        <PrivacyAlert i18n={i18n} onDismiss={() => setShowPrivacyAlert(false)} backdropDismiss={true} />
      )}

      {chooseLanguage && (
        <LanguageAlert i18n={i18n} onDismiss={() => setChooseLanguage(false)} />
      )}

      <IonAlert
        isOpen={showInfo}
        header={i18n.t("info_title")}
        onDidDismiss={() => setShowInfo(false)}
        buttons={[{ text: i18n.t("close"), role: "cancel", cssClass: "secondary" }]}
        message={i18n.t("info_message")}
      />
    </>
  );
};

export default PopoverList;
