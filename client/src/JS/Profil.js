import React, { useState } from "react";
import "../CSS/Profil.css";
import TweetList from "../JS/TweetList";
import {  Route, Routes, Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Profil({_id}) {
    
    const [mode, setMode] = useState('profilTweets');
    const {userName} = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [thisID, setThisID] = useState('');
    const [profilPicture, setProfilPicture] = useState(null);
    const [isCurrentUserSub, setIsCurrentUserSub] = useState(false);
    const token = Cookies.get('token');
    const currentUserName = Cookies.get('userName');
    const location = useLocation();

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
        .then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setThisID(response.data._id);
            response.data.profilImage ? setProfilPicture('data:'+response.data.profilImage.contentType+';base64, '+response.data.profilImage.data) : setProfilPicture(null);
            location.pathname.includes('likes') ? setMode('profilLikes') : location.pathname.includes('retweets') ? setMode('profilRT') : setMode('profilTweets');
        })
        .catch((error) => console.log(error));
    });

    React.useEffect(() => {
        axios.get(`/subscription/getUserSubscriptions/${_id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                !response.data.message &&
                response.data.includes(thisID) && setIsCurrentUserSub(true);
            })
    }, [thisID]);

    function onClickSubs() {
        isCurrentUserSub ?
        axios.delete(`/subscription/deleteSubscription/${_id}/${thisID}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error)) :
        axios.post("/subscription/postSubscription", {userID: _id, followID: thisID}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error));
        setIsCurrentUserSub(!isCurrentUserSub);
    }

    return <div className="Profil">
        {
            userName === currentUserName ?
            <div className="editProfil">
                <div className="buttonEditProfil"><Link to={`/accueil/profil/${userName}/editProfil`} className="link-menu">Editer le profil</Link></div>
            </div> :
            <div className="subscribe">
                <button className="button" onClick={() => onClickSubs()}>{isCurrentUserSub ? 'Se désabonner' : "S'abonner"}</button>
            </div>
        }
        <div className="top" style={{border: 'none'}}>
            <div className="profil correctProfil">
                <div style={{display:'flex', flexDirection: 'row', gap: '0.5em', marginBottom: '1em'}}>
                    <p>{firstName}</p>
                    <p>{lastName}</p>
                    <p style={{color: 'var(--border-color)'}}>{userName}</p>
                </div>
                {profilPicture && <img src={profilPicture} alt="Profil" className="profilPicture correctPP"/>}
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
            <div className="RTChoice choicePart" onClick={() => setMode('profilRT')}>
                <Link to={`/accueil/profil/${userName}/retweets`} className="link-menu">
                    <div style={{borderBottom: mode==='profilRT' ? 'var(--blue-color) solid 3px' : 'none'}}>
                        Retweets
                    </div>
                </Link>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<TweetList userName={userName} _id={_id} mode='profilTweets'></TweetList>}/>
            <Route path="/likes" element={<TweetList userName={userName} _id={_id} mode='profilLikes'></TweetList>}/>
            <Route path="/retweets" element={<TweetList userName={userName} _id={_id} mode='profilRT'></TweetList>}/>
        </Routes>
    </div>;
}
export default Profil;