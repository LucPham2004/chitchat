import { useState, useEffect } from "react"
import ChatBody, { MessageObject } from "./ChatBody"
import ChatHeader, { ChatHeaderProps } from "./ChatHeader"
import ChatInput from "./ChatInput"
import { useTheme } from "../../../../utilities/ThemeContext"



const MainChat: React.FC<ChatHeaderProps> = ({ toggleChangeWidth, isChangeWidth, toggleShowConversationMembersModalOpen }) => {
    const { isDarkMode  } = useTheme();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<MessageObject[]>([]);

    useEffect(() => {
        // Kết nối với backend
        // socket = io(ENDPOINT);

        // // Lắng nghe sự kiện nhận tin nhắn từ server
        // socket.on("message", (newMessage: MessageObject) => {
        //     setMessages((prevMessages) => [...prevMessages, newMessage]);
        // });

        // return () => {
        //     // Ngắt kết nối khi component bị unmount
        //     socket.disconnect();
        // };
    }, []);

    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (message) {
        //     socket.emit("sendMessage", { text: message, user: currentUser.username }, () => {
        //         setMessage("");
        //     });
        // }
    };

    useEffect(() => {
        setMessages([
            { senderId: 4, text: "Hey John, cậu nghĩ gì về Ronaldo và Messi?", name: "alice" },
            { senderId: 5, text: "Ồ, đây là một cuộc tranh luận không hồi kết đấy!", name: "john" },
            { senderId: 4, text: "Đúng vậy! Nhưng mình thực sự ngưỡng mộ cả hai người họ.", name: "alice" },
            { senderId: 5, text: "Cậu có thấy Ronaldo vừa lập hat-trick tuần trước không?", name: "john" },
            { senderId: 4, text: "Có chứ! Quá ấn tượng luôn. Anh ấy vẫn giữ được phong độ ở tuổi này.", name: "alice" },
            { senderId: 5, text: "Phải nói là sự chăm chỉ và kỷ luật của Ronaldo thật đáng ngưỡng mộ.", name: "john" },
            { senderId: 4, text: "Nhưng Messi cũng đâu kém cạnh. Anh ấy vừa giành được Quả bóng vàng lần thứ 8!", name: "alice" },
            { senderId: 4, text: "Cả hai đều có phong cách riêng. Ronaldo là biểu tượng của sức mạnh và tốc độ, còn Messi là thiên tài sáng tạo.", name: "alice" },
            { senderId: 5, text: "Đúng rồi, mình thích phong cách chơi bóng nghệ thuật của Messi. Anh ấy khiến mọi thứ trông thật dễ dàng.", name: "john" },
            { senderId: 5, text: "Cậu nghĩ ai là cầu thủ vĩ đại nhất mọi thời đại?", name: "john" },
            { senderId: 4, text: "Khó nói lắm, nhưng nếu xét về sự ổn định và thành công, mình nghiêng về Messi. Còn cậu?", name: "alice" },
            { senderId: 5, text: "Mình thì thích Ronaldo vì tinh thần chiến đấu của anh ấy. Không bao giờ bỏ cuộc.", name: "john" },
            { senderId: 4, text: "Thật ra, dù ai xuất sắc hơn thì họ cũng đã truyền cảm hứng cho hàng triệu người trên thế giới.", name: "alice" },
            { senderId: 5, text: "Đồng ý! Mình nghĩ sẽ rất khó có ai khác đạt đến đẳng cấp như họ trong tương lai.", name: "john" },
            { senderId: 4, text: "Đúng vậy! Cả hai đều là huyền thoại sống của bóng đá thế giới.", name: "alice" },
            // { senderId: 5, text: "xàm lìn vcl", name: "john" },
            // { senderId: 4, text: "khồng, có m xàm lìn ếi", name: "alice" },
            // { senderId: 5, text: "Anh 7 t là nhất, mecseg tuoiloz", name: "john" },
            // { senderId: 4, text: "coconcek WC anh m đâu?", name: "alice" },
            // { senderId: 5, text: "Sắp có rồi, 41 tuổi đỉnh cao đời người", name: "john" },  
            // { senderId: 4, text: "xàm lồng ác", name: "alice" },
            // { senderId: 5, text: "cook ngay", name: "john" },
            // { senderId: 5, text: "dăm ba cái wc", name: "john" },
            // { senderId: 5, text: "sớm thôy", name: "john" },
            // { senderId: 5, text: "TẤT CẢ SẼ PHẢI HỐI HẬN VÌ ĐÃ TRÊU ANH 7 TAO", name: "john" },
            // { senderId: 4, text: "xàm lồng ác", name: "alice" },
            // { senderId: 4, text: "xàm lồng điên", name: "alice" },
            // { senderId: 4, text: "7 chọ tổn luoi", name: "alice" },
            // { senderId: 4, text: "phó GOAT thôi im lặng đê", name: "alice" },
            // { senderId: 4, text: "cho chức phó con may đấy", name: "alice" },
        ]);
        
    }, []);
    // [#1F1F1F] / white
    return (
        <div className={`min-h-[96vh] flex flex-col items-center pe-1 pt-1 pb-0 
            rounded-xl shadow-sm overflow-hidden
            ${isDarkMode ? 'bg-black ' : 'bg-[#FF9E3B]'}`}> 
            <ChatHeader 
                toggleChangeWidth={toggleChangeWidth} 
                isChangeWidth={isChangeWidth}
                toggleShowConversationMembersModalOpen={toggleShowConversationMembersModalOpen} />
            <div className="flex flex-col items-center justify-center w-full max-h-[87vh] min-h-[87vh] overflow-hidden">
                <ChatBody messages={messages} />
                <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default MainChat

