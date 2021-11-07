import React, { useRef, useState } from 'react';
import './App.css';
import { GeistProvider, CssBaseline, Themes } from '@geist-ui/react'
import { Github } from '@geist-ui/react-icons'
import { Button, Text, Spacer, Grid, Input } from '@geist-ui/react'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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

const Theme = () => {
  const [themeType, setThemeType] = useState('light')
  const switchThemes = () => {
    setThemeType(last => (last === 'dark' ? 'light' : 'dark'))
  }
  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <switchThemes onClick={switchThemes} />
    </GeistProvider>
  )
}

function App() {
  const [themeType, setThemeType] = useState('dark')
  const switchThemes = () => {
    setThemeType(last => (last === 'dark' ? 'dark' : 'light'))
  }

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
        <GeistProvider themeType={themeType}>
          <CssBaseline />
          <switchThemes onClick={switchThemes} />
        </GeistProvider>
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
      <center><Text h1 style={({ marginTop: '9rem' })}>Bedwars-chat</Text>
        <Text h3>
          Chat about bedwars with some super amazing minecrafters!
        </Text></center>
      <Grid.Container gap={1} justify="center" height="100px">
        <Grid xs={2}><Button auto type="success" onClick={signInWithGoogle}>Login</Button></Grid>
        <Grid xs={2}><Button auto type="success" onClick={() => {
          window.open("http://github.com/paradoxns/bedwars-chat");
        }}><Github size={24} /> <Spacer /> Github</Button></Grid>
      </Grid.Container>

    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <center>
      <Button auto type="success" onClick={() => auth.signOut()} style={({ marginTop: '0.8rem' })}>Logout</Button>
    </center>
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

      <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" style={({ color: 'white',})} />
      <Button auto type="success" onClick={sendMessage}>send</Button>

      <Spacer />
    </form></center>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <center><div className={`message ${messageClass}`}>
      <img class="pic" style={({ marginTop: '0.8%' })} src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p class="message">{text}</p>
    </div></center>
  </>)
}

export default App;
