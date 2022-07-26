import React, { useState } from "react";
import "../CSS/File.css";
import TweetList from "./TweetList";
import InputTweet from "./InputTweet";
import Cookies from 'js-cookie';
import axios from 'axios';

function File({_id}) {
    const [tweetValue, setTweetValue] = useState(null);
    const [tweetMedia, setTweetMedia] = useState(null);
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

    function sendTweetValue(content, image) {
        console.log(image)
        image ? setTweetMedia(image) : setTweetMedia(null);
        setTweetValue(content);
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
                <InputTweet sendTweetValue={sendTweetValue} mode={0}/>
            </div>
        </div>
        <TweetList userName={userName} _id={_id} tweetValue={tweetValue} tweetMedia={tweetMedia} mode='Home'></TweetList>
    </div>;
}
export default File;