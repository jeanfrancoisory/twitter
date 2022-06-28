import React, {useState, useRef} from "react";
import "../CSS/FullTweet.css";
import { useLocation, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import TweetList from "./TweetList";

function FullTweet() {

    const location = useLocation()
    const {tweet} = location.state;
    const [tweetLiked, setTweetLiked] = useState(tweet.liked);
    const [tweetRT, setTweetRT] = useState(tweet.rt);
    const currentUserID = Cookies.get('userID');
    const token = Cookies.get('token');
    const tweetContent = useRef(null);
    const [tweetValue, setTweetValue] = useState('');

    const sendTweet = event => {
        event.preventDefault();
        tweetContent.current.value !== '' &&
        setTweetValue(tweetContent.current.value);
        event.target.reset();
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

    return <div className="FullTweet">
        <div className="topFullTweet">
            <div className="profil-head-full">
                <div id="name-date-full">
                    <p>{tweet.firstName} {tweet.lastName}</p>
                    <div className="userNameProfil-full"><Link to={`/accueil/profil/${tweet.userName}`} className="link-menu" style={{color: 'var(--border-color)'}}>{tweet.userName}</Link></div>
                    <div id="datePost-full">{tweet.date}</div>
                </div>
                {/* <FontAwesomeIcon icon={faEllipsis} id="menuTweet" onClick={() => handleOpenPopUp()}/>
                {popUpOn && <PopUpTweet closePopUp={handleOpenPopUp} supprTweet={supprTweet}></PopUpTweet>} */}
            </div>
            <div className="content-full">
                <p>{tweet.content}</p>
                <div className="LRT-full">
                    <div className="LRTParts-full">
                        <FontAwesomeIcon icon={faComment} className="iconsLRT-full Response-full"/>
                    </div>
                    <div className="LRTParts-full" style={{color: !tweetLiked? 'var(--border-color)' : 'red'}}>
                        <div className="Like-full iconNB-full">
                            <FontAwesomeIcon icon={faHeart} className="iconsLRT-full" 
                                onClick={() => onClickLike()}/>
                            <div style={{marginLeft: '1em'}}> {tweet.nbFavs!==0 && tweet.nbFavs}</div>
                        </div>
                    </div>
                    <div className="LRTParts-full" style={{color: !tweetRT? 'var(--border-color)' : 'green'}}>
                        <div className="Retweet-full iconNB-full">
                            <FontAwesomeIcon icon={faRetweet} className="iconsLRT-full"
                                onClick={() => onClickRT()}/>
                            <div style={{marginLeft: '1em'}}> {tweet.nbRT!==0 && tweet.nbRT}</div>
                        </div>
                    </div>
                    <div className="LRTParts-full">
                        <FontAwesomeIcon icon={faShare}  className="iconsLRT-full Share-full"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="textBox-full">
            <form onSubmit={sendTweet}>
                <input placeholder="Réponse" ref={tweetContent}></input>
                <button type="submit" className="button" >Répondre</button>
            </form>
        </div>
        <TweetList userName={tweet.userName} _id={currentUserID} tweetValue={tweetValue} mode='Responses' tweetID={tweet._id}></TweetList>
    </div>;
}

export default FullTweet;