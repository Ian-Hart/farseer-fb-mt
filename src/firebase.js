// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import {  getAuth, 
          onAuthStateChanged, 
          createUserWithEmailAndPassword, 
          updateProfile, 
          signInWithEmailAndPassword,
          signOut } from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database";

const config = {
  apiKey: "AIzaSyAQBlUDlJFdlsaLSGO3Kpsgmyx1PfG4JbM",
  authDomain: "farseer-fb-mt.firebaseapp.com",
  projectId: "farseer-fb-mt",
  storageBucket: "farseer-fb-mt.appspot.com",
  databaseURL: "https://farseer-fb-mt-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "1098213227546",
  appId: "1:1098213227546:web:f9dc4d0952e9740e63e5a3",
  measurementId: "G-9GKWGY5SQD"
};

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase(app);

export const checkAuth = (cb) => {
  return onAuthStateChanged(auth, cb);
};

export const createUser = (email, password) =>{
  return createUserWithEmailAndPassword(auth, email, password);
}

export const updateUserProfile = (user, username, profilePhotoUrl) => {
  return updateProfile(user, {
    displayName: username,
    photoURL: profilePhotoUrl
  });
}

export const saveUser = (user) => {
  return set(ref(db, "users/" + user.uid), {
    name: user.displayName,
    avatar: user.photoURL,
  });
}

export const signUserIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const signUserOut = () =>{
  return signOut(auth);
}








