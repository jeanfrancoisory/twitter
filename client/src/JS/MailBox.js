import React, {useState} from "react";
import "../CSS/MailBox.css";

function MailBox() {
    const [isDiplay, setIsDisplay] = useState(false);
    const [noMessages, setNoMessages] = useState(true);

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
            <div></div>}
            <button type="button" className="button messageButton">Nouveau Message</button>
        </div>}
    </div>;
}

export default MailBox;