import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



const Home = () => {
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState([]);
    const [meetingButton, setMeetingButton] = useState(false);
    const [guestName,setGuestName] = useState('');
    const [hourArrive, setHourArrive] = useState('');
    const [detailMessage, setDetailMessage] = useState('');

    function HandleLogout() {
        navigate('/');
    }
    function HandleMeetingButton() {
        setMeetingButton(!meetingButton);
    }

    function HandleAddMeeting() {
        if (!guestName.trim() || !hourArrive.trim()) {
            // Handle the case where one or both fields are empty
            setDetailMessage('יש למלא את כל השדות');
            return;
        }
        setDetailMessage('');
        const newMeeting = {
            guestName: guestName,
            arrivalTime: hourArrive
        };

        // Update the meeting state
        setMeeting([...meeting, newMeeting]);

        // Clear the input fields
        setGuestName('');
        setHourArrive('');
    }



    function HandleHourArrive(event) {
        setHourArrive(event.target.value);
    }

    function HandleGuestName(event) {
        setGuestName(event.target.value);
    }

    return (
        <div>
            <Button className="logout-button" onClick={HandleLogout}>
                התנתק
            </Button>

            <div className="home-container">
                <h1>מפגשים</h1>

                <Button className="meeting-button" onClick={HandleMeetingButton}>
                    הוסף פגישה
                </Button >
                <div className="add-meeting">
                    {meetingButton && (
                        <>
                            <input className="meeting-field" placeholder="שם האורח" type="text" value={guestName} onChange={HandleGuestName} required />
                            <input className="meeting-field" placeholder="שעת הגעה" type="text" value={hourArrive} onChange={HandleHourArrive} required />
                            <Button onClick={HandleAddMeeting}>הוסף</Button>
                        </>


                        )}
                </div>
                {detailMessage}
                <h2>פגישות להיום</h2>

                {meeting.length > 0 ? (

                    <div className="meetings-result">
                        <ul className="meeting-list">
                            {meeting.map((meetingItem, index) => (
                                <li key={index} className="meeting-content">
                                    <div className="meeting-details">
                                        <p>שעת הגעה: {meetingItem.arrivalTime}</p>
                                        <p>שם האורח: {meetingItem.guestName}</p>

                                        {/* Add other details as needed */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>


                ) : (
                    <p>אין פגישות נכון לרגע זה</p>
                )}
            </div>
        </div>
    );
};

export default Home;
