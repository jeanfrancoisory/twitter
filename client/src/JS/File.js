import React, { useState } from "react";
import "../CSS/File.css";
import {useRef} from 'react';
import TweetList from "./TweetList";
import Cookies from 'js-cookie';
import axios from 'axios';

function File({_id}) {
    const tweet = useRef(null);
    const [tweetValue, setTweetValue] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilPicture, setProfilPicture] = useState();
    const token = Cookies.get('token');
    const userName = Cookies.get('userName');

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                if (response.data.profilImage)  {
                    setProfilPicture('data:'+response.data.profilImage.contentType+';base64, '+response.data.profilImage.data);
                }
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
            })
            .catch((error) => console.log(error));
    }, []);

    const sendTweet = event => {
        event.preventDefault();
        tweet.current.value !== '' &&
        setTweetValue(tweet.current.value);
        event.target.reset();
    }

    return <div className="File">
        <div className="welcome link" onClick={() => window.location.reload()}>
            <p>Accueil</p>
        </div>
        <div className="top">
            <div className="profil">
                {!profilPicture ?
                <div>
                    <p>{firstName}</p>
                    <p>{lastName}</p>
                </div>
                 :
                <img src={profilPicture} alt="Profil" className="profilPicture"/>
                }
                <p>{userName}</p>
            </div>
            <div className="textBox">
                <form onSubmit={sendTweet}>
                    <input placeholder="Quoi de neuf ?" ref={tweet}></input>
                    <button type="submit" className="button" >Tweeter</button>
                </form>
            </div>
        </div>
        <TweetList userName={userName} _id={_id} tweetValue={tweetValue} mode='Home'></TweetList>
    </div>;
}
export default File;