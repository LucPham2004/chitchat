
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeView from './views/HomeView';
import ErrorPage from './views/ErrorPage';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import Conversations from './components/homeview/conversations/Conversations';
import ChatAndInfo from './components/homeview/chat-info/ChatAndInfo';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <HomeView />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <Conversations />
        },{
          path: '',
          element: <ChatAndInfo />
        },
      ]
    },
    {
      path: 'login',
      element: <LoginView />,
    },
    {
      path: 'register',
      element: <RegisterView />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
