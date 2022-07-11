import React from "react";
import "../CSS/TweetList.css";
import Tweet from "./Tweet"
import axios from 'axios';
import Cookies from 'js-cookie';

function TweetList({userName, _id, tweetValue, tweetMedia, mode, tweetID, refresh}) {
    const [tweetList, setTweetList] = React.useState([]);
    const token = Cookies.get('token');

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

    React.useEffect(() => {
        if(tweetValue) {
            if(mode === 'Responses' && tweetID) {
                axios.post('/responses/postResponse', {content: tweetValue, date: Date.now(), _id: _id, tweetID: tweetID}, 
                { headers: {authorization: 'Bearer ' + token}})
                    .then((res) => {
                        res.data.date = timeConverter(res.data.date);
                        setTweetList([...tweetList, res.data]);
                    })
                    .catch(err => console.error(err));
            } else {
                axios
                .post('/tweets/postTweet', {content: tweetValue, date: Date.now(), _id: _id}, 
                { headers: {authorization: 'Bearer ' + token}})
                .then((response) => {
                    response.data.date = timeConverter(response.data.date);
                    if (tweetMedia) {
                        const formData = new FormData();
                        formData.append("tweetImage", tweetMedia);
                        axios.post(`/tweets/addtweetImage/${response.data._id}`, formData, 
                            { headers: {authorization: 'Bearer ' + token, "Content-Type": "multipart/form-data"}})
                            .then((res) => {
                                const newTweet = {
                                    ...response.data,
                                    tweetImage: 'data:'+res.data.tweetImage.contentType+';base64, '+res.data.tweetImage.data
                                }
                                setTweetList([...tweetList, newTweet]);
                            })
                            .catch((error) => console.log(error));
                    } else {
                        console.log('no image')
                        setTweetList([...tweetList, response.data]);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            }
        }
    }, [tweetValue]);

    React.useEffect(() => {
        if (userName) {
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
                                    userName: element.user.userName,
                                    firstName: element.user.firstName,
                                    lastName: element.user.lastName,
                                    date: timeConverter(e.date),
                                    userID: element.user._id,
                                    liked: e.favorisUsers.includes(_id) ? true : false,
                                    rt: e.retweetsUsers.includes(_id) ? true : false,
                                    nbFavs: e.favoris,
                                    nbRT: e.retweets,
                                    isAnswerTo: e.isAnswerTo,
                                    profilPicture: element.user.profilImage ? 'data:'+element.user.profilImage.contentType+';base64, '+element.user.profilImage.data : null,
                                    tweetImage: e.tweetImage ? 'data:'+e.tweetImage.contentType+';base64, '+e.tweetImage.data : null
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
                                liked: tweet.favorisUsers.includes(_id) ? true : false,
                                rt: tweet.retweetsUsers.includes(_id) ? true : false,
                                rtUser: user.userName,
                                nbFavs: tweet.favoris,
                                nbRT: tweet.retweets,
                                isAnswerTo: tweet.isAnswerTo,
                                profilPicture: tweet.author.profilImage ? 'data:'+tweet.author.profilImage.contentType+';base64, '+tweet.author.profilImage.data : null,
                                tweetImage: tweet.tweetImage ? 'data:'+tweet.tweetImage.contentType+';base64, '+tweet.tweetImage.data : null
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
                                        userName: response.data.user.userName,
                                        firstName: response.data.user.firstName,
                                        lastName: response.data.user.lastName,
                                        date: timeConverter(e.date),
                                        userID: response.data.user._id,
                                        liked: e.favorisUsers.includes(_id) ? true : false,
                                        rt: e.retweetsUsers.includes(_id) ? true : false,
                                        nbFavs: e.favoris,
                                        nbRT: e.retweets,
                                        isAnswerTo: e.isAnswerTo,
                                        profilPicture: response.data.user.profilImage ? 'data:'+response.data.user.profilImage.contentType+';base64, '+response.data.user.profilImage.data : null,
                                        tweetImage: e.tweetImage ? 'data:'+e.tweetImage.contentType+';base64, '+e.tweetImage.data : null
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
                                        liked: e.favorisUsers.includes(_id) ? true : false,
                                        rt: e.retweetsUsers.includes(_id) ? true : false,
                                        nbFavs: e.favoris,
                                        nbRT: e.retweets,
                                        isAnswerTo: e.isAnswerTo,
                                        profilPicture: e.author.profilImage ? 'data:'+e.author.profilImage.contentType+';base64, '+e.author.profilImage.data : null,
                                        tweetImage: e.tweetImage ? 'data:'+e.tweetImage.contentType+';base64, '+e.tweetImage.data : null
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
                                        liked: e.favorisUsers.includes(_id) ? true : false,
                                        rt: e.retweetsUsers.includes(_id) ? true : false,
                                        rtUser: userName,
                                        nbFavs: e.favoris,
                                        nbRT: e.retweets,
                                        isAnswerTo: e.isAnswerTo,
                                        profilPicture: e.author.profilImage ? 'data:'+e.author.profilImage.contentType+';base64, '+e.author.profilImage.data : null,
                                        tweetImage: e.tweetImage ? 'data:'+e.tweetImage.contentType+';base64, '+e.tweetImage.data : null
                                    }
                                    tweets.push(t);
                                });
                                setTweetList(tweets);
                            }else{
                                setTweetList([]);
                            }
                        });
                    break;
                case 'Responses':
                    tweetID &&
                    axios.get(`/responses/getTweetResponses/${tweetID}`, { headers: {authorization: 'Bearer ' + token}})
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
                                        liked: e.favorisUsers.includes(_id) ? true : false,
                                        rt: e.retweetsUsers.includes(_id) ? true : false,
                                        nbFavs: e.favoris,
                                        nbRT: e.retweets,
                                        isAnswerTo: e.isAnswerTo,
                                        profilPicture: e.author.profilImage ? 'data:'+e.author.profilImage.contentType+';base64, '+e.author.profilImage.data : null,
                                        tweetImage: e.tweetImage ? 'data:'+e.tweetImage.contentType+';base64, '+e.tweetImage.data : null
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
        }
      }, [mode, userName, refresh]);

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