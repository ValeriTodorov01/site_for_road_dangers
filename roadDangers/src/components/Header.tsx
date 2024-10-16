import { CiMap } from "react-icons/ci";

const Header = () => {
	return (
		<header className="flex justify-between font-semibold text-[#344050] px-8 pt-5">
			<div className="flex items-center">
				<CiMap size={48} />
				<h1 className="text-3xl">Name</h1>
			</div>

			<div className="flex gap-5">
				<button className="text-white bg-[#344050] rounded-xl p-3">
					Show Nearby Holes
				</button>
				<button className="flex items-center bg-[#D9D9D9] rounded-xl px-3">
					Add New Hole <span className="text-5xl">+</span>
				</button>
			</div>
		</header>
	);
};

export default Header;
