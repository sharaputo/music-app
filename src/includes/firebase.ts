import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB27ewA3Fhq9UEnnNoh9KVAYuyTIG3IGMU",
  authDomain: "music-app-866f6.firebaseapp.com",
  projectId: "music-app-866f6",
  storageBucket: "music-app-866f6.appspot.com",
  appId: "1:1088020118953:web:0696bd12fbf61834c4d8b8",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection("users");
const tracksCollection = db.collection("tracks");

const storage = firebase.storage();

export { auth, db, usersCollection, tracksCollection, storage };
