import React, { useState } from "react";
import "../CSS/Tweet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faShare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PopUpTweet from '../JS/PopUpTweet'
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

function Tweet({content, firstName, lastName, _id, userID, date, refreshTweetList, liked, userName}) {

    const [popUpOn, setPopUpOn] = useState(false);
    const [tweetLiked, setTweetLiked] = useState(liked);
    const currentUserID = Cookies.get('userID');
    const token = Cookies.get('token');

    function handleOpenPopUp() {
        setPopUpOn(!popUpOn);   
    }

    function onClickLike() {
        tweetLiked ?
        axios.delete(`/tweets/deleteLikeTweet/${currentUserID}/${_id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            }) :
        axios.post("/tweets/postLikeTweet", {userID: currentUserID, tweetID: _id}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            });
        setTweetLiked(!tweetLiked);
    }

    function supprTweet() {
        if (userID === currentUserID) {
            axios.delete(`/tweets/deleteUserTweet/${currentUserID}/${_id}`, { headers: {authorization: 'Bearer ' + token}})
                .then((response) => {
                    console.log(response.data.message);
                    refreshTweetList(_id);
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            console.log('NOt your tweet')
        }
    }

    return <div className="Tweet">
        <div className="profil-head">
            <div id="name-date">
                <p>{firstName} {lastName}</p>
                <div className="userNameProfil"><Link to={`/accueil/profil/${userName}`} className="link-menu" style={{color: 'var(--border-color)'}}>{userName}</Link></div>
                <div id="datePost">{date}</div>
            </div>
            <FontAwesomeIcon icon={faEllipsis} id="menuTweet" onClick={() => handleOpenPopUp()}/>
            {popUpOn && <PopUpTweet closePopUp={handleOpenPopUp} supprTweet={supprTweet}></PopUpTweet>}
        </div>
        <div className="content">
            <p>{content}</p>
            <div className="LRT">
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faComment} className="iconsLRT Response"/>
                </div>
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faHeart} className="iconsLRT Like" 
                    style={{color: !tweetLiked? 'var(--border-color)' : 'red'}} onClick={() => onClickLike()}/>
                </div>
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faRetweet} className="iconsLRT Retweet"/>
                </div>
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faShare}  className="iconsLRT Share"/>
                </div>
            </div>
        </div>
        
    </div>;
}
export default Tweet;