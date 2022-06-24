import React from "react";
import "../CSS/TweetList.css";
import Tweet from "./Tweet"
import axios from 'axios';
import Cookies from 'js-cookie';

function TweetList({email, _id, tweetValue, mode}) {
    const [tweetList, setTweetList] = React.useState([]);
    const token = Cookies.get('token');

    function timeConverter(time) {
        const date = Date.now() - (time);
        const min = Math.floor(date/(60*1000));
        const hour = Math.floor(date/(60*60*1000));
        const day = Math.floor(date/(24*60*60*1000));
        if(date < (60*1000)) {
            return 'Just now';
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

    React.useEffect(() => {
        if(tweetValue) {
            axios
                .post('/tweets/postTweet', {content: tweetValue, date: Date.now(), _id: _id}, { headers: {authorization: 'Bearer ' + token}})
                .then((response) => {
                    response.data.date = timeConverter(response.data.date);
                    setTweetList([...tweetList, response.data]);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [tweetValue]);

    React.useEffect(() => {
        const tweetsID = []
        axios.get(`/tweets/getUserLikes/${_id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                if(!response.data.message) {
                    response.data.forEach((e) => {
                        tweetsID.push(e._id);
                    });
                }
                switch (mode) {
                    case 'Home' :
                        fetch("/tweets/getTweets")
                        .then((res) => res.json())
                        .then((data) => {
                            const tweets = [];
                            data.forEach((element) => {
                                element.tweets.forEach((e) => {
                                    const t = {
                                        _id: e._id,
                                        content: e.content,
                                        userName: element.author.userName,
                                        firstName: element.author.firstName,
                                        lastName: element.author.lastName,
                                        date: timeConverter(e.date),
                                        userID: element.author._id,
                                        liked: tweetsID.includes(e._id) ? true : false
                                    }
                                    tweets.push(t);
                                });
                            });
                            setTweetList(tweets);
                        });
                        break;
                    case 'profilTweets' :
                        axios.get(`/tweets/getUserTweets/${_id}`, { headers: {authorization: 'Bearer ' + token}})
                        .then((response) => {
                            if(!response.data.message) {
                                const tweets = [];
                                    response.data.tweets.forEach((e) => {
                                        const t = {
                                            _id: e._id,
                                            content: e.content,
                                            userName: response.data.author.userName,
                                            firstName: response.data.author.firstName,
                                            lastName: response.data.author.lastName,
                                            date: timeConverter(e.date),
                                            userID: e.userID,
                                            liked: tweetsID.includes(e._id) ? true : false
                                        }
                                        tweets.push(t);
                                    });
                                setTweetList(tweets);
                            }
                        });
                        break;
                    case 'profilLikes' :
                        axios.get(`/tweets/getUserLikes/${_id}`, { headers: {authorization: 'Bearer ' + token}})
                            .then((response) => {
                                if(!response.data.message) {
                                    const tweets = []
                                    response.data.forEach((e) => {
                                        const t = {
                                            _id: e._id,
                                            content: e.content,
                                            userName: e.author.userName,
                                            firstName: e.author.firstName,
                                            lastName: e.author.lastName,
                                            date: timeConverter(e.date),
                                            userID: e.author._id,
                                            liked: true
                                        }
                                        tweets.push(t);
                                    });
                                    setTweetList(tweets);
                                }
                            });
                        break;
                    default :
                        break;
                }
            });
        
        
      }, [mode]);

    function refreshTweetList(tweetID) {
        setTweetList(tweetList.filter(e => e['_id']!==tweetID));
    }


    return <div className="tweetList">
        {tweetList.map((e) => (
            <Tweet key={e._id} content={e.content} firstName={e.firstName} lastName={e.lastName} 
            _id={e._id} userID={e.userID} date={e.date} refreshTweetList={refreshTweetList} liked={e.liked} userName={e.userName}></Tweet>
        ))}
    </div>
}
export default TweetList;