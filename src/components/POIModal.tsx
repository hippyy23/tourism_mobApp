import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonToolbar,
  IonicSwiper,
  IonHeader,
  useIonPopover,
  IonButtons,
  IonThumbnail,
} from "@ionic/react";
import {
  addCircle,
  arrowBack,
  chevronBack,
  ellipsisHorizontal,
  ellipsisVertical,
  removeCircle,
  volumeHigh,
  volumeMute,
} from "ionicons/icons";
import ReactHtmlParser from "react-html-parser";
import { useTranslation } from "react-i18next";
import { getMediaFromWebServer } from "./Functions";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import ReactPlayer from "react-player/file";
import "swiper/swiper-bundle.min.css";
import "@ionic/react/css/ionic-swiper.css";
import PopoverList from "./PopoverList";
import LanguageAlert from "./LanguageAlert";
import logoVerona from "../assets/images/logo_con_unesco_coloreQ.png";

function POIModal(props: {
  openCondition: boolean;
  onPresent: React.Dispatch<React.SetStateAction<boolean>>;
  onDismissConditions: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  code: string;
}) {
  const [openTimeView, setOpenTimeView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli orari del punto di interesse
  const [ticketsView, setTicketsView] = useState<boolean>(false); // Mostra o nascondi il testo relativo al prezzo dei biglietti del punto di interesse
  const [graphView, setGraphView] = useState<boolean>(false); // Mostra o nascondi il grafico della popolazione nel POI
  const [chooseLanguage, setChooseLanguage] = useState<boolean>(false); // Variabile che indica se mostrare l'alert per la selezione della lingua
  const [urlMedia, setUrlMedia] = useState<string>(); //
  const [textPlaying, setTextPlaying] = useState<boolean>(false); //
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore>(); //

  const { t, i18n } = useTranslation();
  SwiperCore.use([IonicSwiper, Navigation, Pagination]);

  // DATI DI PROVA
  const data1 = {
    labels: [
      "6-8",
      "8-10",
      /*t("day_week_mon"),
      t("day_week_tue"),
      t("day_week_tue"),
      t("day_week_thu"),
      t("day_week_fri"),
      t("day_week_sat"),
      t("day_week_sun"),
      */
    ],
    datasets: [
      {
        label: t("historical"),
        data: [12, 19],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: t("real"),
        data: [2, 3],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: t("expected"),
        data: [3, 10],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const data2 = {
    labels: ["10-12", "12-14"],
    datasets: [
      {
        label: t("historical"),
        data: [3, 5],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: t("real"),
        data: [20, 5],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: t("expected"),
        data: [13, 15],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const data3 = {
    labels: ["14-16", "16-18"],
    datasets: [
      {
        label: t("historical"),
        data: [2, 3],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: t("real"),
        data: [1, 4],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: t("expected"),
        data: [12, 13],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  function speak() {
    setTextPlaying(true);
    TextToSpeech.speak({
      text: removeDoubleSlashN(
        props.data["descr_" + props.code] !== null
          ? props.data["descr_" + props.code]
          : props.data["descr_en"]
      ),
      lang: i18n.language + "_" + i18n.language.toUpperCase(),
    }).then(() => setTextPlaying(false));
  }

  function stop() {
    TextToSpeech.stop();
    setTextPlaying(false);
  }

  const open_time = () => {
    if (props.code === "it") return props.data.open_time;
    return props.data["open_time_" + props.code] !== null
      ? props.data["open_time_" + props.code]
      : props.data["open_time_en"];
  };

  const tickets = () => {
    if (props.code === "it") return props.data.tickets;
    return props.data["tickets_" + props.code] !== null
      ? props.data["tickets_" + props.code]
      : props.data["tickets_en"];
  };

  const removeDoubleSlashN = (str: string) => {
    if (str) return str.replace(/\\n/g, "");
    return "No description for this POI.";
  };

  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
    t,
    setChooseLanguage,
    chooseLanguage,
  });

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => {
        props.onDismissConditions(false);
      }}
      onWillPresent={() => {
        props.onPresent(false);
        getMediaFromWebServer(props.data.classid)
          .then((json) => {
            if (json.numberReturned === 1) {
              console.log(json.features[0].properties);
              setUrlMedia(json.features[0].properties.path);
            }
          })
          .catch(() => {
            console.log("Catch");
          });
        console.log(props.data);
      }}
    >
      <IonHeader>
        <IonToolbar>
          <IonButton
            onClick={() => props.onDismissConditions(false)}
            slot="start"
            fill="clear"
          >
            <IonIcon slot="icon-only" md={arrowBack} ios={chevronBack} />
          </IonButton>
          <IonThumbnail slot="start">
            <img src={logoVerona} alt="Logo Comune di Verona"/>
          </IonThumbnail>
          <IonLabel slot="start" className="ion-padding-start">
            {props.data["name_" + props.code] !== null
              ? props.data["name_" + props.code]
              : props.data["name_en"]}
          </IonLabel>
          <IonButtons slot="end" className="ion-margin-end">
            <IonIcon
              slot="icon-only"
              color="primary"
              ios={ellipsisHorizontal}
              md={ellipsisVertical}
              onClick={(e : any) =>
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
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonImg src={props.data.image_url} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  lines={openTimeView ? "inset" : "none"}
                  onClick={() => setOpenTimeView(!openTimeView)}
                >
                  <IonLabel>{t("open_time")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={openTimeView ? removeCircle : addCircle}
                    color="primary"
                  />
                </IonItem>

                {openTimeView && (
                  <IonCardContent class="my-row">
                    {ReactHtmlParser(open_time())}
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  lines={ticketsView ? "inset" : "none"}
                  onClick={() => setTicketsView(!ticketsView)}
                >
                  <IonLabel>{t("tickets")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={ticketsView ? removeCircle : addCircle}
                    color="primary"
                  />
                </IonItem>

                {ticketsView && (
                  <IonCardContent class="my-row">
                    {ReactHtmlParser(tickets())}
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  lines={graphView ? "inset" : "none"}
                  onClick={() => setGraphView(!graphView)}
                >
                  <IonLabel>{t("chart")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={graphView ? removeCircle : addCircle}
                    color="primary"
                  />
                </IonItem>

                {graphView && (
                  <IonCardContent>
                    {/*<IonLabel>{(new Date()).toDateString()}</IonLabel>*/}
                    <Swiper
                      pagination={{
                        clickable: true,
                      }}
                      onSwiper={(swiper) => setSwiperInstance(swiper)}
                    >
                      <SwiperSlide>
                        <Bar data={data1} className="ion-bar-chart" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <Bar data={data2} />
                      </SwiperSlide>
                      <SwiperSlide>
                        <Bar data={data3} />
                      </SwiperSlide>
                    </Swiper>
                    <IonGrid fixed={true} class="ion-buttons-grid">
                      <IonRow>
                        <IonCol>
                          <IonButton
                            onClick={() => swiperInstance?.slidePrev()}
                          >
                            Precedente{/*<IonIcon icon={arrowBack}/>*/}
                          </IonButton>
                        </IonCol>
                        <IonCol className="ion-text-right">
                          <IonButton
                            onClick={() => swiperInstance?.slideNext()}
                          >
                            Successivo
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow class="my-row">
            <IonCol className="ion-margin">
              <IonItem lines="none" class="poi_description">
                <IonLabel slot="start">
                  <h2>
                    <b>{t("description")}:</b>
                  </h2>
                </IonLabel>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={textPlaying ? stop : speak}
                >
                  <IonIcon
                    slot="icon-only"
                    icon={textPlaying ? volumeMute : volumeHigh}
                  />
                </IonButton>
              </IonItem>
              <IonText>
                {removeDoubleSlashN(
                  props.data["descr_" + props.code] !== null
                    ? props.data["descr_" + props.code]
                    : props.data["descr_en"]
                )}
              </IonText>
            </IonCol>
          </IonRow>

          {urlMedia && (
            <IonRow className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url="https://sitavr.scienze.univr.it/veronapp/ArenaEsterno.mp4"
                width="100%"
                height="100%"
                controls
              />
            </IonRow>
          )}
        </IonGrid>
      </IonContent>

      {chooseLanguage && (
        <LanguageAlert i18n={i18n} onDismiss={() => setChooseLanguage(false)} />
      )}
    </IonModal>
  );
}

export default POIModal;
