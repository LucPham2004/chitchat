import { useState } from "react";
import { callForgotPassSendOtp, callForgotPassVerifyOtp } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import OtpInput from "../../components/common/OtpInput";
import ParticlesBackground from "../../components/common/ParticlesBackground";
import { Particle } from "../../components/common/Particle";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.trim()) return toast.error("Vui lòng nhập email!");
    setLoading(true);
    try {
      await callForgotPassSendOtp(email);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setStep(2);
    } catch {
      toast.error("Không thể gửi OTP. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyOtp = async () => {
  //   if (otp.length < 6) return toast.error("Vui lòng nhập đủ 6 số OTP!");
  //   setLoading(true);
  //   try {
  //     await callForgotPassVerifyOtp(email, otp);
  //     toast.success("Xác thực OTP thành công!");
  //     navigate("/reset-password", { state: { email } });
  //   } catch {
  //     toast.error("Mã OTP không hợp lệ hoặc đã hết hạn!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌈 Background gradient động */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient-xy"></div>

      {/* Toast */}
      <Toaster position="top-center" toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          },
        }}/>
      
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i} />
      ))}
      <ParticlesBackground />

      {/* Khung chính */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[400px] border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          {step === 1 ? "Quên mật khẩu" : "Xác thực OTP"}
        </h2>

        {/* Hiệu ứng chuyển bước */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block mb-2 text-gray-300 dark:text-gray-200 font-medium">
                Email của bạn
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-4 py-2 mb-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-transparent"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                Đường dẫn để đặt lại mật khẩu đã được gửi đến email: <strong>{email}</strong>. Vui lòng kiểm tra email của bạn.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
