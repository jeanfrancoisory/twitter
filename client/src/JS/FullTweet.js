import React, {useState} from "react";
import "../CSS/FullTweet.css";
import { useLocation, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import TweetList from "./TweetList";
import InputTweet from "./InputTweet";

function FullTweet() {

    const location = useLocation()
    const {tweet} = location.state;
    const [tweetLiked, setTweetLiked] = useState(tweet.liked);
    const [tweetRT, setTweetRT] = useState(tweet.rt);
    const currentUserID = Cookies.get('userID');
    const token = Cookies.get('token');
    const [tweetValue, setTweetValue] = useState('');
    const [tweetMedia, setTweetMedia] = useState(null);
    const [refresh, setRefresh] = useState(false);

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

    // Refresh the tweetList when from one tweet to another but with the same author
    React.useEffect(() => {
        setRefresh(!refresh);
    }, [tweet]);

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

    function sendTweetValue(content, image) {
        image && setTweetMedia(image);
        setTweetValue(content);
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
                    {tweet.profilPicture ? 
                    <img src={tweet.profilPicture} alt="PP" className="profilPictureFullTweet"/> :
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png' alt="PP" className="profilPictureFullTweet"/> 
                    }
                    <div>
                        <div className="userLFName-full">{tweet.firstName} {tweet.lastName}</div>
                        <div className="userNameProfil-full"><Link to={`/accueil/profil/${tweet.userName}`} className="link-menu" style={{color: 'var(--border-color)'}}>{tweet.userName}</Link></div>
                        <div id="datePost-full">{tweet.date}</div>
                    </div>
                    
                </div>
                {/* <FontAwesomeIcon icon={faEllipsis} id="menuTweet" onClick={() => handleOpenPopUp()}/>
                {popUpOn && <PopUpTweet closePopUp={handleOpenPopUp} supprTweet={supprTweet}></PopUpTweet>} */}
            </div>
            <div className="content-full">
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
                <p>{tweet.content}</p>
                {tweet.tweetImage && <img src={tweet.tweetImage} alt="imgTweet"/>}
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
            <InputTweet sendTweetValue={sendTweetValue} mode={1}/>
        </div>
        <TweetList userName={tweet.userName} _id={currentUserID} tweetValue={tweetValue} tweetMedia={tweetMedia} mode='Responses' tweetID={tweet._id} refresh={refresh} ></TweetList>
    </div>;
}

export default FullTweet;