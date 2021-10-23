import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD2C6CG52gb_Q3a0nue20eedLJcSHFKcns",
  authDomain: "react-firebase-93b8a.firebaseapp.com",
  projectId: "react-firebase-93b8a",
  storageBucket: "react-firebase-93b8a.appspot.com",
  messagingSenderId: "956359575232",
  appId: "1:956359575232:web:9a29bc92e34936f4ce4f25",
  measurementId: "G-CFFVF1K7YE"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <center><button className="sign-in" class="btn btn-primary" onClick={signInWithGoogle} style={({ marginTop: '0.8rem' })}>Login!</button>
      <p style={({ marginTop: '0.8rem' })}>Login with google to chat about bedwars with some super amazing minecrafters!</p> </center> </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <center><button class="btn btn-danger" onClick={() => auth.signOut()} style={({ marginTop: '0.8rem', marginLeft: '0.8rem' })}>Sign Out</button></center>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <center><form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice"  class="form-control" style={({ width: 500 })}/>

      <button type="submit" class="btn btn-success" disabled={!formValue} style={({ margin: '0.8%',})}>send</button>

    </form></center>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <center><div className={`message ${messageClass}`}>
      <img style={({ marginTop: '0.8%' })} src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div></center>
  </>)
}


export default App;
