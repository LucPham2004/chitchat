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
import { ROUTES } from './Constants';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.DESKTOP.ROOT} element={<LayoutDesktop />}>
          <Route path="conversations/:conv_id" element={<ChatView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path={ROUTES.MOBILE.ROOT} element={<LayoutMobile />}>
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:conv_id" element={<ChatView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path={ROUTES.AUTH.LOGIN} element={<LoginView />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<RegisterView />} />
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />

        <Route path={ROUTES.CALL} element={<CallView />} />
        <Route path={ROUTES.ERROR} element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
