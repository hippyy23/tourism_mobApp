import { IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/react";
import { i18n } from "i18next";
import naturalValenceIconFilter from "../assets/images/natural_valence.svg"; // Icona chiesa filtro
import hisCultValenceIconFilter from "../assets/images/his_cult_valence.svg"; // Icona monumento filtro
import activityIconFilter from "../assets/images/activity.svg"; // Icona museo filtro
import { layers } from "ionicons/icons";

function FilterFab(props: {
	i18n: i18n;
	naturalValenceFilter: boolean;
	setNaturalValenceFilter: (arg0: boolean) => void;
	hisCultValenceFilter: boolean;
	setHisCultValenceFilter: (arg0: boolean) => void;
	activityFilter: boolean;
	setActivityFilter: (arg0: boolean) => void;
	fabRef: React.RefObject<HTMLIonFabElement>;
}) {
  	return (
		<IonFab
			vertical="bottom"
			horizontal="end"
			className="ion-margin-bottom"
			ref={props.fabRef}
			activated
		>
		<IonFabButton>
			<IonIcon icon={layers} />
		</IonFabButton>
		<IonFabList side="top">
			<IonFabButton
			class={
				props.naturalValenceFilter
				? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
				: "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
			}
			onClick={() => {
				props.setNaturalValenceFilter(!props.naturalValenceFilter);
			}}
			data-desc={props.i18n.t("cat_natural_valence")}
			data-bool={props.naturalValenceFilter}
			>
			<IonIcon
				icon={naturalValenceIconFilter}
				class={
				props.naturalValenceFilter
					? "my-icon md hydrated"
					: "my-icon-opacity md hydrated"
				}
			/>
			</IonFabButton>
			<IonFabButton
				class={
					props.hisCultValenceFilter
					? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
					: "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
				}
				onClick={() => props.setHisCultValenceFilter(!props.hisCultValenceFilter)}
				data-desc={props.i18n.t("cat_his_cult_valence")}
			>
			<IonIcon
				icon={hisCultValenceIconFilter}
				class={
					props.hisCultValenceFilter
						? "my-icon md hydrated"
						: "my-icon-opacity md hydrated"
				}
			/>
			</IonFabButton>
			<IonFabButton
				class={
					props.activityFilter
					? "my-ion-fab-button ion-color ion-color-success md fab-button-in-list ion-activatable ion-focusable hydrated"
					: "my-ion-fab-button-opacity ion-color ion-color-danger md fab-button-in-list ion-activatable ion-focusable hydrated"
				}
				onClick={() => props.setActivityFilter(!props.activityFilter)}
				data-desc={props.i18n.t("cat_activity")}
			>
			<IonIcon
				icon={activityIconFilter}
				class={
					props.activityFilter
						? "my-icon md hydrated"
						: "my-icon-opacity md hydrated"
				}
			/>
			</IonFabButton>
		</IonFabList>
		</IonFab>
	);
}

export default FilterFab;
