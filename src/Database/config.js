import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage"

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyAZLJ0Gjn1wepzXGmgV8BQXdFEgPFTHwMU",
    authDomain: "scalestechofficialdatabase.firebaseapp.com",
    projectId: "scalestechofficialdatabase",
    storageBucket: "scalestechofficialdatabase.appspot.com",
    messagingSenderId: "941267898385",
    appId: "1:941267898385:web:c0f3984a4b8f16bdd2e1b0",
    measurementId: "G-17Y9E0HKJB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();
export const storage = firebase.storage();
