import React, {useEffect, useState} from 'react';
import './styles.css';
import Button from 'react-bootstrap/Button';
import axios from "axios";



function Login() {

    const [userId, setUserId] = useState('');
    const [detailMessage, setDetailMessage] = useState("")
    const [isLoading, setLoading] = useState(false);

    // useEffect(() => {
    //     function simulateNetworkRequest() {
    //         return new Promise((resolve) => setTimeout(resolve, 2000));
    //     }
    //
    //     if (isLoading) {
    //         simulateNetworkRequest().then(() => {
    //             setLoading(false);
    //         });
    //     }
    // }, [isLoading]);
    function handleId(event) {
        setUserId(event.target.value);
    }

     const  handleClick = async () => {
        setLoading(true);
        setDetailMessage("");

        console.log("submit enter");

        if (userId.length < 9) {
            console.log("ID should be 9 digits long");
            setDetailMessage("אנא הקש מס' תז בן 9 ספרות");
            setLoading(false);


        } else {
            const res = await axios.post('http://localhost:8000/login',{id: userId});
            setLoading(false);
            setDetailMessage(res.data);
            console.log(res);
        }
    };


    return (
        <div className="loginContainer">
            <h1 className="Login-header">כניסה לשירות</h1>
                <div className="center-field">
                    <form>
                        <p className="fonts">הכנס ת"ז</p>
                        <Button
                            className="signin-button"
                            variant="primary"
                            disabled={isLoading}
                            onClick={!isLoading ? handleClick : null}
                        >
                            {isLoading ? '...טוען' : 'אישור'}
                        </Button>
                        <input className="signin-field" type="text" value={userId} onChange={handleId} required />
                    </form>
                   <div className="Details-message">{detailMessage}</div>
                </div>

        </div>
    );
}

export default Login;
