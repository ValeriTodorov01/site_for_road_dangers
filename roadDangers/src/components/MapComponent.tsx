import { Map, useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import PoiMarkers, { Severity, Poi } from "./PoiMarkers";
import NewHolePopup from "./NewHolePopup";

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
	defaultMapCoords: GeolocationCoordinates | undefined;
}

const MapComponent: React.FC<MapComponentProps> = ({
	locations,
	addNewPin,
	modeAddHole,
	modeAddHoleFalse,
	defaultMapCoords,
}) => {
	const [showPopup, setShowPopup] = useState(false);
	const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
	const map = useMap();

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			modeAddHoleFalse();
			setShowPopup(false);
		}
	};

	// Use effect to handle map clicks
	useEffect(() => {
		if (!map) return;

		
		// Listener for map click events if in "add hole" mode
		if (modeAddHole) {
			document.addEventListener("keydown", handleEscape);
			const clickListener = map.addListener(
				"click",
				(e: google.maps.MapMouseEvent) => {
					setShowPopup(true);
					modeAddHoleFalse();
					if (e.latLng) {
						setMapCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
					}
					else return;
				}
			);
			return () => google.maps.event.removeListener(clickListener);
		}

		return () => document.removeEventListener("keydown", handleEscape);
	}, [map, modeAddHole, defaultMapCoords]);

	//center on user's location when available
	useEffect(() => {
		if (defaultMapCoords) {
			if (!map) return;
			map.setCenter({
				lat: defaultMapCoords.latitude,
				lng: defaultMapCoords.longitude,
			});
		}
	}, [defaultMapCoords]);

	return (
		<div
			id="map"
			className={`flex border-2 border-black ${
				!modeAddHole
					? "h-[80%] w-[90%] mt-8 sm:mt-12"
					: "fixed top-0 left-0 z-20 h-dvh w-dvw"
			}`}>
			<Map
				defaultZoom={17}
				mapId="HOLE_DETECTION"
				defaultCenter={
					defaultMapCoords
						? {
								lat: defaultMapCoords.latitude,
								lng: defaultMapCoords.longitude,
						  }
						: { lat: 42.697624, lng: 23.322315 } //Sofia Center
				}>
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
