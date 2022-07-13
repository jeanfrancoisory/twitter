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
    const [userNameResponse, setUserNameResponse] = useState(null);
    const [tweetIDREsponse, setTweetIDResponse] = useState(null);
    const [tweetResponse, setTweetResponse] = useState(null);

    function timeConverter(time) {
        const date = Date.now() - (time);
        const min = Math.floor(date/(60*1000));
        const hour = Math.floor(date/(60*60*1000));
        const day = Math.floor(date/(24*60*60*1000));
        if(date < (60*1000)) {
            return "A l'instant";
        } else {
            if(!hour) {
                return min+' min';
            } else {
                if(!day) {
                    return hour+' h '+(min-hour*60)+' min';
                } else {
                    return day+' j '+(hour-day*24)+' h '+(min-hour*60)+' min';
                }
            }
        }
    }

    // React.useEffect(() => {
    //     setTweetLiked(tweetLiked);
    //     setTweetRT(tweetRT);
    // });

    React.useEffect(() => {
        tweet.isAnswerTo &&
        axios.get(`/tweets/getOneTweet/${tweet.isAnswerTo}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                setUserNameResponse(response.data.author.userName);
                setTweetIDResponse(response.data._id);
                setTweetResponse({
                    _id: response.data._id,
                    content: response.data.content,
                    userName: response.data.author.userName,
                    firstName: response.data.author.firstName,
                    lastName: response.data.author.lastName,
                    date: timeConverter(response.data.date),
                    userID: response.data.author._id,
                    liked: response.data.favorisUsers.includes(currentUserID) ? true : false,
                    rt: response.data.retweetsUsers.includes(currentUserID) ? true : false,
                    nbFavs: response.data.favoris,
                    nbRT: response.data.retweets,
                    isAnswerTo: response.data.isAnswerTo,
                    profilPicture: response.data.author.profilImage ? 'data:'+response.data.author.profilImage.contentType+';base64, '+response.data.author.profilImage.data : null,
                    tweetImage: response.data.tweetImage ? 'data:'+response.data.tweetImage.contentType+';base64, '+response.data.tweetImage.data : null
                })
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    function handleOpenPopUp() {
        setPopUpOn(!popUpOn);   
    }

    function onClickLike() {
        tweetLiked ?
        axios.delete(`/likes/deleteLikeTweet/${currentUserID}/${tweet._id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
                setTweetLiked(!tweetLiked)
            })
            .catch(err => {
                console.error(err);
            }) :
        axios.post("/likes/postLikeTweet", {userID: currentUserID, tweetID: tweet._id}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
                setTweetLiked(!tweetLiked);
            })
            .catch(err => {
                console.error(err);
            });
        
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
                    setPopUpOn(!popUpOn); 
                    refreshTweetList(tweet._id);
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            console.log('Not your tweet')
        }
    }

    return <div className="Tweet">
        <div className="imageTweet">
            {tweet.profilPicture ? 
            <img src={tweet.profilPicture} alt="PP" className="profilPictureTweet"/> :
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png' alt="PP" className="profilPictureTweet"/> 
            }
            
        </div>
        <div className="restTweet">
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
                {tweet.isAnswerTo && <div className="isResponse">
                    <div>en réponse à </div>
                    <Link to={`/accueil/profil/${userNameResponse}`} className="linksResponse">{userNameResponse}</Link>
                    <div>
                        <Link to={`/accueil/profil/${userNameResponse}/status/${tweetIDREsponse}`} className="linksResponse"
                        state={{tweet: tweetResponse}}>
                            , à ce tweet
                        </Link>
                    </div>
                </div>}
                <Link to={`/accueil/profil/${tweet.userName}/status/${tweet._id}`} state={{tweet: tweet}} style={{textDecoration: 'none'}}>
                <p>{tweet.content}</p>
                </Link>
                {tweet.tweetImage && <img src={tweet.tweetImage} alt="imgTweet"/>}
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
        </div>
    </div>;
}
export default Tweet;