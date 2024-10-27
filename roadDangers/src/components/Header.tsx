import { CiMap } from "react-icons/ci";
import { Severity } from "./MapComponent";


interface HeaderProps {
	newPinCB: (latitude: number, longitude: number, severity: Severity, description?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ newPinCB }) => {
	return (
		<header className="flex justify-between font-semibold text-[#344050] px-8 pt-5">
			<div className="flex items-center">
				<CiMap size={48} />
				<h1 className="md:text-base lg:text-3xl">Name</h1>
			</div>

			<div className="flex gap-5">
				<button className="text-white bg-[#344050] rounded-xl p-3">
					Show Nearby Holes
				</button>
				<button 
					className="flex items-center bg-[#D9D9D9] rounded-xl px-3"
					onClick={() => newPinCB(
						42.699855 + (Math.random() - 0.5) * 0.1,  //lat
						23.311125 + (Math.random() - 0.5) * 0.1,  //lng
						Math.floor(Math.random() * 3), 		  	  //severity
						"Random Hole"							  //description
					)}
				>
					Add New Hole <span className="text-5xl">+</span>
				</button>
			</div>
		</header>
	);
};

export default Header;
