import HomeView from './views/HomeView';
import ErrorPage from './views/ErrorPage';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <HomeView />,
	  errorElement: <ErrorPage />,
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
