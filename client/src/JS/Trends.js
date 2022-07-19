import React, { useState } from "react";
import "../CSS/Trend.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from "react-router-dom";
import MailBox from "./MailBox";

function Trend() {
    const [search, setSearch] = useState('');
    const [userList, setUserList] = useState([]);

    React.useEffect(() => {
        search.length ?
        axios.get(`/user/getUserSearch/${search}`)
            .then((response) => {
                setUserList(response.data)
            })
            .catch((error) => console.log(error)) :
        setUserList([]);
    }, [search]);

    function handleClickLink() {
        setSearch('');
        setUserList([]);
    }

    return <div className="Trend">
        <div className="inputSearch">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon"></FontAwesomeIcon>
            <input placeholder="Recherche Twitter" value={search} onInput={(e) => setSearch(e.target.value)}/>
        </div>
        <div className="searchResults">
            {userList.map((user) => (
                <div key={user._id} className="userSearch">
                    <Link to={`/accueil/profil/${user.userName}`} style={{textDecoration: 'none'}} className="linkSearch" onClick={() => handleClickLink()}>
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
        <MailBox/>
    </div>;
}
export default Trend;