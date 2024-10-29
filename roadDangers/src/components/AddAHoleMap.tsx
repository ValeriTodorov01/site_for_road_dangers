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

const AddAHoleMap = ({ cursor }: { cursor: string }) => {
	const map = useMap();
	

	return (
		<div className="flex border-2 border-black h-dvh w-dvw">
			<APIProvider
				apiKey={import.meta.env.VITE_GOOGLE_KEY}
				onLoad={() => console.log("Maps API has loaded.")}>
				<Map
					defaultZoom={11}
					mapId="HOLE_DETECTION"
					defaultCenter={{ lat: 42.699855, lng: 23.311125 }}>
					draggableCursor={cursor}
				</Map>
			</APIProvider>
		</div>
	);
};

export default AddAHoleMap;
