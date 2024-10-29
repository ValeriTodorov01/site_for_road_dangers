import { CiMap } from "react-icons/ci";
import { Severity } from "./MapComponent2";
import { useEffect, useState } from "react";

interface HeaderProps {
	setModeAddHoleTrue: () => void;
}

const Header: React.FC<HeaderProps> = ({ setModeAddHoleTrue }) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<header className="flex justify-between w-full font-semibold text-[#344050] px-4 sm:px-8 pt-5">
			<div className="flex items-center">
				{windowWidth < 640 ? <CiMap size={40} /> : <CiMap size={48} />}
				<h1 className="text-3xl">Name</h1>
			</div>

			<div className="flex flex-col sm:flex-row gap-5">
				<button className="text-white text-sm bg-[#344050] rounded-xl p-3">
					{windowWidth < 640 ? "Nearby Holes" : "Show Nearby Holes"}
				</button>

				<button
					className="flex items-center bg-[#D9D9D9] rounded-xl px-3"
					onClick={() => {
						// newPinCB(
						// 	42.699855 + (Math.random() - 0.2) * 0.1, //lat
						// 	23.311125 + (Math.random() - 0.2) * 0.1, //lng
						// 	Math.floor(Math.random() * 3), //severity
						// 	"Random Hole" //description
						// );
						setModeAddHoleTrue();
						console.log("Add Hole Button Clicked");
					}}>
					{windowWidth < 640 ? "New Hole" : "Add New Hole"}{" "}
					<span className="text-2xl sm:text-3xl">+</span>
				</button>
			</div>
		</header>
	);
};

export default Header;
