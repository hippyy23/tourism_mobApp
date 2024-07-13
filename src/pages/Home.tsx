import {
	IonButton,
	IonContent,
	IonHeader,
	IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol
} from "@ionic/react";
import "./Home.css";
import { useTranslation } from "react-i18next";

// var isOpen = true;
const Home: React.FC = () => {
	const { i18n } = useTranslation();
	
	return (
		<IonPage class="background">
		<IonHeader>
            <IonToolbar color="primary">
                <IonTitle>BALDOUTDOOR</IonTitle>   
			</IonToolbar>
		</IonHeader>
		<IonContent class="home">
            <IonGrid class="home">
                <IonRow class="home">
                    <IonCol class="home">
                        <IonButton class="home" expand="block" href="/map">MAPPA</IonButton>
                    <br />
                        <IonButton class="home" expand="block">PUNTI DI INTERESSE</IonButton>
                    <br />
                        <IonButton class="home" expand="block">ITINERARI</IonButton>
                    <br />
                        <IonButton class="home" expand="block">EVENTI</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
		</IonContent>
		</IonPage>
	);
};

export default Home;
