// Import the functions you need from the SDKs you need
import firebase  from "firebase/app";
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

const config = {
  apiKey: "AIzaSyAQBlUDlJFdlsaLSGO3Kpsgmyx1PfG4JbM",
  authDomain: "farseer-fb-mt.firebaseapp.com",
  projectId: "farseer-fb-mt",
  storageBucket: "farseer-fb-mt.appspot.com",
  messagingSenderId: "1098213227546",
  appId: "1:1098213227546:web:f9dc4d0952e9740e63e5a3",
  measurementId: "G-9GKWGY5SQD"
};


firebase.initializeApp(config);

export default firebase;
