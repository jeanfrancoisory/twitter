import React, {useState} from "react";
import "../CSS/PeopleList.css";
import axios from "axios";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {Link, useLocation, useParams} from "react-router-dom";

function PeopleList() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ID, setID] = useState('');
    const {userName} = useParams();
    const [userList, setUserList] = useState([]);
    const location = useLocation();

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${userName}`, { headers: {authorization: 'Bearer ' + Cookies.get('token')}})
            .then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setID(response.data._id);
            })
            .catch((error) => console.log(error));
    }, [userName]);

    React.useEffect(() => {
        if (location.pathname.includes('following')) {
            ID!=='' && axios.get(`/subscription/getUserSub/${ID}`, { headers: {authorization: 'Bearer ' + Cookies.get('token')}})
                .then((response) => setUserList(response.data))
                .catch((error) => console.log(error));
        }
        if (location.pathname.includes('followers')) {
            ID!=='' && axios.get(`/subscription/getUserFollow/${ID}`, { headers: {authorization: 'Bearer ' + Cookies.get('token')}})
                .then((response) => setUserList(response.data))
                .catch((error) => console.log(error));
        } // eslint-disable-next-line
    }, [ID, location.pathname]);

    return <div className="PeopleList">
        <div className="topUserList">
            <Link to={`/accueil/profil/${userName}`} style={{color: 'var(--text-color)'}}>
                <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
            <div>{firstName}</div>
            <div>{lastName}</div>
            <div style={{color: 'var(--border-color)'}}>{userName}</div>
        </div>
        <div className="choiceCategorie">
            <div className="followingChoice choicePart" style={{width: '50%'}}>
                <Link to={`/accueil/profil/${userName}/following`} className="link-menu">
                    <div style={{borderBottom: location.pathname.includes('following') ? 'var(--blue-color) solid 3px' : 'none'}}>
                        Abonnements
                    </div>
                </Link>
            </div>
            <div className="followersChoice choicePart" style={{width: '50%'}}>
                <Link to={`/accueil/profil/${userName}/followers`} className="link-menu">
                    <div style={{borderBottom: location.pathname.includes('followers') ? 'var(--blue-color) solid 3px' : 'none'}}>
                        Abonnés
                    </div>
                </Link>
            </div>
        </div>
        <div className="userList">
            {userList.map((user) => (
                <div key={user._id} className="userSearch">
                    <Link to={`/accueil/profil/${user.userName}`} style={{textDecoration: 'none'}} className="linkSearch">
                        {user.profilImage && <img src={'data:'+user.profilImage.contentType+';base64, '+user.profilImage.data} alt="Profil" className="profilPictureSearch"/>}
                        <div className="userNameSearch">
                            <div style={{display: 'flex', gap: '0.5em'}}>
                                <div>{user.firstName}</div>
                                <div>{user.lastName}</div>
                            </div>
                            <div style={{color: 'var(--border-color)'}}>{user.userName}</div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    </div>;
}

export default PeopleList;
