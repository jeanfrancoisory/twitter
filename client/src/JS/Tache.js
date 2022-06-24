import React from "react";
import "../CSS/Tache.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHouse, faAnchor } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";


function Tache() {

    function setMiddle(name) {
    }

    return <div className="Tache">
        <div className="menu-items">
            <FontAwesomeIcon icon={faAnchor} className="icon anchor" onClick={() => window.location.reload()}/>
        </div>
        <div className="Home menu-items" onClick={() => setMiddle('Home')}>
            <Link to="/accueil/" className="link-menu">
                <FontAwesomeIcon icon={faHouse} className="icon"/>
                <p>Accueil</p>
            </Link>
        </div>
        <div className="Profile menu-items" onClick={() => setMiddle('Profil')}>
            <Link to="/accueil/profil" className="link-menu">
                <FontAwesomeIcon icon={faUser} className="icon"/>
                <p>Profil</p>
            </Link>
        </div>
    </div>;
}
export default Tache;