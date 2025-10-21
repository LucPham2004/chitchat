import { useAuth } from './utilities/AuthContext';
import { useEffect } from 'react';
import Router from './utilities/Routers';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if(!user) {
      window.location.href = "/login";
    }
  }, [])

  return (
    <Router />
  );
}

export default App;
