import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { callResetPassword } from "../../services/AuthService";
import { Particle } from "../../components/common/Particle";
import ParticlesBackground from "../../components/common/ParticlesBackground";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.password.length < 8) {
        toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        toast.error("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!");
        return;
      }

      if (form.password !== form.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      if (token) {
        const res = await callResetPassword(token, form.password, form.confirmPassword);
        if (res.data.code == 1000) {
          toast.success("Đặt lại mật khẩu thành công!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          const message = res.data.message ?? "Đã có lỗi xảy ra!";
          toast.error(`${message}`);
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Lỗi không xác định";
      toast.error(`Thất bại: ${message}`);
    }
  };

  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 🌈 Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient-xy"></div>

      {/* Toast */}
      <Toaster position="top-center" toastOptions={{
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      }} />

      
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i} />
      ))}
      <ParticlesBackground />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300 dark:text-gray-200 text-sm font-medium">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300 dark:text-gray-200 text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition"
          >
            Đặt lại mật khẩu
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
