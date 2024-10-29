import { useEffect, useRef, useState } from "react";
import {
	AdvancedMarker,
	useMap,
	InfoWindow,
	Pin,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import MapComponent from "./MapComponent";

export enum Severity {
    Low = 0,
    Medium = 1,
    High = 2,
}

export type Poi = {
	key: string;
	location: google.maps.LatLngLiteral;
	severity: Severity;
	description?: string;
};


const PoiMarkers = (props: { pois: Poi[] }) => {
	const map = useMap();
	const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
	const clusterer = useRef<MarkerClusterer | null>(null);
	const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

	// Initialize MarkerClusterer, if the map has changed
	useEffect(() => {
		if (!map) return;
		if (!clusterer.current) {
			clusterer.current = new MarkerClusterer({ map });
		}
	}, [map]);

	// Update markers, if the array has changed
	useEffect(() => {
		clusterer.current?.clearMarkers();
		clusterer.current?.addMarkers(Object.values(markers));
	}, [markers]);

	const setMarkerRef = (marker: Marker | null, key: string) => {
		if (marker && markers[key]) return;
		if (!marker && !markers[key]) return;

		setMarkers((prev) => {
			if (marker) {
				return { ...prev, [key]: marker };
			} else {
				const newMarkers = { ...prev };
				delete newMarkers[key];
				return newMarkers;
			}
		});
	};

	const backColors = ["#32cd32", "#FBBC04", "#ea4335"];
	return (
		<>
			{props.pois.map((poi: Poi) => (
				<AdvancedMarker
					key={poi.key}
					position={poi.location}
					ref={(marker) => {
						setMarkerRef(marker, poi.key);
						if (marker) {
							marker.addListener("click", () => {
								setSelectedPoi(poi);
							});
						}
					}}>
					{selectedPoi === poi && (
						<InfoWindow
							anchor={markers[selectedPoi.key]}
							onClose={() => setSelectedPoi(null)}
							headerContent={
								<>
									<span
										style={{
											fontWeight: "bold",
											borderTop: `3px solid ${
												backColors[selectedPoi.severity]
											}`,
											borderBottom: `3px solid ${
												backColors[selectedPoi.severity]
											}`,
										}}>
										{new Date(
											selectedPoi.key
										).toDateString()}
									</span>
								</>
							}>
							{selectedPoi.description && (
								<div>
									<span style={{ fontWeight: "bold" }}>
										Description:
									</span>
									<br></br> {poi.description}
								</div>
							)}
						</InfoWindow>
					)}
					<Pin
						background={backColors[poi.severity]}
						glyphColor={"#000"}
						borderColor={"#000"}
					/>
				</AdvancedMarker>
			))}
		</>
	);
};

export default PoiMarkers;