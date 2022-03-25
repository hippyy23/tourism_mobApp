import { IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonNote, IonRow, IonText, IonThumbnail, IonToolbar, useIonPopover } from "@ionic/react";
import React, { useState } from "react";
import { i18n } from "i18next";
import { useTranslation } from "react-i18next";
import { present } from "@ionic/core/dist/types/utils/overlays";
import { chevronBack, arrowBack, ellipsisHorizontal, ellipsisVertical, volumeHigh, volumeMute, addCircle, removeCircle } from "ionicons/icons";
import logoVerona from "../assets/images/logo_stemma.png";
import PopoverList from "./PopoverList";
import { TextToSpeech } from "@capacitor-community/text-to-speech";


function TourModal(props: { i18n: i18n; openCondition: any; onDismissConditions: React.Dispatch<React.SetStateAction<boolean>>; data: any; code: any; }) {
    const { t, i18n } = useTranslation();
    const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
    const [poiView, setPoiView] = useState<boolean>(false); // Mostra i poi dell'itinerario o no
    const [present, dismiss] = useIonPopover(PopoverList, {
        onHide: () => dismiss(),
    });
    const n_poi = 0; //TODO

    function speak() {
        setTextPlaying(true);
        let lngPlay = getDescription()
            ? i18n.language + "-" + i18n.language.toUpperCase()
            : "en-US";
        if (lngPlay === "en-EN") lngPlay = "en-US";
        TextToSpeech.speak({
            text: removeDoubleSlashN(getDescriptionFallback()),
            lang: lngPlay,
        }).then(() => setTextPlaying(false));
    }

    function stop() {
        TextToSpeech.stop();
        setTextPlaying(false);
    }

    function getDescription() {
        return props.data["descr_" + props.code];
    }

    function getDescriptionFallback(): string {
        let description = getDescription();
        return description ? description : props.data["descr_en"];
    }

    const removeDoubleSlashN = (str: string) => {
        if (str) return str.replace(/\\n/g, "");
        return "No description for this POI.";
    };

    /** Creazione della lista di itinerari cliccabili TODO*/
    function PoiList() {
        const tours_id = props.data.tours_id.split(",");
        const tours_name = props.data["tours_name_" + props.code] ? props.data["tours_name_" + props.code].split(',') : props.data.tours_name_en.split(',');
        const listItems = tours_id.map((id: number, index: number) => (
            <IonItem button={true} key={id} lines={index < n_poi - 1 ? "inset" : "none"} onClick={() => console.log(id)}>
                <IonLabel>{tours_name[index]}</IonLabel>
            </IonItem>
        ));
        return <IonList className="ion-no-padding">{listItems}</IonList>;
    }

    return (
        <IonModal
            isOpen={props.openCondition}
            onDidDismiss={() => props.onDismissConditions(false)}>
            {/* HEADER */}
            <IonHeader>
                <IonToolbar color="primary">
                    {/* FRECCIA INDIETRO */}
                    <IonButtons slot="start" className="ion-margin">
                        <IonIcon
                            slot="icon-only"
                            ios={chevronBack}
                            md={arrowBack}
                            onClick={() => props.onDismissConditions(false)}
                        />
                    </IonButtons>

                    {/* LOGO COMUNE */}
                    <IonThumbnail slot="start">
                        <img src={logoVerona} alt="Logo Comune di Verona" />
                    </IonThumbnail>

                    {/* MENU OPZIONI POPOVER */}
                    <IonButtons slot="end" className="ion-margin-end">
                        <IonIcon
                            slot="icon-only"
                            ios={ellipsisHorizontal}
                            md={ellipsisVertical}
                            onClick={(e: any) =>
                                present({
                                    event: e.nativeEvent,
                                })
                            }
                        />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid fixed={true}>
                    {/* IMMAGINE */}
                    <IonRow className="ion-align-items-center">
                        <IonCol>
                            <IonImg src={props.data.image_url} />
                        </IonCol>
                    </IonRow>

                    {/* SCHEDA PUNTI DI INTERESSE   TODO */}
                    {n_poi > 0 && (
                        <IonRow>
                            <IonCol>
                                <IonCard>
                                    <IonItem
                                        color="primary" //TITOLO MENU COLORATO
                                        lines={poiView ? "inset" : "none"}
                                        onClick={() => setPoiView(!poiView)}
                                    >
                                        <IonLabel>{t("tours")}:</IonLabel>
                                        <IonIcon
                                            slot="end"
                                            icon={poiView ? removeCircle : addCircle}
                                        // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
                                        />
                                    </IonItem>

                                    {poiView && (
                                        <IonCardContent className="ion-no-padding">
                                            <PoiList/>
                                        </IonCardContent>
                                    )}
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    )}

                    {/* SCHEDA DESCRIZIONE */}
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <IonItem
                                    color="primary" //TITOLO MENU COLORATO
                                >
                                    <IonLabel>{t("description")}:</IonLabel>
                                    <IonButton
                                        slot="end"
                                        fill="clear"
                                        onClick={textPlaying ? stop : speak}
                                    >
                                        <IonIcon
                                            slot="icon-only"
                                            color="light"
                                            icon={textPlaying ? volumeMute : volumeHigh}
                                        />
                                    </IonButton>
                                </IonItem>

                                <IonCardContent>
                                    {!getDescription() && (
                                        <IonNote color="danger">
                                            {t("not_supported")}
                                            <br />
                                            <br />
                                        </IonNote>
                                    )}
                                    <IonText color="dark" class="format-text">
                                        {removeDoubleSlashN(getDescriptionFallback())}
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonModal>

    );
}

export default TourModal;