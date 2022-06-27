import React, { useState } from "react";
import "../CSS/Tweet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faShare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PopUpTweet from '../JS/PopUpTweet'
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

function Tweet({tweet, refreshTweetList}) {

    const [popUpOn, setPopUpOn] = useState(false);
    const [tweetLiked, setTweetLiked] = useState(tweet.liked);
    const [tweetRT, setTweetRT] = useState(tweet.rt);
    const currentUserID = Cookies.get('userID');
    const token = Cookies.get('token');

    React.useEffect(() => {
        setTweetLiked(tweet.liked);
        setTweetRT(tweet.rt);
    })

    function handleOpenPopUp() {
        setPopUpOn(!popUpOn);   
    }

    function onClickLike() {
        tweetLiked ?
        axios.delete(`/likes/deleteLikeTweet/${currentUserID}/${tweet._id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            }) :
        axios.post("/likes/postLikeTweet", {userID: currentUserID, tweetID: tweet._id}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            });
        setTweetLiked(!tweetLiked);
    }

    function onClickRT() {
        tweetRT ?
        axios.delete(`/retweets/deleteRTTweet/${currentUserID}/${tweet._id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            }) :
        axios.post("/retweets/postRTTweet", {userID: currentUserID, tweetID: tweet._id}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
            })
            .catch(err => {
                console.error(err);
            });
        setTweetRT(!tweetRT);
    }

    function supprTweet() {
        if (tweet.userID === currentUserID) {
            axios.delete(`/tweets/deleteUserTweet/${currentUserID}/${tweet._id}`, { headers: {authorization: 'Bearer ' + token}})
                .then((response) => {
                    console.log(response.data.message);
                    refreshTweetList(tweet._id);
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            console.log('NOt your tweet')
        }
    }

    return <div className="Tweet">
        {tweet.rtUser && <div className="topRT"><FontAwesomeIcon icon={faRetweet}/>  <Link to={`/accueil/profil/${tweet.rtUser}`} className="linkUNRT">{tweet.rtUser}</Link> à retweeter</div>}
        <div className="profil-head">
            <div id="name-date">
                <p>{tweet.firstName} {tweet.lastName}</p>
                <div className="userNameProfil"><Link to={`/accueil/profil/${tweet.userName}`} className="link-menu" style={{color: 'var(--border-color)'}}>{tweet.userName}</Link></div>
                <div id="datePost">{tweet.date}</div>
            </div>
            <FontAwesomeIcon icon={faEllipsis} id="menuTweet" onClick={() => handleOpenPopUp()}/>
            {popUpOn && <PopUpTweet closePopUp={handleOpenPopUp} supprTweet={supprTweet}></PopUpTweet>}
        </div>
        <div className="content">
            <p>{tweet.content}</p>
            <div className="LRT">
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faComment} className="iconsLRT Response"/>
                </div>
                <div className="LRTParts" style={{color: !tweetLiked? 'var(--border-color)' : 'red'}}>
                    <div className="Like iconNB">
                        <FontAwesomeIcon icon={faHeart} className="iconsLRT" 
                            onClick={() => onClickLike()}/>
                        <div style={{marginLeft: '1em'}}> {tweet.nbFavs!==0 && tweet.nbFavs}</div>
                    </div>
                </div>
                <div className="LRTParts" style={{color: !tweetRT? 'var(--border-color)' : 'green'}}>
                    <div className="Retweet iconNB">
                        <FontAwesomeIcon icon={faRetweet} className="iconsLRT"
                            onClick={() => onClickRT()}/>
                        <div style={{marginLeft: '1em'}}> {tweet.nbRT!==0 && tweet.nbRT}</div>
                    </div>
                </div>
                <div className="LRTParts">
                    <FontAwesomeIcon icon={faShare}  className="iconsLRT Share"/>
                </div>
            </div>
        </div>
        
    </div>;
}
export default Tweet;