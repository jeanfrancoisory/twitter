import React from "react";
import "../CSS/PopUpTweet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function PopUpTweet({closePopUp, supprTweet}) {

    return <div className="popUp">
        <div className="PopUpTweet">
            <div className="menuChoices">
                <FontAwesomeIcon icon={faXmark} onClick={() => closePopUp()} className="crossClose"/>
            </div>
            <div className="menuChoices supprTweet" onClick={() => supprTweet()}>
                <FontAwesomeIcon icon={faTrashCan}/>
                <div>Supprimer le tweet</div>
            </div>
        </div>  
    </div>
}
export default PopUpTweet;