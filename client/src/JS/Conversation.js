import React, { useState, useRef } from "react";
import "../CSS/Conversation.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesUp, faEllipsis, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

function Conversation({conv, _id}) {
    const [currentUser] = useState(conv.users[conv.users.findIndex((user) => user._id === _id)]);
    const [destUser] = useState(conv.users[conv.users.findIndex((user) => user._id === _id) ? 0 : 1]);
    const [isConvFull, setIsConvFull] = useState(false);
    const [messagesList, setMessagesList] = useState();
    const [supprMessageClass, setSupprMessageClass] = useState('supprButtonHidden');
    const [popUpSuppr, setPopUpSuppr] = useState('popUpSupprHidden');
    const message = useRef(null);
    const token = Cookies.get('token');

    React.useEffect(() => {
        setMessagesList(conv.messages.sort((m1, m2) => m2.date-m1.date));
    }, [conv]);

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

    const handleSendMessage  = event => {
        event.preventDefault();
        const mess = message.current.value;
        (message.current.value) &&
        axios.post("/conversations/postMessage", {sender: _id, recipient: destUser._id, content: message.current.value}, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => {
                console.log(response.data.message);
                setMessagesList([{
                    content: mess,
                    date: Date.now(),
                    from: _id
                }, ...messagesList])
            })
            .catch((error) => console.log(error));
        event.target.reset();
}

    function supprMessage(message) {
        console.log(message)
        axios.delete(`/conversations/supprMessage/${conv._id}/${message._id}`, { headers: {authorization: 'Bearer ' + token}})
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error))  
    }

    return <div className="Conversation">
        {!isConvFull ? <div onClick={() => setIsConvFull(true)} style={{display: 'flex'}}>
            <div className="imageConv">
                {destUser.profilImage ? 
                <img src={'data:'+destUser.profilImage.contentType+';base64, '+destUser.profilImage.data} alt="PP" className="profilPictureConv"/> :
                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png' alt="PP" className="profilPictureConv"/>} 
            </div>
            <div className="nameMessage">
                <div className="nameConv">
                    <div>{destUser.firstName}</div>
                    <div>{destUser.lastName}</div>
                    <div style={{color: 'var(--border-color', fontWeight: '500'}}>{destUser.userName}</div>
                </div>
                <div className="lastestMessage">
                    <div style={{fontWeight: '500'}}>{conv.messages.length>0 && conv.messages[0].content}</div>
                </div>
            </div>
        </div> :
        <div className="fullConv">
            <div className="topConv">
                <div style={{display: 'flex'}}>
                    <div className="imageConv">
                        {destUser.profilImage ? 
                        <img src={'data:'+destUser.profilImage.contentType+';base64, '+destUser.profilImage.data} alt="PP" className="profilPictureConv"/> :
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png' alt="PP" className="profilPictureConv"/>} 
                    </div>
                    <div className="nameConv">
                        <div>{destUser.firstName}</div>
                        <div>{destUser.lastName}</div>
                        <div style={{color: 'var(--border-color', fontWeight: '500'}}>
                            <Link to={`/accueil/profil/${destUser.userName}`} style={{color: 'var(--border-color)', textDecoration: 'none'}}>{destUser.userName}</Link>
                        </div>
                    </div>
                </div>
                <div className="iconCloseConv">
                    <FontAwesomeIcon icon={faAnglesUp} style={{color: 'var(--border-color'}} onClick={() => setIsConvFull(false)}/>
                </div>
            </div>
            <div className="convCorps" onClick={() => popUpSuppr.includes('Visible') && setPopUpSuppr('popUpSupprHidden')}>
                {messagesList.map((message, index) => (
                    <div key={message.date} className={message.from === currentUser._id ? 'blockMessage rightMessage' : 'blockMessage leftMessage'} 
                    onMouseEnter={() => setSupprMessageClass('supprButtonVisible'+index)} onMouseLeave={() => setSupprMessageClass('supprButtonHidden')}>
                        {message.from === currentUser._id && 
                        <div className="supprMessage">
                            <div className={!popUpSuppr.includes(index) ? 'popUpSupprHidden popUpSuppr' : popUpSuppr+' popUpSuppr'} 
                            onClick={() => !message.content.match(/[0-9]+\ssuppr/g) && supprMessage(message)}>
                                <FontAwesomeIcon icon={faTrashCan}/>
                                <div>{message.content.match(/[0-9]+\ssuppr/g) ? 'Message supprimé' : 'Supprimer le message'}</div>
                            </div>
                            <FontAwesomeIcon icon={faEllipsis} style={{cursor: 'pointer'}} 
                            onClick={() => popUpSuppr.includes('Hidden') ? setPopUpSuppr('popUpSupprVisible'+index) : setPopUpSuppr(('popUpSupprHidden'))} 
                            className={!supprMessageClass.includes(index) ? 'supprButtonHidden' : supprMessageClass}/>
                        </div>}
                        <div className="messageContent">
                            {message.content.match(/[0-9]+\ssuppr/g) ? 
                            'Le message a été supprimé il y a '+timeConverter(Number(message.content.match(/[0-9]{13}/g))) :
                            message.content}
                            <div className="dateMessage">
                                {timeConverter(message.date)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} style={{display: 'flex'}}>
                <input placeholder="Message" ref={message} className="inputMessage"/>
                <button type="submit" className="button">Envoyer</button>
            </form>  
        </div>}
    </div>;
}

export default Conversation;