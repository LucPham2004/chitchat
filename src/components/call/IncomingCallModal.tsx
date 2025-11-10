import { useRef, useEffect } from "react";
import { useChatContext } from "../../utilities/ChatContext";
import Avatar from "../common/Avatar";
import { motion } from "framer-motion";

export const IncomingCallModal = () => {
	const { callState, incomingCallData, acceptCall, rejectCall } = useChatContext();
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Phát âm thanh và rung khi có cuộc gọi đến
	useEffect(() => {
		if (callState === "INCOMING" && incomingCallData) {
			// Khởi tạo âm thanh
			const audio = new Audio("/sounds/ringtone.mp3");
			audio.loop = true; // Lặp lại
			audio.volume = 0.8;
			audio.play().catch((err) => console.warn("Audio play failed:", err));
			audioRef.current = audio;

			// Rung nếu thiết bị hỗ trợ
			if (navigator.vibrate) {
				navigator.vibrate([300, 200, 300, 200, 300]); // Rung nhịp
			}

			// Dừng âm thanh & rung khi rời modal
			return () => {
				audio.pause();
				audio.currentTime = 0;
				if (navigator.vibrate) navigator.vibrate(0);
			};
		}
	}, [callState, incomingCallData]);

	// Chỉ hiển thị modal này khi có cuộc gọi đến
	if (callState !== 'INCOMING' || !incomingCallData) {
		return null;
	}

	const stopEffects = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		if (navigator.vibrate) navigator.vibrate(0);
	};

	const handleAccept = () => {
		stopEffects();
		acceptCall();
	};

	const handleReject = () => {
		stopEffects();
		rejectCall();
	};


	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] backdrop-blur-sm">
			{/* Hiệu ứng fade-in + scale-up */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 relative"
			>
				{/* Vòng tròn rung nhẹ xung quanh avatar */}
				<motion.div
					animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 1, 0] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
					className="flex justify-center mb-4"
				>
					<Avatar
						avatarUrl={incomingCallData.fromAvatar || "/images/user_default.avif"}
						width={20}
						height={20}
					/>
				</motion.div>

				<div className="text-center space-y-3">
					<motion.h3
						className="text-xl font-semibold text-gray-900 dark:text-white"
						animate={{ scale: [1, 1.1, 1] }}
						transition={{ repeat: Infinity, duration: 2 }}
					>
						📞 Cuộc gọi đến
					</motion.h3>

					<p className="text-gray-600 dark:text-gray-300">
						<span className="font-bold text-primary-500">
							{incomingCallData.fromName}
						</span>{" "}
						đang gọi cho bạn...
					</p>

					<p className="text-sm text-gray-500">
						Cuộc gọi:{" "}
						{incomingCallData.callType === "video" ? "Video" : "Thoại"}
					</p>

					{/* Nút có hiệu ứng nhịp tim */}
					<div className="flex gap-6 justify-center pt-4">
						<motion.button
							whileTap={{ scale: 0.9 }}
							animate={{ scale: [1, 1.05, 1] }}
							transition={{ repeat: Infinity, duration: 1.4 }}
							onClick={handleReject}
							className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-md"
						>
							Từ chối
						</motion.button>

						<motion.button
							whileTap={{ scale: 0.9 }}
							animate={{ scale: [1, 1.1, 1] }}
							transition={{ repeat: Infinity, duration: 1.2 }}
							onClick={handleAccept}
							className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md"
						>
							Chấp nhận
						</motion.button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};