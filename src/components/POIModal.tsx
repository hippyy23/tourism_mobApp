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
  IonNote,
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
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import ReactPlayer from "react-player/file";
import "swiper/swiper-bundle.min.css";
import "@ionic/react/css/ionic-swiper.css";
import PopoverList from "./PopoverList";
import LanguageAlert from "./LanguageAlert";
import logoVerona from "../assets/images/logo_stemma.png";

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
  const [urlMedia, setUrlMedia] = useState<string>(); // Imposta la URL da dove caricare il video del POI se è presente
  const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore>(); //
  const { t, i18n } = useTranslation();
  SwiperCore.use([IonicSwiper, Navigation, Pagination]);

  // DATI DI PROVA

  const data1 = {
    labels: [
      "6-8",
      "8-10",
      "10-12",
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
        label: "historical",
        data: [12, 19, 25],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "expected",
        data: [3, 10, 2],
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "real",
        data: [0, 3, 0],
        backgroundColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const data2 = {
    labels: ["12-14", "14-16", "16-18"],
    datasets: [
      {
        label: t("historical"),
        data: [3, 5, 13],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: t("expected"),
        data: [13, 15, 15],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const data3 = {
    labels: ["18-20", "20-22", "22-24"],
    datasets: [
      {
        label: t("historical"),
        data: [2, 3, 18],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: t("expected"),
        data: [12, 13, 25],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  function BarChart(props: { data: any }) {
    return (
      <Bar
        data={props.data}
        className="ion-bar-chart"
        options={{
          responsive: true,
          scales: {
            x: {
              offset: true,
              display: true,
              title: {
                display: true,
                text: t("xlabel"),
                font: {
                  weight: "bold",
                  size: 14,
                },
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: t("ylabel"),
                font: {
                  weight: "bold",
                  size: 14,
                },
              },
            },
          },
        }}
      />
    );
  }

  function speak() {
    setTextPlaying(true);
    TextToSpeech.speak({
      text: getDescriptionFallback(),
      lang: i18n.language + "_" + i18n.language.toUpperCase(),
    }).then(() => setTextPlaying(false));
  }

  function stop() {
    TextToSpeech.stop();
    setTextPlaying(false);
  }

  const getOpenTime = () => {
    if (props.code === "it") return props.data.open_time;
    return props.data["open_time_" + props.code];
  };

  const getTickets = () => {
    if (props.code === "it") return props.data.tickets;
    return props.data["tickets_" + props.code];
  };

  const getOpenTimeFallback = () => {
    let openTime = getOpenTime();
    return openTime ? openTime : props.data["open_time_en"];
  };

  const getTicketsFallback = () => {
    let tickets = getTickets();
    return tickets ? tickets : props.data["tickets_en"];
  };

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
        <IonToolbar color="primary">
          <IonButtons slot="start" className="ion-margin">
            <IonIcon
              slot="icon-only"
              ios={chevronBack}
              md={arrowBack}
              onClick={() => props.onDismissConditions(false)}
            />
          </IonButtons>
          <IonThumbnail slot="start">
            <img src={logoVerona} alt="Logo Comune di Verona" />
          </IonThumbnail>
          <IonLabel slot="start" className="ion-padding-start">
            {props.data["name_" + props.code] !== null
              ? props.data["name_" + props.code]
              : props.data["name_en"]}
          </IonLabel>
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
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonImg src={props.data.image_url} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                  lines={openTimeView ? "inset" : "none"}
                  onClick={() => setOpenTimeView(!openTimeView)}
                >
                  <IonLabel>{t("open_time")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={openTimeView ? removeCircle : addCircle}
                    // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
                  />
                </IonItem>

                {openTimeView && (
                  <IonCardContent>
                    {!getOpenTime() && (
                      <IonNote color="danger">
                        {t("not_supported")}
                        <br />
                        <br />
                      </IonNote>
                    )}
                    <IonLabel color="dark">
                      {ReactHtmlParser(getOpenTimeFallback())}
                    </IonLabel>
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                  lines={ticketsView ? "inset" : "none"}
                  onClick={() => setTicketsView(!ticketsView)}
                >
                  <IonLabel>{t("tickets")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={ticketsView ? removeCircle : addCircle}
                    // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
                  />
                </IonItem>

                {ticketsView && (
                  <IonCardContent>
                    {!getTickets() && (
                      <IonNote color="danger">
                        {t("not_supported")}
                        <br />
                        <br />
                      </IonNote>
                    )}
                    <IonLabel color="dark">
                      {ReactHtmlParser(getTicketsFallback())}
                    </IonLabel>
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem
                  color="primary" //TITOLO MENU COLORATO
                  lines={graphView ? "inset" : "none"}
                  onClick={() => setGraphView(!graphView)}
                >
                  <IonLabel>{t("chart")}:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={graphView ? removeCircle : addCircle}
                    // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
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
                      onAfterInit={() =>
                        setTimeout(
                          () => window.dispatchEvent(new Event("resize")),
                          10
                        )
                      }
                    >
                      <SwiperSlide>
                        <BarChart data={data1} />
                      </SwiperSlide>
                      <SwiperSlide>
                        <BarChart data={data2} />
                      </SwiperSlide>
                      <SwiperSlide>
                        <BarChart data={data3} />
                      </SwiperSlide>
                    </Swiper>
                    <IonGrid fixed={true} class="ion-buttons-grid">
                      <IonRow>
                        <IonCol>
                          <IonButton
                            onClick={() => swiperInstance?.slidePrev()}
                          >
                            {t("prev")}
                            {/*<IonIcon icon={arrowBack}/>*/}
                          </IonButton>
                        </IonCol>
                        <IonCol className="ion-text-right">
                          <IonButton
                            onClick={() => swiperInstance?.slideNext()}
                          >
                            {t("next")}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>

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

          {urlMedia && (
            <IonRow className="player-wrapper">
              <IonCol>
                <ReactPlayer
                  className="react-player"
                  url="https://sitavr.scienze.univr.it/veronapp/ArenaEsterno.mp4"
                  width="100%"
                  height="100%"
                  controls
                />
              </IonCol>
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
