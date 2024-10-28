import { useEffect, useReducer, useRef, useState } from "react";
import {
	APIProvider,
	Map,
	AdvancedMarker,
	// MapCameraChangedEvent,
	useMap,
	InfoWindow,
	Pin,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

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
	const [selectedCoordinates, setSelectedCoordinates] = useState<google.maps.LatLngLiteral | null>(null);



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

	// Add click event listener to the map
    useEffect(() => {
        if (!map) return;

        const handleClick = (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
                const coordinates = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };
                setSelectedCoordinates(coordinates);
            }

			console.log("Clicked on the map at: ", event.latLng?.toJSON());
        };

        map.addListener('click', handleClick);

        // Cleanup event listener on component unmount
        return () => {
            google.maps.event.clearListeners(map, 'click');
        };
    }, [map]);

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

const MapComponent = ({ locations }: { locations: React.MutableRefObject<Poi[]> }) => {
	return (
		<div className="flex border-2 border-black h-[80%] w-[90%] mt-8 sm:mt-12">
			<APIProvider
				apiKey={import.meta.env.VITE_GOOGLE_KEY}
				onLoad={() => console.log("Maps API has loaded.")}>
				<Map
					defaultZoom={10}
					mapId="HOE_DETECTION"
					defaultCenter={{ lat: 42.699855, lng: 23.311125 }}
					// onCameraChanged={ (ev: MapCameraChangedEvent) =>
					//     console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
					// }
				>
					<PoiMarkers pois={locations.current || []} />
				</Map>
			</APIProvider>
		</div>
	);
};

export default MapComponent;
