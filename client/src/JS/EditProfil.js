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

    React.useEffect(() => {
        axios.get(`/user/getUserByUN/${userName}`, { headers: {authorization: 'Bearer ' + token}})
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
        const formData = new FormData();
        formData.append("image", profilImage);
        console.log(profilImage)
        axios.post("/user/postImgUser", formData, 
            { headers: {authorization: 'Bearer ' + token, "Content-Type": "multipart/form-data"}})
            .then((response) => console.log(response.data.message))
            .catch((error) => console.log(error));
    }

    return <div className="EditProfil">
        <form onSubmit={handleSubimtImage}>
            <div className="modifs imgModif">
                <p>Photo de Profil : <input type="file" name="image" onChange={handleProfilImageSelected} /></p>
            </div>
            <button type="submit" className="button" >Enregistrer</button>
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