import { IonContent, IonPage } from "@ionic/react";
import "./Home.css";
import { MapContainer } from "react-leaflet";
import React from "react";
import "../leaflet/leaflet.css";
import MapChild from "../components/MapChild";


const Home: React.FC = () => {

  return (
    <IonPage>
      {/* Utilizzo di css e javascript di leaflet online
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
      ></script>
      */}

      <IonContent>
        <MapContainer
          center={[45.43895, 10.99439]}
          zoom={15}
          minZoom={14}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <MapChild />
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
