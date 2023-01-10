import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB27ewA3Fhq9UEnnNoh9KVAYuyTIG3IGMU",
  authDomain: "music-app-866f6.firebaseapp.com",
  projectId: "music-app-866f6",
  storageBucket: "music-app-866f6.appspot.com",
  appId: "1:1088020118953:web:0696bd12fbf61834c4d8b8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = firebase.auth();
// Initialize Firestore
const db = firebase.firestore();

// Enable offline data
db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = db.collection("users");
const tracksCollection = db.collection("tracks");
const commentsCollection = db.collection("comments");

// Initialize Firebase storage
const storage = firebase.storage();

export {
  auth,
  db,
  usersCollection,
  tracksCollection,
  commentsCollection,
  storage,
};
