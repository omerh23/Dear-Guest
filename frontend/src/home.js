import React, {useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';



const Home = () => {
    const location = useLocation();
    const username = location.state.username ? location.state.username : null ;
    const userId = location.state.userId;
    const isAdmin = location.state.isAdmin ? location.state.isAdmin : false;
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState([]);
    const [meetingButton, setMeetingButton] = useState(false);
    const [guestName,setGuestName] = useState('');
    const [hourArrive, setHourArrive] = useState('');
    const [minutesArrive, setMinutesArrive] = useState('');
    const [detailMessage, setDetailMessage] = useState('');
    const [endMeetingPop, setEndMeetingPop] = useState(false);
    const [meetingId,setMeetingId] = useState(null);
    const [startDate, setStartDate] = useState(new Date());


    async function meetingLists() {
        const getMeetings = await axios.post('http://localhost:8000/meetingsList');

        const sortMeetings = [...getMeetings.data].sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);

            if (yearA !== yearB) {
                return yearA - yearB;
            }

            if (monthA !== monthB) {
                return monthA - monthB;
            }

            if (dayA !== dayB) {
                return dayA - dayB;
            }

            const [hourA, minutesA] = a.arrivalTime.split(':').map(Number);
            const [hourB, minutesB] = b.arrivalTime.split(':').map(Number);

            if (hourA !== hourB) {
                return hourA - hourB;
            }

            return minutesA - minutesB;
        });

        setMeeting(sortMeetings);
    }


    useEffect(() => {
        meetingLists();
    }, []);






    function HandleLogout() {
        navigate('/');
    }
    function HandleMeetingButton() {
        setMeetingButton(!meetingButton);
    }

    function validateTimeFormat(hours, minutes) {
        const hoursValid = /^[0-9]{1,2}$/.test(hours) && hours >= 0 && hours <= 23;
        const minutesValid = /^[0-9]{1,2}$/.test(minutes) && minutes >= 0 && minutes <= 59;
        return hoursValid && minutesValid;
    }


    async function HandleAddMeeting() {
        if (!guestName.trim() || !validateTimeFormat(hourArrive, minutesArrive)) {
            // Handle the case where one or both fields are empty or the pattern is not valid
            setDetailMessage('יש למלא את כל השדות בצורה תקינה');
            return;
        }

        setDetailMessage('');

        // Format hours and minutes with leading zeros
        const formattedHours = hourArrive.padStart(2, '0');
        const formattedMinutes = minutesArrive.padStart(2, '0');
        const formattedDate = format(startDate, 'dd/MM/yyyy');

        const newMeeting = {
            guestName: guestName,
            arrivalTime: `${formattedHours}:${formattedMinutes}`,
            date: formattedDate,
            userId: userId
        };

        const res = await axios.post('http://localhost:8000/addMeeting', { newMeeting });
        console.log(res.data);
        if (res.data === 'success') {
            setMeeting([...meeting, newMeeting]);
        } else {
            setDetailMessage('failed');
        }

        // Clear the input fields
        setGuestName('');
        setHourArrive('');
        setMinutesArrive('');
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


    function HandleMinutesArrive(event) {
        setMinutesArrive(event.target.value);

    }

    return (
        <div>
            <p className="username">שלום, {username}</p>
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
                            <input className="hour-meeting-field" type="number" min="00" max="59" placeholder="דקה"  value={minutesArrive} onChange={HandleMinutesArrive} required />
                            <p>:</p>
                            <input className="hour-meeting-field" type="number" min="00" max="23" placeholder="שעה"  value={hourArrive} onChange={HandleHourArrive} required />

                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()} // Set minDate to the current date
                                className="meeting-field"
                            />
                            <Button onClick={HandleAddMeeting} className="meeting-button">הוסף</Button>
                        </>
                        )}

                </div>
                {detailMessage}
                <h2>יומן פגישות</h2>
                {meeting.length > 0 ? (
                    <div className="meetings-result">
                        <ul className="meeting-list">
                            {meeting.map((meetingItem, index) => (
                                (meetingItem.userId === userId || isAdmin) && (

                                        <li key={index} className="meeting-content">
                                                <div className="meeting-details">
                                                    <Button
                                                        className="meeting-details-button"
                                                        style={{ background: "green" }}
                                                        onClick={() => {
                                                            setEndMeetingPop(true);
                                                            setMeetingId(index);
                                                        }}
                                                    >
                                                        סיים פגישה
                                                    </Button>
                                                    <p>שעת הגעה: {meetingItem.arrivalTime}</p>
                                                    <p>שם האורח: {meetingItem.guestName}</p>
                                                    <p>תאריך: {meetingItem.date}</p>
                                                </div>

                                            {endMeetingPop && meetingId === index && (
                                                <div className="end-meeting-pop">
                                                    <p>האם אתה רוצה לסיים פגישה זו</p>
                                                    <Button
                                                        className="meeting-details-button"
                                                        style={{ background: "green" }}
                                                        onClick={() => HandleEndMeeting(meetingItem)}
                                                    >
                                                        כן
                                                    </Button>
                                                    <Button
                                                        className="meeting-details-button"
                                                        style={{ background: "red" }}
                                                        onClick={() => setEndMeetingPop(false)}
                                                    >
                                                        לא
                                                    </Button>
                                                </div>
                                            )}
                                        </li>
                                )
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
