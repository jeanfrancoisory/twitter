import React, {useRef, useState} from "react";
import "../CSS/InputTweet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

function InputTweet({sendTweetValue, mode}) {
    const tweet = useRef(null);
    const [imageTweet, setImageTweet] = useState(null);

    const sendTweet = event => {
        event.preventDefault();
        tweet.current.value !== '' &&
        imageTweet ? sendTweetValue(tweet.current.value, imageTweet) : sendTweetValue(tweet.current.value, null);
        setImageTweet(null)
        event.target.reset();
    }   

    function handleImageSelected(e) {
        // sendImageTweet(e.target.files[0]);
        console.log(e.target.files[0])
        setImageTweet(e.target.files[0]);
    }
    
    return <div className="InputTweet">
        <form onSubmit={sendTweet}>
            <input placeholder={mode ? "Réponse":"Quoi de neuf ?"} ref={tweet}></input>
            {imageTweet && <img src={URL.createObjectURL(imageTweet)} alt="PP" className="imageTweetUploaded"/>}
            <label>
                <FontAwesomeIcon icon={faImage} className="iconMedia"/>
                <input type='file' style={{display: 'none'}} onChange={handleImageSelected}/>
            </label>
            <button type="submit" className="button" >{mode? "Répondre":"Tweeter"}</button>
        </form>
    </div>;
}

export default InputTweet;