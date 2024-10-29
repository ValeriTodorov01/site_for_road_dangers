import Header from "./components/Header";
import MapComponent, { Poi, Severity } from "./components/MapComponent";
import Footer from "./components/Footer";
import { useEffect, useReducer, useRef, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

//https://www.figma.com/design/mqc0FKzCs3hepP2FW2Ln58/Untitled?node-id=0-1&node-type=canvas&t=K4xzjga9G6JlQnW2-0

const defaultLocations: Poi[] = [
	{
		key: "2024-10-23T13:53:11.604Z",
		location: { lat: 42.699855, lng: 23.311125 },
		severity: Severity.Low,
		description: "Small pothole on the road",
	},
	// {
	// 	key: "2024-10-23T13:54:11.604Z",
	// 	location: { lat: 42.701855, lng: 23.313125 },
	// 	severity: Severity.High,
	// 	description: "Large pothole causing traffic issues",
	// },
	// {
	// 	key: "2024-10-23T13:55:11.604Z",
	// 	location: { lat: 42.697855, lng: 23.309125 },
	// 	severity: Severity.Low,
	// 	description: "Minor cracks and holes",
	// },
	// {
	// 	key: "2024-10-23T13:56:11.604Z",
	// 	location: { lat: 42.699355, lng: 23.314125 },
	// 	severity: Severity.Low,
	// 	description: "Small pothole near the sidewalk",
	// },
	// {
	// 	key: "2024-10-23T13:57:11.604Z",
	// 	location: { lat: 42.702355, lng: 23.312625 },
	// 	severity: Severity.Low,
	// 	description: "Minor pothole on the main road",
	// },
	// {
	// 	key: "2024-10-23T13:58:11.604Z",
	// 	location: { lat: 42.698355, lng: 23.308625 },
	// 	severity: Severity.Medium,
	// 	description: "Medium-sized pothole affecting one lane",
	// },
	// {
	// 	key: "2024-10-23T13:59:11.604Z",
	// 	location: { lat: 42.700855, lng: 23.315125 },
	// 	severity: Severity.Low,
	// 	description: "Small pothole near the intersection",
	// },
	// {
	// 	key: "2024-10-23T14:00:11.604Z",
	// 	location: { lat: 42.703855, lng: 23.311125 },
	// 	severity: Severity.Low,
	// 	description: "Minor pothole on the side street",
	// },
	// {
	// 	key: "2024-10-23T14:01:11.604Z",
	// 	location: { lat: 42.696855, lng: 23.307125 },
	// 	severity: Severity.Low,
	// 	description: "Small pothole near the bus stop",
	// },
	// {
	// 	key: "2024-10-23T14:02:11.604Z",
	// 	location: { lat: 42.699355, lng: 23.316125 },
	// 	severity: Severity.Medium,
	// 	description: "Medium-sized pothole causing minor delays",
	// },
	// {
	// 	key: "2024-10-23T14:03:11.604Z",
	// 	location: { lat: 42.704355, lng: 23.310625 },
	// 	severity: Severity.Low,
	// 	description: "Minor pothole on the residential street",
	// },
	// {
	// 	key: "2024-10-23T14:04:11.604Z",
	// 	location: { lat: 42.695355, lng: 23.306625 },
	// 	severity: Severity.High,
	// 	description: "Large pothole causing significant traffic issues",
	// },
	// {
	// 	key: "2024-10-23T14:05:11.604Z",
	// 	location: { lat: 42.698855, lng: 23.317125 },
	// 	severity: Severity.Low,
	// 	description: "Small pothole near the park",
	// },
	// {
	// 	key: "2024-10-23T14:06:11.604Z",
	// 	location: { lat: 42.705855, lng: 23.309125 },
	// 	severity: Severity.Medium,
	// 	description: "Medium-sized pothole on the main road",
	// },
	// {
	// 	key: "2024-10-23T14:07:11.604Z",
	// 	location: { lat: 42.694855, lng: 23.305125 },
	// 	severity: Severity.Low,
	// 	description: "Minor pothole near the school",
	// },
];

function App() {
	const locationsRef = useRef<Poi[]>([]);
	const [_, forceUpdate] = useReducer((x) => x + 1, 0);
	const [cursor, setCursor] = useState("pointer");
	const [addHoleFlag, setAddHoleFlag] = useState(false);

	useEffect(() => {
		const storedLocations = localStorage.getItem("locations");
		if (storedLocations) {
			locationsRef.current = JSON.parse(storedLocations);
			console.log("Loaded Pins!");
			forceUpdate();
		} else {
			localStorage.setItem("locations", JSON.stringify(defaultLocations));
			locationsRef.current = defaultLocations;
			console.log("FIRST LOAD! Saved default Pins and Loaded them!");
			forceUpdate();
		}
	}, []);


	const addNewPin = (
		latitude: number,
		longitude: number,
		severity: Severity,
		description?: string
	) => {
		const newPin: Poi = {
			key: new Date().toISOString(),
			location: { lat: latitude, lng: longitude },
			severity,
			description: description || "",
		};

		locationsRef.current = [...locationsRef.current, newPin];
		localStorage.setItem("locations", JSON.stringify(locationsRef.current));

		handleAddHoleFlag();

		window.location.reload();
	};

	const handleCursor = () => {
		// if (cursor === "pointer") {
		// 	setCursor(`url("/black_marker.png"), auto`);
		// } else {
		// 	setCursor("pointer");
		// }
	};

	const handleAddHoleFlag = () => {
		setAddHoleFlag(!addHoleFlag);
	};



	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_KEY}>
			<div
				className="flex items-center flex-col h-dvh"
				style={{ cursor: cursor }}>
				<Header
					handleAddHoleFlag={handleAddHoleFlag}
					changeCursor={handleCursor}
				/>
				<MapComponent
					locations={locationsRef}
					cursor={cursor}
					addNewPin={addNewPin}
					addHoleFlag={addHoleFlag}
					handleAddHoleFlag={handleAddHoleFlag}
				/>
			</div>
			<Footer />
		</APIProvider>
	);
}

export default App;
