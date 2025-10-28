import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Friends from '../components/profile/Friends';
import Profile from '../components/profile/Profile';
import UpdateProfile from '../components/profile/UpdateProfile';
import ErrorPage from '../views/ErrorPage';
import ChatView from '../views/ChatView';
import LoginView from '../views/auth/LoginView';
import ProfileView from '../views/ProfileView';
import RegisterView from '../views/auth/RegisterView';
import CallView from '../views/CallView';
import LayoutDesktop from '../views/LayoutDesktop';
import LayoutMobile from '../views/LayoutMobile';
import Conversations from '../components/chatview/conversations/Conversations';
import ForgotPassword from '../views/auth/ForgotPassword';
import ResetPassword from '../views/auth/ResetPassword';
import HomePage from '../views/HomePage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/d" element={<LayoutDesktop />}>
          <Route path="conversations/:conv_id" element={<ChatView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path="/mobile" element={<LayoutMobile />}>
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:conv_id" element={<ChatView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path="login" element={<LoginView />} />
        <Route path="register" element={<RegisterView />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        
        <Route path="call" element={<CallView />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
