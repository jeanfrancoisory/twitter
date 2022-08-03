import React, {useState} from "react";
import "../CSS/MailBox.css";
import Conversation from "./Conversation";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

function MailBox() {
    const [isDiplay, setIsDisplay] = useState(false);
    const [noMessages, setNoMessages] = useState(true);
    const [conversations, setConversations] = useState([]);
    const token = Cookies.get('token');
    const currentID = Cookies.get('userID');
    const currentUserName = Cookies.get('userName');

    //TODO: New Messages Number

    React.useEffect(() => {
        fetchConversations(); // eslint-disable-next-line
    }, []);

    function fetchConversations() {
        axios.get(`/conversations/getUserConvs/${currentID}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                if (!response.data.message) {
                    setConversations(response.data);
                    setNoMessages(false);
                }
            }).catch((error) => console.log(error));
        setTimeout(() => fetchConversations(), 60000);
    }

    function handleClickDisplayMessage() {
        setIsDisplay(!isDiplay);
    }


    return <div className="MailBox">
        <div className="visibleMailBox" onClick={() => handleClickDisplayMessage()}>
            <div>Messages</div>
        </div>
        {isDiplay && <div className="messagesDisplay">
            {noMessages ?
            <div className="noMessages">
                Vous n'avez aucune conversation !
            </div> :
            <div>{conversations.map((conv) => (<Conversation key={conv._id} conv={conv} _id={currentID}/>))}</div>}
            <button type="button" className="button messageButton" onClick={() => setIsDisplay(false)}>
                <Link to={`/accueil/messages/${currentUserName}`} style={{textDecoration: 'none', color: 'var(--text-color)'}}>Nouveau Message</Link>
            </button>
        </div>}
    </div>;
}

export default MailBox;
