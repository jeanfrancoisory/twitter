import React from "react";
import "../CSS/TweetList.css";
import Tweet from "./Tweet"
import axios from 'axios';
import Cookies from 'js-cookie';

function TweetList({userName, _id, tweetValue, mode}) {
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
        const tweetsIDLikes = []
        const tweetsIDRT = []
        if (userName) {
            axios.all([axios.get(`/likes/getUserLikesByID/${_id}`, { headers: {authorization: 'Bearer ' + token}}), 
                        axios.get(`/retweets/getUserRTByID/${_id}`, { headers: {authorization: 'Bearer ' + token}})])
            .then(axios.spread((...response) => {
                const responseLikes = response[0];
                const responseRT = response[1]
                if(!responseLikes.data.message) {
                    responseLikes.data.forEach((e) => {
                        tweetsIDLikes.push(e._id);
                    });
                }
                if(!responseRT.data.message) {
                    responseRT.data.forEach((e) => {
                        tweetsIDRT.push(e._id);
                    });
                }
                switch (mode) {
                    case 'Home' :
                        axios.all([axios.get("/tweets/getAllTweets"), axios.get("/retweets/getAllRetweets")])
                        .then(axios.spread((...response) => {
                            const responseTweets = response[0];
                            const responseRT = response[1];
                            const tweets = [];
                            responseTweets.data.forEach((element) => {
                                element.tweets.forEach((e) => {
                                    const t = {
                                        _id: e._id,
                                        content: e.content,
                                        userName: element.author.userName,
                                        firstName: element.author.firstName,
                                        lastName: element.author.lastName,
                                        date: timeConverter(e.date),
                                        userID: element.author._id,
                                        liked: tweetsIDLikes.includes(e._id) ? true : false,
                                        rt: tweetsIDRT.includes(e._id) ? true : false,
                                        nbFavs: e.favoris,
                                        nbRT: e.retweets
                                    }
                                    tweets.push(t);
                                });
                            });
                            responseRT.data.ids.forEach((id, index) => {
                                const tweet = responseRT.data.tl.find(el => el._id === id);
                                const user = responseRT.data.users[index]
                                const t = {
                                    _id: tweet._id,
                                    content: tweet.content,
                                    userName: tweet.author.userName,
                                    firstName: tweet.author.firstName,
                                    lastName: tweet.author.lastName,
                                    date: timeConverter(tweet.date),
                                    userID: tweet.author._id,
                                    liked: tweetsIDLikes.includes(tweet._id) ? true : false,
                                    rt: tweetsIDRT.includes(tweet._id) ? true : false,
                                    rtUser: user.userName,
                                    nbFavs: tweet.favoris,
                                    nbRT: tweet.retweets
                                }
                                tweets.push(t);
                            })
                            setTweetList(tweets);
                        }));
                        break;
                    case 'profilTweets' :
                        axios.get(`/tweets/getUserTweets/${userName}`, { headers: {authorization: 'Bearer ' + token}})
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
                                            liked: tweetsIDLikes.includes(e._id) ? true : false,
                                            rt: tweetsIDRT.includes(e._id) ? true : false,
                                            nbFavs: e.favoris,
                                            nbRT: e.retweets
                                        }
                                        tweets.push(t);
                                    });
                                setTweetList(tweets);
                            }
                        });
                        break;
                    case 'profilLikes' :
                        axios.get(`/likes/getUserLikesByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
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
                                            liked: tweetsIDLikes.includes(e._id) ? true : false,
                                            rt: tweetsIDRT.includes(e._id) ? true : false,
                                            nbFavs: e.favoris,
                                            nbRT: e.retweets
                                        }
                                        tweets.push(t);
                                    });
                                    setTweetList(tweets);
                                }else{
                                    setTweetList([]);
                                }
                            });
                        break;
                    case 'profilRT' :
                        axios.get(`/retweets/getUserRTByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
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
                                            liked: tweetsIDLikes.includes(e._id) ? true : false,
                                            rt: tweetsIDRT.includes(e._id) ? true : false,
                                            rtUser: userName,
                                            nbFavs: e.favoris,
                                            nbRT: e.retweets
                                        }
                                        tweets.push(t);
                                    });
                                    setTweetList(tweets);
                                }else{
                                    setTweetList([]);
                                }
                            });
                        break;
                    default :
                        break;
                }
            }));
        }
      }, [mode, userName]);

    function refreshTweetList(tweetID) {
        setTweetList(tweetList.filter(e => e['_id']!==tweetID));
    }


    return <div className="tweetList">
        {tweetList.map((e, index) => (
            <Tweet key={index} tweet={e} refreshTweetList={refreshTweetList}></Tweet>
        ))}
    </div>
}
export default TweetList;