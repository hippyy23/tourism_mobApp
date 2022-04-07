import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
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
  // IonicSwiper,
  IonHeader,
  useIonPopover,
  IonButtons,
  IonThumbnail,
  IonNote,
  IonList,
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
import {
  getPOIMediaFromWebServer,
  getTourDetailsFromWebServer,
} from "./Functions";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { Navigation, Pagination } from "swiper";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import ReactPlayer from "react-player/file";
import "swiper/swiper-bundle.min.css";
import "@ionic/react/css/ionic-swiper.css";
import PopoverList from "./PopoverList";
import logoVerona from "../assets/images/logo_stemma.png";
import TourModal from "./TourModal";

var tour_details: any;

function POIModal(props: {
  openCondition: boolean;
  onPresent: React.Dispatch<React.SetStateAction<boolean>>;
  onDismissConditions: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  code: string;
}) {
  const [openTimeView, setOpenTimeView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli orari del punto di interesse
  const [ticketsView, setTicketsView] = useState<boolean>(false); // Mostra o nascondi il testo relativo al prezzo dei biglietti del punto di interesse
  const [toursView, setToursView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli itinerari
  const [urlMedia, setUrlMedia] = useState<string>(); // Imposta la URL da dove caricare il video del POI se è presente
  const [textPlaying, setTextPlaying] = useState<boolean>(false); // Controlla se il TTS è in riproduzione o no
  const [showTourModal, setShowTourModal] = useState<boolean>(false); // Mostra o nascondi il modale dell'itinerario
  const { t, i18n } = useTranslation();
  const n_tours = props.data.tours_id
    ? props.data.tours_id.split(",").length
    : 0;

  // const [graphView, setGraphView] = useState<boolean>(false); // Mostra o nascondi il grafico della popolazione nel POI
  // const [swiperInstance, setSwiperInstance] = useState<SwiperCore>(); //
  // SwiperCore.use([IonicSwiper, Navigation, Pagination]);

  // // DATI DI PROVA

  // const data1 = {
  //   labels: [
  //     "6-8",
  //     "8-10",
  //     "10-12",
  //     /*t("day_week_mon"),
  //     t("day_week_tue"),
  //     t("day_week_tue"),
  //     t("day_week_thu"),
  //     t("day_week_fri"),
  //     t("day_week_sat"),
  //     t("day_week_sun"),
  //     */
  //   ],
  //   datasets: [
  //     {
  //       label: "historical",
  //       data: [12, 19, 25],
  //       backgroundColor: "rgb(255, 99, 132)",
  //     },
  //     {
  //       label: "expected",
  //       data: [3, 10, 2],
  //       backgroundColor: "rgb(75, 192, 192)",
  //     },
  //     {
  //       label: "real",
  //       data: [0, 3, 0],
  //       backgroundColor: "rgb(54, 162, 235)",
  //     },
  //   ],
  // };

  // const data2 = {
  //   labels: ["12-14", "14-16", "16-18"],
  //   datasets: [
  //     {
  //       label: t("historical"),
  //       data: [3, 5, 13],
  //       backgroundColor: "rgb(255, 99, 132)",
  //     },
  //     {
  //       label: t("expected"),
  //       data: [13, 15, 15],
  //       backgroundColor: "rgb(75, 192, 192)",
  //     },
  //   ],
  // };

  // const data3 = {
  //   labels: ["18-20", "20-22", "22-24"],
  //   datasets: [
  //     {
  //       label: t("historical"),
  //       data: [2, 3, 18],
  //       backgroundColor: "rgb(255, 99, 132)",
  //     },
  //     {
  //       label: t("expected"),
  //       data: [12, 13, 25],
  //       backgroundColor: "rgb(75, 192, 192)",
  //     },
  //   ],
  // };

  // function BarChart(props: { data: any }) {
  //   return (
  //     <Bar
  //       data={props.data}
  //       className="ion-bar-chart"
  //       options={{
  //         animation: false,
  //         responsive: true,
  //         scales: {
  //           x: {
  //             offset: true,
  //             display: true,
  //             title: {
  //               display: true,
  //               text: t("xlabel"),
  //               font: {
  //                 weight: "bold",
  //                 size: 14,
  //               },
  //             },
  //           },
  //           y: {
  //             display: true,
  //             title: {
  //               display: true,
  //               text: t("ylabel"),
  //               font: {
  //                 weight: "bold",
  //                 size: 14,
  //               },
  //             },
  //           },
  //         },
  //       }}
  //     />
  //   );
  // }

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

  /** Funzioni che restituiscono orari, biglietti e descrizione nel linguaggio scelto,
      servono anche a controllare se il contenuto è disponibile in quella lingua */
  const getOpenTime = () => {
    if (props.code === "it") return props.data.open_time;
    return props.data["open_time_" + props.code];
  };
  const getTickets = () => {
    if (props.code === "it") return props.data.tickets;
    return props.data["tickets_" + props.code];
  };
  function getDescription() {
    return props.data["descr_" + props.code];
  }

  /** Funzioni che restituiscono il contenuto da visualizzare nelle schede, nella propria lingua se presente oppure in inglese */
  const getOpenTimeFallback = () => {
    let openTime = getOpenTime();
    return openTime ? openTime : props.data["open_time_en"];
  };
  const getTicketsFallback = () => {
    let tickets = getTickets();
    return tickets ? tickets : props.data["tickets_en"];
  };
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
  });

  function getTourDetail(id_tour: string) {
    getTourDetailsFromWebServer(id_tour)
      .then((json) => {
        tour_details = json.features[0];
        setShowTourModal(true);
      })
      .catch(() => {
        //TODO: Gestire errore
      });
  }

  /** Creazione della lista di itinerari cliccabili */
  function TourList() {
    const tours_id = props.data.tours_id.split(",");
    const tours_name = props.data["tours_name_" + props.code]
      ? props.data["tours_name_" + props.code].split(",")
      : props.data.tours_name_en.split(",");
    const listItems = tours_id.map((id: string, index: number) => (
      <IonItem
        button={true}
        key={id}
        lines={index < n_tours - 1 ? "inset" : "none"}
        onClick={() => {
          getTourDetail(id);
        }}
      >
        <IonLabel>{tours_name[index]}</IonLabel>
      </IonItem>
    ));
    return <IonList className="ion-no-padding">{listItems}</IonList>;
  }

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => {
        props.onDismissConditions(false);
      }}
      onWillPresent={() => {
        props.onPresent(false);
        getPOIMediaFromWebServer(props.data.classid)
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
      {showTourModal && (
        <TourModal
          openCondition={showTourModal}
          onDismissConditions={setShowTourModal}
          data={tour_details}
          code={i18n.language}
        />
      )}

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

          {/* NOME POI */}
          <IonLabel slot="start" className="ion-padding-start">
            {props.data["name_" + props.code] !== null
              ? props.data["name_" + props.code]
              : props.data["name_en"]}
          </IonLabel>

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

          {/* SCHEDA ORARI */}
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

          {/* SCHEDA BIGLIETTI */}
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

          {/* SCHEDA ITINERARI */}
          {n_tours > 0 && (
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonItem
                    color="primary" //TITOLO MENU COLORATO
                    lines={toursView ? "inset" : "none"}
                    onClick={() => setToursView(!toursView)}
                  >
                    <IonLabel>{t("tours")}:</IonLabel>
                    <IonIcon
                      slot="end"
                      icon={toursView ? removeCircle : addCircle}
                      // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
                    />
                  </IonItem>

                  {toursView && (
                    <IonCardContent className="ion-no-padding">
                      <TourList />
                    </IonCardContent>
                  )}
                </IonCard>
              </IonCol>
            </IonRow>
          )}

          {/* SCHEDA OCCUPAZIONE */}
          {
            // <IonRow>
            //   <IonCol>
            //     <IonCard>
            //       <IonItem
            //         color="primary" //TITOLO MENU COLORATO
            //         lines={graphView ? "inset" : "none"}
            //         onClick={() => setGraphView(!graphView)}
            //       >
            //         <IonLabel>{t("chart")}:</IonLabel>
            //         <IonIcon
            //           slot="end"
            //           icon={graphView ? removeCircle : addCircle}
            //           // color="primary" BOTTONE BIANCO CON TITOLO COLORATO
            //         />
            //       </IonItem>
            //       {graphView && (
            //         <IonCardContent>
            //           {/*<IonLabel>{(new Date()).toDateString()}</IonLabel>*/}
            //           <Swiper
            //             pagination={{
            //               clickable: true,
            //             }}
            //             onSwiper={(swiper) => setSwiperInstance(swiper)}
            //             onAfterInit={() =>
            //               setTimeout(
            //                 () => window.dispatchEvent(new Event("resize")),
            //                 10
            //               )
            //             }
            //           >
            //             <SwiperSlide>
            //               <BarChart data={data1} />
            //             </SwiperSlide>
            //             <SwiperSlide>
            //               <BarChart data={data2} />
            //             </SwiperSlide>
            //             <SwiperSlide>
            //               <BarChart data={data3} />
            //             </SwiperSlide>
            //           </Swiper>
            //           <IonGrid fixed={true} class="ion-buttons-grid">
            //             <IonRow>
            //               <IonCol>
            //                 <IonButton
            //                   onClick={() => swiperInstance?.slidePrev()}
            //                 >
            //                   {t("prev")}
            //                   {/*<IonIcon icon={arrowBack}/>*/}
            //                 </IonButton>
            //               </IonCol>
            //               <IonCol className="ion-text-right">
            //                 <IonButton
            //                   onClick={() => swiperInstance?.slideNext()}
            //                 >
            //                   {t("next")}
            //                 </IonButton>
            //               </IonCol>
            //             </IonRow>
            //           </IonGrid>
            //         </IonCardContent>
            //       )}
            //     </IonCard>
            //   </IonCol>
            // </IonRow>
          }

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

          {/* Visualizzazione del contenuto multimediale (video) */}
          {urlMedia && (
            <IonRow className="player-wrapper">
              <IonCol>
                <ReactPlayer
                  className="react-player"
                  url="https://sitavr.scienze.univr.it/veronapp/ArenaEsterno.mp4" /*DA INSERIRE urlMedia per utilizzare il PATH CORRETTO*/
                  width="100%"
                  height="100%"
                  controls
                />
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}

export default POIModal;
