import { useState, useEffect } from "react"
import ChatBody, { MessageObject } from "./ChatBody"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import { ChangeWidthProps } from "../../../../views/HomeView"



const MainChat: React.FC<ChangeWidthProps> = ({ toggleChangeWidth, isChangeWidth }) => {
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
            { text: "Hey John, cậu nghĩ gì về Ronaldo và Messi?", user: "alice" },
            { text: "Ồ, đây là một cuộc tranh luận không hồi kết đấy!", user: "john" },
            { text: "Đúng vậy! Nhưng mình thực sự ngưỡng mộ cả hai người họ.", user: "alice" },
            { text: "Cậu có thấy Ronaldo vừa lập hat-trick tuần trước không?", user: "john" },
            { text: "Có chứ! Quá ấn tượng luôn. Anh ấy vẫn giữ được phong độ ở tuổi này.", user: "alice" },
            { text: "Phải nói là sự chăm chỉ và kỷ luật của Ronaldo thật đáng ngưỡng mộ.", user: "john" },
            { text: "Nhưng Messi cũng đâu kém cạnh. Anh ấy vừa giành được Quả bóng vàng lần thứ 8!", user: "alice" },
            { text: "Cả hai đều có phong cách riêng. Ronaldo là biểu tượng của sức mạnh và tốc độ, còn Messi là thiên tài sáng tạo.", user: "alice" },
            { text: "Đúng rồi, mình thích phong cách chơi bóng nghệ thuật của Messi. Anh ấy khiến mọi thứ trông thật dễ dàng.", user: "john" },
            { text: "Cậu nghĩ ai là cầu thủ vĩ đại nhất mọi thời đại?", user: "john" },
            { text: "Khó nói lắm, nhưng nếu xét về sự ổn định và thành công, mình nghiêng về Messi. Còn cậu?", user: "alice" },
            { text: "Mình thì thích Ronaldo vì tinh thần chiến đấu của anh ấy. Không bao giờ bỏ cuộc.", user: "john" },
            { text: "Thật ra, dù ai xuất sắc hơn thì họ cũng đã truyền cảm hứng cho hàng triệu người trên thế giới.", user: "alice" },
            { text: "Đồng ý! Mình nghĩ sẽ rất khó có ai khác đạt đến đẳng cấp như họ trong tương lai.", user: "john" },
            { text: "Đúng vậy! Cả hai đều là huyền thoại sống của bóng đá thế giới.", user: "alice" }
        ]);
        
    }, []);

    return (
        <div className="min-h-[96vh] flex flex-col items-center bg-white p-1 pb-0 
            rounded-xl border border-gray-200 shadow-sm">
            <ChatHeader toggleChangeWidth={toggleChangeWidth} />
            <ChatBody messages={messages} name={'john'} />
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    )
}

export default MainChat

