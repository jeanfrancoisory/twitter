import React from "react";
import "../CSS/Tache.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouse, faAnchor, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";


function Tache({userName}) {

    return <div className="Tache">
        <div className="menu-items">
            <FontAwesomeIcon icon={faAnchor} className="icon anchor" onClick={() => window.location.reload()}/>
        </div>
        <div className="Home menu-items">
            <Link to="/accueil/" className="link-menu">
                <FontAwesomeIcon icon={faHouse} className="icon"/>
                <p>Accueil</p>
            </Link>
        </div>
        <div className="Profile menu-items">
            <Link to={`/accueil/profil/${userName}`} className="link-menu">
                <FontAwesomeIcon icon={faUser} className="icon"/>
                <p>Profil</p>
            </Link>
        </div>
        <div className="Messages menu-items">
            <Link to={`/accueil/messages/${userName}`} className="link-menu">
                <FontAwesomeIcon icon={faEnvelope} className="icon"/>
                <p>Messages</p>
            </Link>
        </div>
    </div>;
}
export default Tache;