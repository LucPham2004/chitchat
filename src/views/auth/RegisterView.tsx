import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";
import { callRegister, callVerifyOtp } from "../../services/AuthService";
import { Gender } from "../../types/User";
import { useAuth } from "../../utilities/AuthContext";
import ParticlesBackground from "../../components/common/ParticlesBackground";
import { Particle } from "../../components/common/Particle";
import { ROUTES } from "../../utilities/Constants";

const RegisterView = () => {
  const deviceType = useDeviceTypeByWidth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      setLoading(true);
      const response = await callRegister({
        username: email,
        password,
        email,
        firstName,
        lastName,
        dob,
        gender,
      });

      if (response.data.code === 1000 && response.data.result) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.");
        setIsOtpStep(true);
      } else {
        toast.error(response.data.message || "Đăng ký thất bại!");
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(
        "Đăng ký thất bại: " +
        (error.response?.data?.message || "Lỗi không xác định")
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await callVerifyOtp(email, otp);

      if (response.data.code === 1000) {
        toast.success("Xác minh OTP thành công! Bạn có thể đăng nhập ngay.");
        setTimeout(() => {
          window.location.href = ROUTES.AUTH.LOGIN;
        }, 1500);
      } else {
        toast.error(response.data.message || "Mã OTP không hợp lệ!");
      }
    } catch (error: any) {
      toast.error(
        "Xác minh thất bại: " +
        (error.response?.data?.message || "Lỗi không xác định")
      );
    }
  };

  useEffect(() => {
    document.title = "Đăng ký | Chit Chat";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-pink-50 via-purple-100 to-blue-200 animate-gradient-xy">
      {/* 🌈 Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          },
        }}
      />
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i} />
      ))}
      <ParticlesBackground />

      {/* 🪄 Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-[90%] max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-blue-400 bg-clip-text text-transparent">
          Tạo tài khoản mới
        </h2>

        {!isOtpStep ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Họ đệm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-1/2 ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Tên"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-1/2 ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Giới tính */}
            <div className="flex justify-between gap-2">
              {[
                { label: "Nam", value: Gender.MALE },
                { label: "Nữ", value: Gender.FEMALE },
                { label: "Khác", value: Gender.OTHER },
              ].map((item) => (
                <label
                  key={item.value}
                  className={`flex gap-3 px-5 py-2 rounded-lg border transition cursor-pointer min-w-[30%] ${gender === item.value
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300 text-gray-200"
                    }`}
                >
                  {item.label}
                  <input
                    type="radio"
                    name="gender"
                    className="w-4 h-4 cursor-pointer"
                    checked={gender === item.value}
                    onChange={() => setGender(item.value)}
                  />
                </label>
              ))}
            </div>

            {/* Ngày sinh */}
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* Mật khẩu */}
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* Xác nhận mật khẩu */}
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* Nút */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-blue-400 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {loading ? "Đang gửi OTP đến email của bạn" : "Đăng ký"}
            </motion.button>
          </form>
        ) : (
          // 👉 Form nhập OTP
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-gray-200 mb-4">
              Nhập mã OTP
            </h3>

            <p className="text-center text-sm text-gray-300 mb-2">
              Mã OTP đã được gửi đến email: <strong>{email}</strong>
            </p>

            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full ps-4 pe-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-center tracking-widest text-lg"
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-blue-400 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Xác minh OTP
            </motion.button>

            <p
              className="mt-3 text-center text-pink-500 hover:underline cursor-pointer"
              onClick={() => setIsOtpStep(false)}
            >
              ← Quay lại đăng ký
            </p>
          </form>
        )}

        <p className="mt-4 text-center text-gray-200">
          Đã có tài khoản?{" "}
          <a href={ROUTES.AUTH.LOGIN} className="text-pink-500 hover:underline">
            Đăng nhập ngay!
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterView;
