import { useState, useEffect } from 'react';
import * as API from './utils/api';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await API.getUsers();
        console.log("Result", result.data) 
        setUser(result.data);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    loadData();
    console.log("user", user) 
  }, []);

  return (
    <>
      <h1>Hello, {user?.name}</h1>
    </>
  );
}

export default App;