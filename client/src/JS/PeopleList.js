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
    }, [ID]);

    return <div className="PeopleList">
        <div className="topUserList">
            <FontAwesomeIcon icon={faArrowLeft}/>
            <div>{firstName}</div>
            <div>{lastName}</div>
            <div>{userName}</div>
        </div>
        <div className="choiceCategorie">
            <div className="followingChoice choicePart">
                <Link to={`/accueil/profil/${userName}/following`} className="link-menu">
                    <div style={{borderBottom: 'var(--blue-color) solid 3px'}}>
                        Abonnements
                    </div>
                </Link>
            </div>
            <div className="followersChoice choicePart">
                <Link to={`/accueil/profil/${userName}/followers`} className="link-menu">
                    <div>
                        Abonnés
                    </div>
                </Link>
            </div>
        </div>
        <div className="userList">
            {userList.map((user) => (
                <div key={user._id}>{user.userName}</div>
            ))}
        </div>
    </div>;
}

export default PeopleList;
