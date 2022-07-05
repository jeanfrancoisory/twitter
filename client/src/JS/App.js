// client/src/App.js

import React from "react";
import "../CSS/App.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Route, Routes } from "react-router-dom";
import Accueil from './Accueil';

function App() {
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(false);
  const [signup, setSignup] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName]= React.useState('');
  let navigate = useNavigate();

  React.useEffect(() => {
    fetch("/connexion/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  function setLS(bool) {
    setLogin(bool);
    setSignup(!bool);
  }

  function checkID() {
     axios
       .post('/connexion/checkID', {email: email, password: password})
       .then((response) => {
         if (response.status === 200) { 
          const _id = response.data._id;
          Cookies.set('token', response.data.token);
          Cookies.set('userID', _id);
          Cookies.set('userName', response.data.userName);
           navigate('/accueil');
         } else {
           alert(response.data.message);
         }
       })
       .catch(err => {
         console.error(err);
       });
  }

  function signUp() {
    axios
      .post('/connexion/signUp', {userName: userName, firstName: firstName, lastName: lastName, email: email, password: password})
      .then((response) => {
        setLS(true);
        alert(response.data.message);
      })  
      .catch(err => {
        console.error(err);
      });
  }

  return (
    
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <h1>Welcome !</h1>
              <p>{!data ? "Loading..." : data}</p>
              <div>
                <button type="button" className="button" onClick={() => setLS(true)}>Connexion</button>
                <button type="button" className="button" onClick={() => setLS(false)}>Inscription</button>
              </div>
              <div>
                {login && <div>
                  <p>Email : <input type="email" onInput={e => setEmail(e.target.value)}></input></p>
                  <p>Password : <input type="password" onInput={e => setPassword(e.target.value)}></input></p> 
                  <button type="button" className="button" onClick={checkID}>Sign In</button>
                </div>}
                {signup && <div>
                  <p>First Name : <input onInput={e => setFirstName(e.target.value)}></input></p>
                  <p>Last Name : <input onInput={e => setLastName(e.target.value)}></input></p>
                  <p>Email : <input type="email" onInput={e => setEmail(e.target.value)}></input></p>
                  <p>UserName : <input type="email" onInput={e => setUserName(e.target.value)}></input></p>
                  <p>Password : <input type="password" onInput={e => setPassword(e.target.value)}></input></p> 
                  <button type="button" className="button" onClick={signUp}>Sign Up</button>
                  </div>}
              </div>
            </header>
          </div>
        }/>
        <Route path='/accueil/*' element={<Accueil/>}/>
      </Routes>
    
  );
}

export default App;