import { CiMap } from "react-icons/ci";


const Footer = () => {
    return (
        <footer className="font-semibold text-[#344050] mt-12 mb-20 px-9">
            <div className="flex items-center mb-4">
				<CiMap size={48} />
				<h1 className="text-3xl">Name</h1>
			</div>

            <div className="flex justify-between">
                <p className="text-[20px]">Opisanie na website - blalalfdpifijoighojo</p>
                <div className="flex gap-20">
                    <div className="flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-[#344050] w-1 h-12"></div>
                            <h2 className="text-xl">Контакти</h2>
                        </div>
                        <p>Телефон: 0888 888 888</p>
                        <p>Email: val@gmail.com</p> 
                    </div>

                    <div className="flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-[#344050] w-1 h-12"></div>
                            <h2 className="text-xl">Контакти</h2>
                        </div>
                        <p>Телефон: 0888 888 888</p>
                        <p>Email: val@gmail.com</p> 
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;