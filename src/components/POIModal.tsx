import React, { Component, useState } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

class POIModal extends Component<{
  openCondition: any;
  onPresent: any;
  onDismissConditions: any;
  data: any;
  code: any;
}> {

  render() {
    return (
      <IonModal
        isOpen={this.props.openCondition}
        onDidDismiss={() => {
          this.props.onDismissConditions(false);
        }}
        onWillPresent={() => {
          this.props.onPresent(false);
        }}
      >
        <IonToolbar className="ion-padding">
            <IonLabel>
              {this.props.data["name_" + this.props.code] != null
                ? this.props.data["name_" + this.props.code]
                : this.props.data["name_en"]}
            </IonLabel>

            <IonButton
              onClick={() => this.props.onDismissConditions(false)}
              slot="end"
            >
              Close
            </IonButton>
        </IonToolbar>
        {/*detailedData["descr_" + languageCode].replaceAll('\\n', "") */}
        <IonContent>
          <IonGrid fixed={true}>
            <IonRow className="ion-align-items-center">
              <IonCol>
                <IonImg src={this.props.data.image_url} />
              </IonCol>
            </IonRow>
            <IonRow class="my-row">
              <IonText className="ion-margin">
                {this.props.data["descr_" + this.props.code] != null
                  ? this.props.data["descr_" + this.props.code].replace(
                      /\\n/g,
                      ""
                    )
                  : this.props.data["descr_en"].replace(/\\n/g, "")}
              </IonText>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    );
  }
}

export default POIModal;
