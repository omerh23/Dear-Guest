import React, { useState } from 'react';
import './styles.css';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {

    const [userId, setUserId] = useState('');
    const [detailMessage, setDetailMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [list] = useState({aleyZahv:"אולפנת עלי זהב",shiratHannan:"שירת חנן"});
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const navigate = useNavigate();


    function handleId(event) {
        setUserId(event.target.value);
    }

    const handleClick = async () => {
        setLoading(true);
        setDetailMessage("");

        if (!selectedInstitution) {
            setDetailMessage("בחר מוסד לפני המשך");
            setLoading(false);
            return;
        }
        if (userId.length !== 9) {
            console.log("ID should be 9 digits long");
            setDetailMessage("אנא הקש מס' תז בן 9 ספרות");
            setLoading(false);
        } else {
            try {
                const res = await axios.post('https://dearguest-backend.onrender.com/login', { id: userId, institution: selectedInstitution });
                setDetailMessage(res.data);
                console.log(res.data);
                if (res.data.status === 'success') {
                    navigate("/home", { state: { username: res.data.username,userId: userId,isAdmin: res.data.isAdmin} });
                }

            } catch (error) {
                console.error("Login error", error);
                setDetailMessage("Login failed");
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInstitutionChange = (event) => {
        setSelectedInstitution(event.target.value);
        console.log(selectedInstitution)
    };

    return (


        <div className="loginContainer">
            <h1 className="Login-header">כניסה לשירות</h1>
            <div className="center-field">

                <form>
                    <select className="signin-field"
                        value={selectedInstitution}
                        onChange={handleInstitutionChange}

                    >
                        <option value="" disabled>בחר מוסד</option>
                        {Object.entries(list).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>

                        ))}
                    </select>


                    <br/>
                    <br/>
                    <input placeholder="הכנס ת''ז" className="signin-field" type="text" value={userId} onChange={handleId} required />
                   <br/>
                    <Button
                        className="signin-button"
                        variant="primary"
                        disabled={isLoading}
                        onClick={!isLoading ? handleClick : null}
                    >
                        {isLoading ? 'טוען...' : 'אישור'}
                    </Button>
                </form>
                <div className="Details-message">{detailMessage}</div>
            </div>
        </div>
    );
}

export default Login;
