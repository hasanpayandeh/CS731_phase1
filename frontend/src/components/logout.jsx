import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('user', '');
        window.location.replace("/");
    }, [])
}

export default Logout;