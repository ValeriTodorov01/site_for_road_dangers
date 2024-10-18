import Header from "./components/Header";
import Map from "./components/Map";
import Footer from "./components/Footer";

//https://www.figma.com/design/mqc0FKzCs3hepP2FW2Ln58/Untitled?node-id=0-1&node-type=canvas&t=K4xzjga9G6JlQnW2-0

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
