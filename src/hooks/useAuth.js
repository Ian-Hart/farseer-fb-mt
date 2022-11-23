import {useState, useEffect} from "react";
import { checkAuth } from "../firebase";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
   useEffect(() => {
      checkAuth(user => {
        setLoading(false);
        setUser(user);
      });
    }, []);

    return {user, loading};
}

export default useAuth;
