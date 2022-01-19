// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyCSYAuZJTvV72rl87jBlFDUUVtBCjmE2w8",
  // authDomain: "capstone-files.firebaseapp.com",
  // projectId: "capstone-files",
  // storageBucket: "capstone-files.appspot.com",
  // messagingSenderId: "164055833728",
  // appId: "1:164055833728:web:a73048c88a9933d3339a65",

  apiKey: "AIzaSyC5XyjMFgdaKAoOrKSs0xVNEUYin0mOWRU",
  authDomain: "repository-4cebf.firebaseapp.com",
  projectId: "repository-4cebf",
  storageBucket: "repository-4cebf.appspot.com",
  messagingSenderId: "94561962420",
  appId: "1:94561962420:web:021ff7be8ca5ccc79fcae1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
};
