import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { TFunction } from "i18next";
import { informationCircle, language } from "ionicons/icons";

const PopoverList: React.FC<{
  onHide: () => void;
  t: TFunction;
  setChooseLanguage: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onHide, t, setChooseLanguage, setShowInfo }) => (
  <IonList>
    {/*<IonListHeader>Ionic</IonListHeader>*/}
    <IonItem
      detail={false}
      button
      onClick={() => {
        setChooseLanguage(true);
        onHide();
      }}
    >
      <IonIcon icon={language} />
      <IonLabel className="ion-margin-start">{t("change_language")}</IonLabel>
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
    {/*<IonItem detail={false} button onClick={onHide}>
        Close
  </IonItem>*/}
  </IonList>
);

export default PopoverList;
