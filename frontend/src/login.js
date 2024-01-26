import React, { useEffect, useState } from 'react';
import './styles.css';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Combobox from "react-widgets/Combobox";

function Login() {

    const [userId, setUserId] = useState('');
    const [detailMessage, setDetailMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState("");

    // Adjusted useEffect hook
    useEffect(() => {
        async function fetchInstitutionList() {
            try {
                const res = await axios.post('http://localhost:8000/institutionList');
                setList(res.data);
                console.log("list from server",res.data);
            } catch (error) {
                console.error("Error fetching institution list", error);

            }
        }

        fetchInstitutionList();
    }, []);

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

    return (
        <div className="loginContainer">
            <h1 className="Login-header">כניסה לשירות</h1>
            <div className="center-field">
                <form>
                    <Combobox
                        data={list}
                        value={selectedInstitution}
                        onChange={(value) => setSelectedInstitution(value)}
                        placeholder="בחר מוסד"
                    />

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
