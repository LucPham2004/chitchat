import { useState, useEffect } from 'react';
import { MessageCircle, Phone, User, Users, Moon, Sun, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Particle } from '../components/common/Particle';
import { FeatureSection } from '../components/common/FeatureSection';
import { ROUTES } from '../utilities/Constants';
import { useAuth } from '../utilities/AuthContext';
import useDeviceTypeByWidth from '../utilities/DeviceType';
import instance from '../services/Axios-customize';
import { ApiResponse } from '../types/backend';

interface AccessTokenResponse {
  access_token: string;
}

export default function ChitChatWelcome() {
  const { user } = useAuth();
  const deviceType = useDeviceTypeByWidth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const refreshTokenAndNavigate = async () => {
      try {
        const res = await instance.get<ApiResponse<AccessTokenResponse>>('/auth/refresh');
        if (res && res.data) {
          if (!user) return;
          if (deviceType === 'Mobile') {
            navigate(ROUTES.MOBILE.CONVERSATIONS);
          } else {
            navigate(ROUTES.DESKTOP.PROFILE(user.user.id), { replace: true });
          }
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }
    };

    refreshTokenAndNavigate();
  }, [deviceType, user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChitChat
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-6 py-2 text-sky-500 hover:text-blue-600 transition font-medium">
              <a
                href={ROUTES.AUTH.LOGIN}
              >
                Đăng nhập
              </a>
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-medium">
              <a
                href={ROUTES.AUTH.REGISTER}
              >
                Đăng ký
              </a>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i} />
        ))}
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Kết nối năm châu bốn bể
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm nhắn tin thời gian thực với những tính năng hiện đại và giao diện thân thiện
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-xl text-lg font-medium hover:shadow-2xl hover:scale-105 transition duration-300">
              <a
                href={ROUTES.AUTH.LOGIN}
              >
                Bắt đầu ngay
              </a>
            </button>
            
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Feature: Real-time Chat */}
      <FeatureSection
        title="Chat Thời Gian Thực"
        description="Trò chuyện ngay lập tức với bạn bè, gia đình và đồng nghiệp. Tin nhắn được gửi và nhận trong tích tắc với công nghệ WebSocket hiện đại."
        icon={Zap}
        image={
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-md ml-auto max-w-xs">
              <p className="text-sm text-gray-800">Hôm nay bạn thế nào? 😊</p>
              <span className="text-xs text-gray-400">14:23</span>
            </div>
            <div className="bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-2xl p-4 shadow-md max-w-xs">
              <p className="text-sm">Mình vẫn ổn! Cảm ơn bạn nhé 🎉</p>
              <span className="text-xs text-blue-100">14:24</span>
            </div>
          </div>
        }
        bgColor="bg-white"
      />

      {/* Feature: Voice & Video Calls */}
      <FeatureSection
        title="Gọi Điện & Video Call"
        description="Kết nối bằng giọng nói và hình ảnh với chất lượng HD. Trò chuyện trực tiếp với người thân dù ở bất kỳ đâu trên thế giới."
        icon={Phone}
        image={
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nguyễn Văn A</h3>
                <p className="text-sm text-blue-100">Đang gọi...</p>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
            </div>
          </div>
        }
        reverse
        bgColor="bg-gradient-to-br from-blue-50 to-purple-50"
      />

      {/* Feature: User Profile */}
      <FeatureSection
        title="Hồ Sơ Cá Nhân"
        description="Tùy chỉnh hồ sơ của bạn với ảnh đại diện, trạng thái và thông tin cá nhân. Thể hiện bản thân theo cách riêng của bạn."
        icon={User}
        image={
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                A
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nguyễn Văn A</h3>
              <p className="text-sm text-gray-500">🌟 Đang hoạt động</p>
              <div className="flex gap-3 pt-4">
                <div className="px-4 py-2 bg-blue-50 rounded-lg text-sm text-blue-600 font-medium">
                  123 Bạn bè
                </div>
                <div className="px-4 py-2 bg-purple-50 rounded-lg text-sm text-purple-600 font-medium">
                  45 Nhóm
                </div>
              </div>
            </div>
          </div>
        }
        bgColor="bg-white"
      />

      {/* Feature: Friends Management */}
      <FeatureSection
        title="Quản Lý Bạn Bè"
        description="Kết nối và quản lý danh sách bạn bè dễ dàng. Tìm kiếm, thêm mới và tổ chức bạn bè theo nhóm riêng của bạn."
        icon={Users}
        image={
          <div className="space-y-3">
            {['Trần Thị B', 'Lê Văn C', 'Phạm Thị D'].map((name, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {name[0]}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{name}</h4>
                  <p className="text-xs text-gray-500">Đang hoạt động</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        }
        reverse
        bgColor="bg-gradient-to-br from-purple-50 to-blue-50"
      />

      {/* Feature: Dark Mode */}
      <FeatureSection
        title="Chế Độ Sáng/Tối"
        description="Bảo vệ đôi mắt của bạn với chế độ tối. Chuyển đổi linh hoạt giữa giao diện sáng và tối theo sở thích và thời gian trong ngày."
        icon={Moon}
        image={
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Sáng</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 shadow-md border-2 border-purple-500">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Tối</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        }
        bgColor="bg-white"
      />

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <Particle key={i} delay={i} />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 text-white">
          <h2 className="text-5xl font-bold">Sẵn sàng bắt đầu?</h2>
          <p className="text-xl opacity-90">
            Tham gia cùng hàng triệu người dùng đang sử dụng ChitChat để kết nối mỗi ngày
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-medium hover:shadow-2xl hover:scale-105 transition duration-300">
              <a
                href={ROUTES.AUTH.REGISTER}
              >
              Tạo tài khoản miễn phí
              </a>
            </button>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ChitChat</span>
              </div>
              <p className="text-sm">Kết nối không giới hạn với ChitChat</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Tính năng</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Bảng giá</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Tải ứng dụng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Công ty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Liên hệ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Tuyển dụng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Bảo mật</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 ChitChat. Đã đăng ký bản quyền. (Fake)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}