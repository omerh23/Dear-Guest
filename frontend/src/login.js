import React, { useEffect, useState } from 'react';
import './styles.css';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";

function Login() {

    const [userId, setUserId] = useState('');
    const [detailMessage, setDetailMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [list, setList] = useState({aleyzahav:"עלי זהב",shiratHannan:"שירת חנן"});
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);


    function handleId(event) {
        setUserId(event.target.value);
    }

    const handleClick = async () => {
        setLoading(true);
        setDetailMessage("");

        if (userId.length < 9) {
            console.log("ID should be 9 digits long");
            setDetailMessage("אנא הקש מס' תז בן 9 ספרות");
            setLoading(false);
        } else {
            try {
                const res = await axios.post('http://localhost:8000/login', { id: userId, institution: selectedInstitution });
                setDetailMessage(res.data);
            } catch (error) {
                console.error("Login error", error);
                setDetailMessage("Login failed");
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        }
    };
    const institutionOptions = Object.values(list);

    const handleInstitutionChange = (event) => {
        setSelectedInstitution(event.target.value);
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
                    <input placeholder="הכנס תז" className="signin-field" type="text" value={userId} onChange={handleId} required />
                   <br/>
                    <Button
                        className="signin-button"
                        variant="primary"
                        disabled={isLoading}
                        onClick={!isLoading ? handleClick : null}
                    >
                        {isLoading ? '...טוען' : 'אישור'}
                    </Button>
                </form>
                <div className="Details-message">{detailMessage}</div>
            </div>
        </div>
    );
}

export default Login;
