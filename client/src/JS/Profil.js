import React, { useState } from "react";
import "../CSS/Profil.css";
import TweetList from "../JS/TweetList";
import {  Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Profil({_id}) {
    
    const [mode, setMode] = useState('profilTweets');
    const {userName} = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const token = Cookies.get('token');

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
        .then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
        })
        .catch((error) => console.log(error));
    });

    return <div className="Profil">
        <div className="top" style={{border: 'none'}}>
            <div className="profil">
                <p>{firstName}</p>
                <p>{lastName}</p>
                <p>{userName}</p>
            </div>
        </div>
        <div className="choiceCategorie">
            <div className="tweetChoice choicePart" onClick={() => setMode('profilTweets')}>
                <Link to={`/accueil/profil/${userName}`} className="link-menu">
                    <div style={{borderBottom: mode==='profilTweets' ? 'var(--blue-color) solid 3px' : 'none'}}>
                        Tweets
                    </div>
                </Link>
            </div>
            <div className="likeChoice choicePart" onClick={() => setMode('profilLikes')}>
                <Link to={`/accueil/profil/${userName}/likes`} className="link-menu">
                    <div style={{borderBottom: mode==='profilLikes' ? 'var(--blue-color) solid 3px' : 'none'}}>
                        J'aime
                    </div>
                </Link>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<TweetList userName={userName} _id={_id} mode='profilTweets'></TweetList>}/>
            <Route path="/likes" element={<TweetList userName={userName} _id={_id} mode='profilLikes'></TweetList>}/>
        </Routes>
    </div>;
}
export default Profil;