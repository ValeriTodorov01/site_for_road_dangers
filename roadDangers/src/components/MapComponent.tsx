import { Map, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useState } from "react";
import PoiMarkers, { Severity, Poi } from "./PoiMarkers";
import NewHolePopup from "./NewHolePopup";
import { time } from "console";
/*
 *  Poi - Point of Interest
 *  key: unique id, set to the DATE in ISO format
 *  location: object with {lat: number, lng: number} properties
 *  severity: lower means less severe
 *      - 0: Severity.LOW,      GREEN color pin
 *      - 1: Severity.Medium    YELLOW color pin
 *      - 2: Severity.High      RED color pin
 *  description?: optional string shown in the info popup window
 */

interface MapComponentProps {
	locations: React.MutableRefObject<Poi[]>;
	addNewPin: (
		latitude: number,
		longitude: number,
		severity: Severity,
		description?: string
	) => void;
	modeAddHole: boolean;
	modeAddHoleFalse: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
	locations,
	addNewPin,
	modeAddHole,
	modeAddHoleFalse,
}) => {
	const [showPopup, setShowPopup] = useState(false);
	const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
	const map = useMap();

	//TODO: needs relooking
	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			console.log("Escape key pressed");
			modeAddHoleFalse();
			setShowPopup(false);
		}
	};

	//Escape key to close the hole detection mode
	useEffect(() => {
		if (!map) return;

		document.addEventListener("keydown", handleEscape);
		if (modeAddHole) {
			map?.addListener("click", (e: google.maps.MapMouseEvent) => {
				console.log("Map clicked", e.latLng?.lat(), e.latLng?.lng());
				if (!e.latLng) return;
				setMapCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
				setShowPopup(true);
				modeAddHoleFalse();
			});
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			google.maps.event.clearListeners(map, "click");
		};
	}, [map, modeAddHole]);

	return (
		<div
			id="map"
			className={`flex border-2 border-black ${
				!modeAddHole
					? "h-[80%] w-[90%] mt-8 sm:mt-12"
					: "fixed top-0 left-0 z-20 h-dvh w-dvw"
			}`}>
			<Map
				defaultZoom={12}
				mapId="HOLE_DETECTION"
				defaultCenter={{ lat: 42.699855, lng: 23.311125 }}
				// onCameraChanged={ (ev: MapCameraChangedEvent) =>
				//     console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
				// }
			>
				<PoiMarkers pois={locations.current || []} />
			</Map>
			{showPopup && (
				<NewHolePopup
					onClose={() => {
						setShowPopup(false);
						modeAddHoleFalse();
					}}
					acceptNewHoleFunc={addNewPin}
					latlng={mapCoordinates}
				/>
			)}
		</div>
	);
};

export default MapComponent;
