import React, {useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import he from 'date-fns/locale/he'; // Import Hebrew locale from date-fns

registerLocale('he', he)



const Home = () => {
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState([]);
    const [meetingButton, setMeetingButton] = useState(false);
    const [guestName,setGuestName] = useState('');
    const [hourArrive, setHourArrive] = useState('');
    const [detailMessage, setDetailMessage] = useState('');
    const [endMeetingPop, setEndMeetingPop] = useState(false);
    const [meetingId,setMeetingId] = useState(null);
    const [startDate, setStartDate] = useState(new Date());


    useEffect(  () => {
        async function meetingLists(){
            const getMeetings =  await axios.post('http://localhost:8000/meetingsList');
            setMeeting(getMeetings.data);
        }
        meetingLists();
    },[]);





    function HandleLogout() {
        navigate('/');
    }
    function HandleMeetingButton() {
        setMeetingButton(!meetingButton);
    }

    async function HandleAddMeeting() {
        if (!guestName.trim() || !hourArrive.trim()) {
            // Handle the case where one or both fields are empty
            setDetailMessage('יש למלא את כל השדות');
            return;
        }

        setDetailMessage('');
        const newMeeting = {
            guestName: guestName,
            arrivalTime: hourArrive,
            date: startDate
        };

        const res = await axios.post('http://localhost:8000/addMeeting',{newMeeting});
        console.log(res.data)
        if (res.data === 'success'){
            setMeeting([...meeting, newMeeting]);

        }
        else{
            setDetailMessage('failed');
        }
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

    async function HandleEndMeeting(meetingDetails) {
        const res = await axios.post('http://localhost:8000/finishMeeting', {meetingDetails});
        console.log(res.data)
        if (res.data === 'success') {
            setMeeting(prevMeeting => prevMeeting.filter(item => item !== meetingDetails));

        }

        setEndMeetingPop(false);
        setMeetingId(null);

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
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                locale="hebrew"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()} // Set minDate to the current date
                                className="meeting-field"
                            />
                            <Button onClick={HandleAddMeeting} className="meeting-button">הוסף</Button>
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
                                        <Button className="meeting-details-button" style={{background:"green"}} onClick={() =>
                                        {setEndMeetingPop(true); setMeetingId(index)}}
                                        >סיים פגישה</Button>
                                        {/*<Button className="meeting-details-button" style={{background:"green"}}>פגישה התקיימה</Button>*/}
                                        <p>שעת הגעה: {meetingItem.arrivalTime}</p>
                                        <p>שם האורח: {meetingItem.guestName}</p>
                                        <p>תאריך: {format(new Date(meetingItem.date), 'dd/MM/yy')}</p>

                                    </div>

                                    {endMeetingPop && meetingId === index && (
                                        <div className="end-meeting-pop">
                                            <p>האם אתה רוצה לסיים פגישה זו</p>
                                            <Button className="meeting-details-button" style={{background:"green"}} onClick={() => HandleEndMeeting(meetingItem)}
                                            >כן</Button>
                                            <Button className="meeting-details-button" style={{background:"red"}} onClick={() => setEndMeetingPop(false)}
                                            >לא</Button>

                                        </div>
                                    )}
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
