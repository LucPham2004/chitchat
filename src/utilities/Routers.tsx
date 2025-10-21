import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Friends from '../components/profile/Friends';
import Profile from '../components/profile/Profile';
import UpdateProfile from '../components/profile/UpdateProfile';
import ErrorPage from '../views/ErrorPage';
import HomeView from '../views/HomeView';
import LoginView from '../views/LoginView';
import ProfileView from '../views/ProfileView';
import RegisterView from '../views/RegisterView';
import CallView from '../views/CallView';
import LayoutDesktop from '../views/LayoutDesktop';
import LayoutMobile from '../views/LayoutMobile';
import Conversations from '../components/homeview/conversations/Conversations';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutDesktop />}>
          <Route path="conversations/:conv_id" element={<HomeView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path="/mobile" element={<LayoutMobile />}>
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:conv_id" element={<HomeView />} />
          <Route path="profile/:user_id_param" element={<ProfileView />}>
            <Route index element={<Profile />} />
            <Route path="friends" element={<Friends />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route path="login" element={<LoginView />} />
        <Route path="register" element={<RegisterView />} />
        <Route path="call" element={<CallView />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
