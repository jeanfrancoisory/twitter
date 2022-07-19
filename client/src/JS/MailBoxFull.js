import React, {useState, useRef} from "react";
import "../CSS/MailBoxFull.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';

function MailBoxFull({_id}) {
    const message = useRef(null);
    const [userSearch, setUserSearch] = useState('')
    const [userList, setUserList] = useState([]);
    const [finalUser, setFinalUser] = useState(null);
    const [finalUserName, setFinalUserName] = useState(null);
    const token = Cookies.get('token');
    const [newMessage, setNewMessage] = useState(false);
    const [conversations, setConversations] = useState([]);

    React.useEffect(() => {
        userSearch.length ?
        axios.get(`/user/getUserSearch/${userSearch}`)
            .then((response) => {
                setUserList(response.data)
            })
            .catch((error) => console.log(error)) :
        setUserList([]);
    }, [userSearch]);

    React.useEffect(() => {
        axios.get(`/conversations/getUserConvs/${_id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                !response.data.message && setConversations(response.data);
            })
    }, []);

    function handleClickUser(finalUserID, finalUserName) {
        setUserSearch('');
        setUserList([]);
        setFinalUser(finalUserID);
        setFinalUserName(finalUserName);
    }

    const handleSendMessage  = event => {
        event.preventDefault();
        (finalUser && message.current.value !== '' && finalUser !== _id) &&
        axios.post("/conversations/postMessage", {sender: _id, recipient: finalUser, content: message.current.value}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error));
        event.target.reset();
    }

    return <div className="MailBoxFull">
        <div className="topMessage">
            Messages
        </div>
        {newMessage ? <div className="newMessage">
            <div style={{display: 'flex'}}>
                <input placeholder="Destinataire" value={userSearch} className="inputMessage" onInput={(e) => setUserSearch(e.target.value)}/>
                {finalUserName && <div style={{marginLeft: '1em', marginTop: '1.5em'}}>{finalUserName}</div>}
            </div>
            {userList.length>0 && <div className="userListDest">
                {userList.map((e) => (<div className="userNameDest" key={e._id} onClick={() => handleClickUser(e._id, e.userName)}>
                    <div>{e.firstName}</div>
                    <div>{e.lastName}</div>
                    <div style={{color: 'var(--border-color)'}}>{e.userName}</div>
                </div>))}
            </div>}
            <form onSubmit={handleSendMessage}>
                <textarea placeholder="Message" ref={message} className="inputMessage"/>
                <button type="submit" className="button">Envoyer</button>
            </form>
        </div> : 
        <div style={{borderBottom: '1px solid var(--border-color)'}}>
            <button className="button" onClick={() => setNewMessage(true)}>Nouveau Message</button>
        </div>}
        {/* {conversations.map((conv) => )} */}
    </div>;
}

export default MailBoxFull;