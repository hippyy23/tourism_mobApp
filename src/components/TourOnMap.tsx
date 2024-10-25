import {
  IonAlert,
  IonButtons,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonToolbar,
} from "@ionic/react";
import { i18n } from "i18next";
import { footsteps, map } from "ionicons/icons";
import { Polyline } from "react-leaflet";
import { useState } from "react";
import { TourDetails, POI, LanguageCode } from "../types/app_types";
import TourModal from "../modals/TourModal";

function TourOnMap(props: {
	i18n: i18n;
	tourDetails: TourDetails;
	setTourDetails: (arg0: TourDetails | undefined) => void;
	POIListData: POI[];
}) {
	const [closeTourAlert, setCloseTourAlert] = useState<boolean>(false); // Indica se mostrare l'alert di conferma chiusura del tour
	const [showTourModal, setShowTourModal] = useState<boolean>(false); // Mostra la modale dell'itinerario
	const code = props.i18n.language as LanguageCode;

	/** Mostra l'alert di chiusura itinerario se viene premuto il tasto indietro sul telefono */
	document.addEventListener("ionBackButton", (ev) => {
		setCloseTourAlert(true);
	});

	/** Coordinate che disegnano l'interesse, vengono invertite di posizione rispetto a quelle ricevute */
	// const polylineTour: [number, number, number][] =
	// 	props.tourDetails.geometry.coordinates[0].map(
	// 		(coordinates: [number, number, number]) => [coordinates[0], coordinates[1], coordinates[2]]
	// 	);


	function getColor(elevation: number) {
		return 	elevation < 800     ?	'#4DD0F7':
				elevation < 900		?   '#52C6F7':
				elevation < 1000	?   '#57BBF6':
				elevation < 1100	?   '#5CB1F6':
				elevation < 1200	?   '#61A6F5':
				elevation < 1300	?   '#F7DE4D':
				elevation < 1400	?   '#F7D352':
				elevation < 1500	?   '#F6C758':
				elevation < 1600    ?   '#F6BC5D':
				elevation < 1700    ?   '#F5B062':
				elevation < 1800    ?   '#FF5959':
				elevation < 1900    ?   '#EF5050':
				elevation < 2000    ?   '#DF4747':
				elevation < 2000    ?   '#D03F3F':
				elevation < 2100    ?   '#C03636':
				elevation < 2200    ?   '#B02D2D':
										'#B02D2D' ;
		}

	var currElevation = props.tourDetails.geometry.coordinates[0][0][2];
	var positions: [number, number, number][] = [];
	var polylines: JSX.Element[] = [];
	for (var i = 0; i < props.tourDetails.geometry.coordinates[0].length; i++) {
		positions.push([props.tourDetails.geometry.coordinates[0][i][0], props.tourDetails.geometry.coordinates[0][i][1], props.tourDetails.geometry.coordinates[0][i][2]]);
		if (currElevation + 100 < props.tourDetails.geometry.coordinates[0][i][2] || currElevation - 100 > props.tourDetails.geometry.coordinates[0][i][2]) {
			var color = getColor(currElevation);
			polylines.push(<Polyline key={i} pathOptions={{ color: color }}  positions={ positions } />);
			currElevation = props.tourDetails.geometry.coordinates[0][i][2];
			positions = [];
		}
	}
	if (polylines.length === 0) {
		color = getColor(positions[0][2]);
		polylines.push(<Polyline key={i} pathOptions={{ color: color }}  positions={ positions } />);
	}
	// props.tourDetails.geometry.coordinates[0].some(
	// 		(coordinates: [number, number, number]) => {
	// 			positions.push([coordinates[0], coordinates[1], coordinates[2]]);
	// 			return currElevation + 100 < coordinates[2];
	// 		}
	// 	);
	// polylines.push(<Polyline key={1} pathOptions={{ color: 'black' }}  positions={ positions } />)

	
	// var position: [number, number][] = [];
	// var polylines: [string, typeof position] = ['', []];
	// var currElevation = props.tourDetails.geometry.coordinates[0][0][2];
	// console.log(currElevation);
	// for (let coord: [number, number, number] of props.tourDetails.geometry.coordinates[0]) {
	// 	if (currElevation > coord[2]) {
	// 		console.log(">");
	// 		polylines.concat(getColor(currElevation), position);
	// 		console.log(polylines);
	// 		currElevation = coord[2];
	// 		position.length = 0;
	// 	} else {
	// 		console.log("<");
	// 		position.concat([coord[0], coord[1]]);
	// 		console.log([coord[0], coord[1]]);
	// 	}
	// }
	// console.log(polylines);

	// Trovare il centro in base ai punti di interesse presenti nel tour
	// let max = polylineTour.reduce(
	//     (max: [number, number], curr: [number, number]) => [
	//       max[0] > curr[0] ? max[0] : curr[0],
	//       max[1] > curr[1] ? max[1] : curr[1],
	//     ],
	//     [-100, -100]
	//   );
	//   let min = polylineTour.reduce(
	//     (min: [number, number], curr: [number, number]) => [
	//       min[0] < curr[0] ? min[0] : curr[0],
	//       min[1] < curr[1] ? min[1] : curr[1],
	//     ],
	//     [100, 100]
	//   );
	//   const tourCenter: [number, number] = [
	//     (max[0] + min[0]) / 2,
	//     (max[1] + min[1]) / 2,
	//   ];

	return (
		<>
		<IonFab vertical="top" horizontal="end" className="ion-margin-end tours">
			<IonToolbar color="none" className="ion-margin-start ion-padding-start">
				<IonButtons className="ion-margin-end">
					{/* Titolo itinerario */}
					<IonChip
						class="chip"
						onClick={() => {
							setShowTourModal(true);
						}}
					>
						<IonIcon icon={ footsteps } color="primary" />
						<IonLabel>
							{ 
								props.tourDetails.properties[`name_${code}`] ??
								props.tourDetails.properties.name_en 
							}
						</IonLabel>
					</IonChip>
				</IonButtons>
				{/* Pulsante per tornare alla mappa originale */}
				<IonButtons slot="primary">
					<IonFabButton onClick={ () => setCloseTourAlert(true) }>
						<IonIcon icon={ map } />
					</IonFabButton>
				</IonButtons>
			</IonToolbar>
		</IonFab>

		{/* Alert di conferma chiusura itinerario */}
		<IonAlert
			isOpen={closeTourAlert}
			header={props.i18n.t("tour_alert_title")}
			message={props.i18n.t("tour_alert_message")}
			onDidDismiss={() => {
				setCloseTourAlert(false);
			}}
			buttons={[
			{
				text: "Cancel",
				role: "cancel",
				cssClass: "secondary",
			},
			{
				text: "Okay",
				handler: () => {
				props.setTourDetails(undefined);
				},
			},
			]}
		/>

		{/* <Polyline pathOptions={{color: 'black'}} positions={positions} /> */}
		{ polylines }
		{/* <Polyline pathOptions={{color: '#bd0026'}} positions={h800} />
		<Polyline pathOptions={{color: '#f03b20'}} positions={h1050} /> */}
		{/* <Polyline pathOptions={{color: '#fd8d3c'}} positions={h1300} /> */}
		{/* <Polyline pathOptions={{color: '#fecc5c'}} positions={h1550} /> */}
		{/* <Polyline pathOptions={{color: '#fecc5c'}} positions={h1800} /> */}
		{/* <Polyline pathOptions={{color: '#fecc5c'}} positions={h2050} /> */}
		{/* <Polyline pathOptions={{color: '#ffffb2'}} positions={h2300} /> */}

		{showTourModal && (
			<TourModal
				openCondition={showTourModal}
				onDismissConditions={setShowTourModal}
				data={props.tourDetails}
				i18n={props.i18n}
				setTourDetails={props.setTourDetails}
				closeAllModals={() => {
					setShowTourModal(false);
				}}
			/>
		)}
		</>
	);
}

export default TourOnMap;
