import React, { useState } from "react";
import "../CSS/Profil.css";
import TweetList from "../JS/TweetList";
import {  Route, Routes, Link } from 'react-router-dom';

function Profil({userName, email, firstName, lastName, _id}) {
    
    const [mode, setMode] = useState('profilTweets');

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
                <Link to="/accueil/profil/" className="link-menu">
                    <div style={{borderBottom: mode==='profilTweets' ? 'var(--blue-color) solid 3px' : 'none'}}>
                        Tweets
                    </div>
                </Link>
            </div>
            <div className="likeChoice choicePart" onClick={() => setMode('profilLikes')}>
                <Link to="/accueil/profil/likes" className="link-menu">
                    <div style={{borderBottom: mode==='profilLikes' ? 'var(--blue-color) solid 3px' : 'none'}}>
                        J'aime
                    </div>
                </Link>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<TweetList email={email} _id={_id} mode='profilTweets'></TweetList>}/>
            <Route path="/likes" element={<TweetList email={email} _id={_id} mode='profilLikes'></TweetList>}/>
        </Routes>
    </div>;
}
export default Profil;