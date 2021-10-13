import React, { Component, useState } from "react";
import { Bar } from 'react-chartjs-2';
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addCircle, removeCircle } from "ionicons/icons";
import ReactHtmlParser from "react-html-parser";

function POIModal(props: {
  openCondition: any;
  onPresent: any;
  onDismissConditions: any;
  data: any;
  code: any;
}) {
  const [openTimeView, setOpenTimeView] = useState<boolean>(false); // Mostra o nascondi il testo relativo agli orari del punto di interesse
  const [ticketsView, setTicketsView] = useState<boolean>(false); // Mostra o nascondi il testo relativo al prezzo dei biglietti del punto di interesse
  const [graphView, setGraphView] = useState<boolean>(false); // Mostra o nascondi il grafico della popolazione nel POI

  // PROVA
  const data = {
    labels: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
    datasets: [
      {
        label: 'Storico',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Reale',
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Previsione',
        data: [3, 10, 13, 15, 22, 30],
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const open_time = () => {
    if (props.code == "it") return props.data.open_time;
    return props.data["open_time_" + props.code] != null
      ? props.data["open_time_" + props.code]
      : props.data["open_time_en"];
  };

  const tickets = () => {
    if (props.code == "it") return props.data.tickets;
    return props.data["tickets_" + props.code] != null
      ? props.data["tickets_" + props.code]
      : props.data["tickets_en"];
  };

  const removeDoubleSlashN = (str : string) => {
    return str.replace(/\\n/g, "");
  };

  return (
    <IonModal
      isOpen={props.openCondition}
      onDidDismiss={() => {
        props.onDismissConditions(false);
      }}
      onWillPresent={() => {
        props.onPresent(false);
        console.log(props.data);
      }}
    >
      <IonToolbar className="ion-padding">
        <IonLabel>
          {props.data["name_" + props.code] != null
            ? props.data["name_" + props.code]
            : props.data["name_en"]}
        </IonLabel>

        <IonButton onClick={() => props.onDismissConditions(false)} slot="end">
          Close
        </IonButton>
      </IonToolbar>
      {/*detailedprops.Data["descr_" + languageCode].replaceAll('\\n', "") */}
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
                <IonItem onClick={() => setOpenTimeView(!openTimeView)}>
                  <IonLabel>Orari:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={openTimeView ? removeCircle : addCircle}
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
                <IonItem onClick={() => setTicketsView(!ticketsView)}>
                  <IonLabel>Biglietti:</IonLabel>
                  <IonIcon
                    slot="end"
                    icon={ticketsView ? removeCircle : addCircle}
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
                <IonItem onClick={() => setGraphView(!graphView)}>
                  <IonLabel>Grafico:</IonLabel>
                    <IonIcon
                      slot="end"
                      icon={graphView ? removeCircle : addCircle}
                    />
                </IonItem>

                {graphView && (
                  <IonCardContent class="my-row">
                    <Bar data={data}/>
                  </IonCardContent>
                )}
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow class="my-row">
            <IonText className="ion-margin">
              {removeDoubleSlashN(props.data["descr_" + props.code] != null
                ? props.data["descr_" + props.code]
                : props.data["descr_en"])}
            </IonText>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}

export default POIModal;
