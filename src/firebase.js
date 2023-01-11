// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

import { getStorage } from "firebase/storage";

import { uuidv4 as uuid } from "@firebase/util";

const config = {
  apiKey: "AIzaSyAQBlUDlJFdlsaLSGO3Kpsgmyx1PfG4JbM",
  authDomain: "farseer-fb-mt.firebaseapp.com",
  projectId: "farseer-fb-mt",
  storageBucket: "farseer-fb-mt.appspot.com",
  databaseURL:
    "https://farseer-fb-mt-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "1098213227546",
  appId: "1:1098213227546:web:f9dc4d0952e9740e63e5a3",
  measurementId: "G-9GKWGY5SQD",
};

const app = initializeApp(config);
const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export const checkAuth = (cb) => {
  return onAuthStateChanged(auth, cb);
};

export const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const updateUserProfile = (user, username, profilePhotoUrl) => {
  return updateProfile(user, {
    displayName: username,
    photoURL: profilePhotoUrl,
  });
};


export const saveUser = (user) => {
  return set(ref(db, "users/" + user.uid), {
    id: user.uid,
    name: user.displayName,
    avatar: user.photoURL,
  });
};

export const currentUser = () =>{
  return auth.currentUser;
}


export const signUserIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUserOut = () => {
  return signOut(auth);
};

export const addStream = (stream) => {
  return set(ref(db, "streams/" + stream.id), {
    id: stream.id,
    name: stream.streamName,
    details: stream.streamDetails,
    createdBy: stream.user,
  });
};

export const usersRef = () => {
  return ref(db, "users");
};

export const streamsRef = () => {
  return ref(db, "streams");
};

export const addMessage = (msgRef, message) => {
  const msgStreamRef = push(msgRef);
  return set(msgStreamRef, message);
};

export const getMessagesRef = (privateStream, streamId) => {
  if(privateStream){
    return privateMessagesRef(streamId);
  }else{
    return messagesRef(streamId);
  }
};

export const messagesRef = (streamId) => {
  return ref(db, "messages/" + streamId);
};

export const privateMessagesRef = (streamId) => {
  return ref(db, "privateMessages/" + streamId);
};

export const connectedRef = () => {
  return ref(db, ".info/connected");
};

export const presenceRef = () => {
  return ref(db, "presence");
};

export const presenceUserRef = (userId) => {
  return ref(db, "presence/" + userId);
};

export const userStarredRef = (userId) => {
  return ref(db, "users/" + userId + "/starred");
}

export const userStarredRefStreamId = (userId, streamId) => {
  return ref(db, "users/" + userId + "/starred/" + streamId);
}

export const userColorsRef = (userId) => {
  return ref(db, "users/" + userId + "/colors/" + uuid());
}

export const userColorsListRef = (userId) => {
  return ref(db, "users/" + userId + "/colors/");
}


