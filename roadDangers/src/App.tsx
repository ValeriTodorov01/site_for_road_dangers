import Header from "./components/Header";
import Map from "./components/Map";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<div className="flex flex-col justify-center h-dvh">
				<Header />
				<Map />
			</div>
      <Footer />
		</>
	);
}

export default App;
