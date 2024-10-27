import { CiMap } from "react-icons/ci";

const Footer = () => {
	return (
		<footer className="font-semibold text-[#344050] mt-12 mb-20 px-9">
			<div className="flex items-center mb-4">
				<CiMap size={48} />
				<h1 className="text-3xl">Name</h1>
			</div>

			<div className="flex flex-wrap md:flex-nowrap justify-between">
				<p className="flex text-[20px]">
					Opisanie na website - blalalfdpifijoighojo
				</p>
				<div className="flex flex-wrap md:flex-nowrap mt-12 md:mt-0 gap-16 lg:gap-20">
					<div className="flex-col min-w-[185px]">
						<div className="flex items-center gap-2 mb-2">
							<div className="bg-[#344050] w-1 h-12"></div>
							<h2 className="text-xl">Контакти</h2>
						</div>
						<p>Тел: 0888 888 888</p>
						<p>Email: val@gmail.com</p>
					</div>

					<div className="flex-col min-w-[185px]">
						<div className="flex items-center gap-2 mb-2">
							<div className="bg-[#344050] w-1 h-12"></div>
							<h2 className="text-xl">Контакти</h2>
						</div>
						<p>Тел: 0888 888 888</p>
						<p>Email: val@gmail.com</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
