import { BsPencilSquare } from "react-icons/bs";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import '../../styles/scrollbar.css';

const Conversations = () => {
    
    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-[25%] flex flex-col items-center bg-white 
            p-2 pb-0 rounded-xl border border-gray-200 shadow-sm">

            <div className="flex flex-row items-center p-2 py-0 self-start w-full">
                <h2 className="flex self-start text-2xl font-bold text-left text-gray-800 w-[35%]"> Đoạn chat </h2>
                <div className="flex flex-row gap-4 items-center justify-end w-[65%]">
                    <button className="p-2 rounded-full text-black text-xl bg-gray-100 hover:bg-gray-200">
                        <BsPencilSquare />
                    </button>
                    <button className="rounded-full text-black">
                        <img src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/426557674_2024821517893555_8163706382522298168_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=gxJAQWu02SEQ7kNvgFtk5_Q&_nc_oc=AdgJUyZIoWTc55dBmIgR1kGpQUUHrfpas3VBIjam2Jy0x1o0F8cwbjjGVuo151G4qEjSAlu65JQlI6PFJJ1p_DNZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AHlEaSB8HywVcln6T29bS7V&oh=00_AYCWr9OsAQ_mp2d9tO6WdCz4C44M_Nn2MIgamy1l6O2oVw&oe=67746D85" className="w-8 h-8 rounded-full"/>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center w-full h-full p-2">
                <SearchBar />
            </div>

            <div className="flex flex-col items-center w-full h-full p-2 py-1 overflow-y-auto">
                <ConversationList />
            </div>
        </div>
    );
}

export default Conversations;

