import React, { useState } from "react";
import '../CSS/Accueil.css';
// import { useLocation } from "react-router-dom";
import {  Route, Routes } from 'react-router-dom';
import Tache from "./Tache";
import File from "./File";
import Trend from "./Trends";
import Profil from "./Profil";
import FullTweet from "./FullTweet";
import EditProfil from "./EditProfil";
import Cookies from 'js-cookie';
import axios from 'axios';
import MailBoxFull from "./MailBoxFull";
import PeopleList from "./PeopleList";

function Accueil() {
    const _id = Cookies.get('userID');
    const [userName, setUserName] = useState('');

    React.useEffect(() => {
        axios.get(`/user/getUser/${Cookies.get('userID')}`, { headers: {authorization: 'Bearer ' + Cookies.get('token')}})
            .then((response) => {
                setUserName(response.data.userName);
            })
            .catch((error) => console.log(error))
    }, []);

    return <div className="Accueil">
        <Tache userName={userName}></Tache>
        <Routes>
            <Route path="/" element={<File _id={_id}></File>}/>
            <Route path="/profil/:userName/*" element={<Profil _id={_id}></Profil>}/>
            <Route path="/profil/:userName/status/:tweetID" element={<FullTweet/>}/>
            <Route path="/profil/:userName/editProfil" element={<EditProfil/>}/>
            <Route path="/profil/:userName/following" element={<PeopleList _id={_id}/>}/>
            <Route path="/profil/:userName/followers" element={<PeopleList/>}/>
            <Route path="/messages/:userName" element={<MailBoxFull _id={_id}/>}/>
        </Routes>
        <Trend></Trend>
    </div>
} 
export default Accueil;
