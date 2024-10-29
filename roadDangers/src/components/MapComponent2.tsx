import { useEffect, useRef, useState } from "react";
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
import React from "react";
import AddHolePopup from "./NewHolePopup";

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

interface MapComponentProps {
	locations: React.MutableRefObject<Poi[]>;
	cursor: string;
	addNewPin: (
		latitude: number,
		longitude: number,
		severity: Severity,
		description?: string
	) => void;
	addHoleFlag: boolean;
	handleAddHoleFlag: () => void;
}

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

const MapComponent: React.FC<MapComponentProps> = ({
	locations,
	cursor,
	addNewPin,
	addHoleFlag,
	handleAddHoleFlag,
}) => {
	const [popupCoords, setPopupCoords] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectedMapCoordinates, setSelectedMapCoordinates] =
		useState<google.maps.LatLngLiteral | null>(null);
	const [acceptNewHole, setAcceptNewHole] = useState(false);
	const map = useMap();

	const handleMapClick = (eventMap: google.maps.MapMouseEvent) => {
		if (eventMap.latLng) {
			const coordinates = {
				lat: eventMap.latLng.lat(),
				lng: eventMap.latLng.lng(),
			};

			setSelectedMapCoordinates(coordinates);
		}
	};

	const handleClick = (event: MouseEvent) => {
		// Get the X and Y coordinates of the click
		const x = event.clientX;
		const y = event.clientY;
		setPopupCoords({ x, y });
	};

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			handleAddHoleFlag();
		}
	};

	useEffect(() => {
		if (addHoleFlag && selectedMapCoordinates && acceptNewHole) {
			console.log("Adding new hole at: ", selectedMapCoordinates);
			addNewPin(
				selectedMapCoordinates.lat,
				selectedMapCoordinates.lng,
				Severity.Low,
				"New Hole"
			);
		}
	}, [selectedMapCoordinates, acceptNewHole]);

	const addListeners = () => {
		if (!map) return;
		document.addEventListener("click", handleClick);
		map.addListener("click", handleMapClick);
		console.log("Event listeners added!");
	};

	const removeListeners = () => {
		if (!map) return;
		google.maps.event.clearListeners(map, "click");
		document.removeEventListener("click", handleClick);
		console.log("Event listeners removed!");
	};

	// Add or remove event listeners based on the addHoleFlag
	useEffect(() => {
		if (!map) return;

		const delay = 1; // Delay in milliseconds
		document.addEventListener("keydown", handleEscape);


		const timeoutId = setTimeout(() => {
			if (addHoleFlag && !popupCoords) {
				addListeners();
			} else {
				removeListeners();
			}
			if(!addHoleFlag) {
				document.removeEventListener("keydown", handleEscape);
			}
		}, delay);

		// Cleanup timeout and event listeners on component unmount
		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("keydown", handleEscape);
			removeListeners();
		};
	}, [map, addHoleFlag, popupCoords]);

	// Handle right mouse button dragging
	useEffect(() => {
		if (!map) return;

		const handleMouseDown = (event: MouseEvent) => {
			if (event.button === 2) {
				// Right mouse button
				removeListeners();
				map.setOptions({ draggable: true });
			}
		};

		const handleMouseUp = (event: MouseEvent) => {
			if (event.button === 2) {
				// Right mouse button
				addListeners();
				map.setOptions({ draggable: false });
			}
		};

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);

		// Cleanup event listeners on component unmount
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [map]);

	return (
		<div
			id="map"
			className={`flex border-2 border-black ${
				addHoleFlag
					? "fixed top-0 left-0 z-20 h-dvh w-dvw"
					: "h-[80%] w-[90%] mt-8 sm:mt-12"
			}`}>
			<Map
				defaultZoom={11}
				mapId="HOLE_DETECTION"
				defaultCenter={{ lat: 42.699855, lng: 23.311125 }}
				draggableCursor={cursor}
				// onCameraChanged={ (ev: MapCameraChangedEvent) =>
				//     console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
				// }
			>
				<PoiMarkers pois={locations.current || []} />
			</Map>

			{popupCoords && addHoleFlag && (
				<AddHolePopup
					x={popupCoords.x}
					y={popupCoords.y}
					onClose={() => {
						setPopupCoords(null);
					}}
					acceptNewHoleFunc={() => setAcceptNewHole(true)}
				/>
			)}
		</div>
	);
};

export default MapComponent;
