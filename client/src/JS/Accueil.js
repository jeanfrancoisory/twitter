import React, { useState } from "react";
import '../CSS/Accueil.css';
// import { useLocation } from "react-router-dom";
import {  Route, Routes } from 'react-router-dom';
import Tache from "./Tache";
import File from "./File";
import Trend from "./Trends";
import Profil from "./Profil";
import Cookies from 'js-cookie';
import axios from 'axios';

function Accueil() {
    // const location = useLocation();
    // const [element, setElement] = useState(<File email={email} firstName={firstName} lastName={lastName} _id={_id}></File>);
    const _id = Cookies.get('userID');
    const token = Cookies.get('token');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');

    React.useEffect(() => {
        axios.get(`/user/getUser/${_id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                setEmail(response.data.email);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setUserName(response.data.userName);
            })
            .catch((error) => console.log(error))
    }, []);

    // function sendInfo(info) {
    //     // setElement(info);
    //     switch (info) {
    //         case 'Home':
    //             setElement(
    //             <File email={email} firstName={firstName} lastName={lastName} _id={_id}></File>
    //             );
    //             break;
    //         case 'Profil':
    //             setElement(<Profil email={email} firstName={firstName} lastName={lastName} _id={_id}></Profil>);
    //             break;
    //         default :
    //             setElement(<File email={email} firstName={firstName} lastName={lastName} _id={_id}></File>);
    //             break;
    //     }
    // }

    return <div className="Accueil">
        <Tache userName={userName}></Tache>
        <Routes>
            <Route path="/" element={<File userName={userName} email={email} firstName={firstName} lastName={lastName} _id={_id}></File>}/>
            <Route path="/profil/:userName/*" element={<Profil _id={_id}></Profil>}/>
        </Routes>
        <Trend></Trend>
    </div>
} 
export default Accueil;