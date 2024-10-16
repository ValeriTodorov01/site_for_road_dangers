import { CiMap } from "react-icons/ci";


const Footer = () => {
    return (
        <footer className="font-semibold text-[#344050] mt-12 px-8">
            <div className="flex items-center">
				<CiMap size={48} />
				<h1 className="text-3xl">Name</h1>
			</div>

            <div className="flex justify-between">
                <p className="text-[20px]">Opisanie na website - blalalfdpifijoighojo</p>

            </div>
        </footer>
    );
};

export default Footer;