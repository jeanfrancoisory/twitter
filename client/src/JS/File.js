import React, { useState } from "react";
import "../CSS/File.css";
import {useRef} from 'react';
import TweetList from "./TweetList";

function File({userName, email, firstName, lastName, _id}) {
    const tweet = useRef(null);
    const [tweetValue, setTweetValue] = useState('');

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
                <p>{firstName}</p>
                <p>{lastName}</p>
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