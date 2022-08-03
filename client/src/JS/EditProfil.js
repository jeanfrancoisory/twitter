import React, {useState} from "react";
import "../CSS/EditProfil.css";
import Cookies from 'js-cookie';
import axios from 'axios';

function EditProfil() {
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const userName = Cookies.get('userName');
    const token = Cookies.get('token');
    const [profilImage, setProfilImage] = useState();
    const [profilImageServer, setProfilImageServer] = useState();

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${Cookies.get('userName')}`, { headers: {authorization: 'Bearer ' + Cookies.get('token')}})
            .then((response) => {
                setNewFirstName(response.data.firstName);
                setNewLastName(response.data.lastName);
            })
            .catch((error) => console.log(error));
    }, []);

    const editProfil = event => {
        event.preventDefault();
        axios.put("/user/updateUser", {userName: userName, firstName: newFirstName, lastName: newLastName}, { headers: {authorization: 'Bearer ' + token}})
        .then((response) => {
            console.log(response.data.message);
        })
        .catch((error) => console.log(error));
        event.target.reset();
    }

    function handleProfilImageSelected(e) {
        setProfilImage(e.target.files[0]);
    }

    function handleSubimtImage(event) {
        event.preventDefault();
        console.log(profilImage)
        const formData = new FormData();
        formData.append("profilImage", profilImage);
        axios.post(`/user/postImgUser/${userName}`, formData, 
            { headers: {authorization: 'Bearer ' + token, "Content-Type": "multipart/form-data"}})
            .then((response) => {
                const b64 = 'data:'+response.data.profilImage.contentType+';base64, ';
                const imgStr =  response.data.profilImage.data;
                setProfilImageServer(b64+imgStr);
            })
            .catch((error) => console.log(error));
    }

    return <div className="EditProfil">
        <form onSubmit={handleSubimtImage}>
            <div className="modifs imgModif">
                <p>Photo de Profil : <input type="file" name="image" onChange={handleProfilImageSelected} /></p>
            </div>
            <button type="submit" className="button" >Enregistrer</button>
            <img src={profilImageServer} alt="alt text"/>
        </form>
        <form onSubmit={editProfil}>
            <div className="modifs fnModif">
                <p>First Name : <input onInput={e => setNewFirstName(e.target.value)} value={newFirstName}></input></p>
            </div>
            <div className="modifs lnModif">
                <p>Last Name : <input onInput={e => setNewLastName(e.target.value)} value={newLastName}></input></p>
            </div>
            <button type="submit" className="button" >Enregistrer</button>
        </form>
    </div>
}

export default EditProfil;