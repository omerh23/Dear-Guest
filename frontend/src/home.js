import React, {useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import logo from './logoDg.png';



const Home = () => {
    const location = useLocation();
    const username = location.state.username ? location.state.username : null ;
    const userId = location.state.userId;
    const isAdmin = location.state.isAdmin ? location.state.isAdmin : false;
    const institution = location.state.institution;
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState([]);
    const [meetingButton, setMeetingButton] = useState(false);
    const [employeeButton, setEmployeeButton] = useState(false);

    const [guestName,setGuestName] = useState('');
    const [employeeName,setEmployeeName] = useState('');
    const [employeeId,setEmployeeId] = useState('');

    const [detailMessage, setDetailMessage] = useState('');
    const [employeeDetailMessage, setEmployeeDetailMessage] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [endMeetingPop, setEndMeetingPop] = useState(false);
    const [meetingId,setMeetingId] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    async function meetingLists() {
        const getMeetings = await axios.post('https://dearguest-backend.onrender.com/meetingsList',{institution});

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
    }, [meeting]);






    function HandleLogout() {
        navigate('/');
    }
    function HandleMeetingButton() {
        setEmployeeButton(false);
        setMeetingButton(!meetingButton);
        setEmployeeDetailMessage('');
    }


    async function HandleAddMeeting() {
        if (!guestName.trim() || !selectedTime) {
            setDetailMessage('יש למלא את כל השדות בצורה תקינה');
            return;
        }

        setIsLoading(true);

        setDetailMessage('');
        const formattedDate = format(startDate, 'dd/MM/yyyy');

        const newMeeting = {
            guestName: guestName,
            arrivalTime: selectedTime,
            date: formattedDate,
            userId: userId,
            username:username
        };

        const res = await axios.post('https://dearguest-backend.onrender.com/addMeeting', { newMeeting,institution });
        setIsLoading(false);

        if (res.data === 'success') {
            setMeeting([...meeting, newMeeting]);
        } else {
            setDetailMessage('failed');
        }

        // Clear the input fields
        setGuestName('');
        setSelectedTime('');
    }



    function HandleGuestName(event) {
        setGuestName(event.target.value);
    }
    function HandleEmployeeName(event) {
        setEmployeeName(event.target.value);
    }
    function HandleEmployeeId(event) {
        setEmployeeId(event.target.value);
    }

    async function HandleEndMeeting(meetingDetails) {
        const res = await axios.post('https://dearguest-backend.onrender.com/finishMeeting', {meetingDetails,institution});
        console.log(res.data)
        if (res.data === 'success') {
            setMeeting(prevMeeting => prevMeeting.filter(item => item !== meetingDetails));

        }

        setEndMeetingPop(false);
        setMeetingId(null);

    }


    function HandleEmployeeButton() {
        setMeetingButton(false);
        setEmployeeButton(!employeeButton);
        setEmployeeDetailMessage('');
        setEmployeeName('');
        setEmployeeId('');
    }

    async function HandleAddEmployee() {
        if (!employeeName.trim() || employeeId.length !== 9) {
            // Handle the case where one or both fields are empty or the pattern is not valid
            setEmployeeDetailMessage('יש למלא את כל השדות בצורה תקינה');
            return;
        }

        setIsLoading(true);

        setEmployeeDetailMessage('');

        const newEmployee = {
            userId: employeeId,
            username: employeeName,
            isAdmin: false
        };

        const res = await axios.post('https://dearguest-backend.onrender.com/addEmployee', {newEmployee, institution});
        setIsLoading(false);
        if (res.data === 'success') {
            setEmployeeDetailMessage('העובד התווסף בהצלחה');
        }
        else if(res.data === 'exist'){
                setEmployeeDetailMessage('מספר הזהות קיים במערכת');

        } else {
            setEmployeeDetailMessage('העובד לא התווסף למאגר');
        }

        setEmployeeName('');
        setEmployeeId('');
    }

    const handleTimeChange = (event) => {
        // Update the state with the selected time
        setSelectedTime(event.target.value);
        console.log(selectedTime);
    };
    return (
        <div className="container">
            <div className="side-bar">
                <div className="logo-container">
                    <img className="logo-img" src={logo} alt="Logo" />
                </div>
                <p>שלום, {username}</p>
                <Button className="logout-button" onClick={HandleLogout}>
                    התנתק
                </Button>
            </div>

            <div className="home-container">
                <h1>יומן פגישות</h1>

                <Button className="meeting-button" onClick={HandleMeetingButton}>
                    הוסף פגישה
                </Button >
                {isAdmin && (
                    <>
                        <Button className="meeting-button" onClick={HandleEmployeeButton}>
                            הוסף עובד למאגר
                        </Button>
                        {employeeButton && (
                            <div className="add-meeting">
                                <input className="meeting-field" placeholder="שם העובד" type="text" value={employeeName} onChange={HandleEmployeeName} required />
                                <input className="meeting-field" placeholder="תעודת זהות" type="number" value={employeeId} onChange={HandleEmployeeId} required />
                                <Button disabled={isLoading} onClick={HandleAddEmployee} className="meeting-button">{isLoading ? 'טוען...'  :  'הוסף'}</Button>
                            </div>
                        )}
                    </>
                )}
                {employeeDetailMessage}
                <div className="add-meeting">
                    {meetingButton && (
                        <>
                            <input className="meeting-field" placeholder="שם האורח" type="text" value={guestName} onChange={HandleGuestName} required />
                            <input
                                type="time"
                                id="timeInput"
                                name="timeInput"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                className="time-field"
                            />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()} // Set minDate to the current date
                                className="meeting-field"
                            />

                            <Button disabled={isLoading} onClick={HandleAddMeeting} className="meeting-button">{isLoading ? 'טוען...'  :  'הוסף'}</Button>
                        </>
                        )}

                </div>
                {detailMessage}

                <div className="meetings-result">
                    <ul className="meeting-list">
                        {meeting.map((meetingItem, index) => (
                            (meetingItem.userId === userId || isAdmin) && (

                                <li key={index} className="meeting-content">
                                    <div className="meeting-details">
                                        <Button
                                            className="meeting-details-button"
                                            onClick={() => {
                                                setEndMeetingPop(true);
                                                setMeetingId(index);
                                            }}
                                        >
                                            סיים פגישה
                                        </Button>
                                        <p className="meeting-text">שעת הגעה: {meetingItem.arrivalTime}</p>
                                        <p className="meeting-text">מגיע אל: {meetingItem.username}</p>
                                        <p className="meeting-text">שם האורח: {meetingItem.guestName}</p>
                                        <p className="meeting-text">תאריך: {meetingItem.date}</p>
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



            </div>
        </div>
    );
};

export default Home;
