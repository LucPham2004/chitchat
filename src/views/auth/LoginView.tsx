import { useEffect, useState } from "react";
import useDeviceTypeByWidth from "../../utilities/DeviceType";
import { callLogin } from "../../services/AuthService";
import { Account } from "../../types/backend";
import { useAuth } from "../../utilities/AuthContext";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ParticlesBackground from "../../components/common/ParticlesBackground";
import { Particle } from "../../components/common/Particle";
import { ROUTES } from "../../utilities/Constants";

const LoginView = () => {
  const deviceType = useDeviceTypeByWidth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      const response = await callLogin(email, password);
      if (response.data.code === 1000 && response.data.result) {
        const account: Account = response.data.result;
        toast.success("Đăng nhập thành công!");
        login(account);

        setTimeout(() => {
          deviceType === "Mobile"
            ? (window.location.href = ROUTES.MOBILE.ROOT)
            : (window.location.href = ROUTES.DESKTOP.ROOT);
        }, 1000);
      } else {
        toast.error("Đăng nhập thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    document.title = "Đăng nhập | Chit Chat";
  }, []);

  return (
    <div className="relative flex items-center justify-center overflow-hidden min-h-screen">
      {/* 🌈 Background Gradient động */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-50 animate-gradient-xy"></div>
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i} />
      ))}
      <ParticlesBackground />

      {/* 🔔 Toast */}
      <Toaster position="top-center" toastOptions={{
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      }} />

      {/* Main Container */}
      <div className="min-h-screen w-full max-w-[2048px] relative flex gap-8 items-center justify-center z-10">
        {/* Hình minh họa bên trái (chỉ hiển thị trên PC) */}
        {deviceType === "PC" && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-3/5 flex items-center justify-center relative"
          >
            <div
              className="absolute -translate-y-1/4 translate-x-2/3 bg-[url('/images/ChatSample.png')] 
              w-[290px] h-[260px] bg-cover bg-center shadow-xl rounded-xl"
            ></div>
            <div
              className="bg-[url('/images/profileImage.png')] w-[360px] h-[220px] md:w-[480px] md:h-[290px] 
              bg-cover bg-center shadow-xl rounded-xl"
            ></div>
          </motion.div>
        )}

        {/* Form Login */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`${deviceType === "PC"
              ? "w-2/5"
              : "w-[90%] flex items-center justify-center"
            }`}
        >
          <div className="p-8 rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl w-full max-w-md border border-white/30">
            <p
              className={`${deviceType === "PC" ? "text-5xl" : "text-3xl"
                } font-bold text-start text-gray-800 mb-6 bg-gradient-to-br from-blue-500 to-pink-400 bg-clip-text text-transparent`}
            >
              Nơi tuyệt vời để kết nối năm châu bốn bể
            </p>

            <p className="text-md text-start text-gray-700 dark:text-gray-300 mb-6">
              Kết nối với bạn bè và gia đình, xây dựng cộng đồng và đào sâu sở thích của bạn.
            </p>

            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  name="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-3/4 px-4 py-2 border rounded-xl bg-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="password"
                  name="password" 
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-3/4 px-4 py-2 border rounded-xl bg-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-fit mt-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg 
                    font-bold py-2 px-6 rounded-full shadow-md hover:shadow-xl transition"
                >
                  Đăng nhập
                </motion.button>
              </motion.div>
            </form>

            <p className="mt-6 text-start text-gray-700 dark:text-gray-300">
              Chưa có tài khoản?{" "}
              <a
                href={ROUTES.AUTH.REGISTER}
                className="text-indigo-500 hover:underline font-medium"
              >
                Đăng ký ngay!
              </a>
            </p>

            <p className="mt-2 text-start text-gray-700 dark:text-gray-300">
              Hay là bạn {" "}
              <a
                href={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-indigo-500 hover:underline font-medium"
              >
                quên mật khẩu?
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginView;
