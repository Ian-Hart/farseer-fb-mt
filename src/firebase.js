// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";

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

export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getDatabase(app);




