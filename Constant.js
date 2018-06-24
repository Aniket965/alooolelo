import firebase from "firebase";
const config = {
    apiKey: "AIzaSyAvi1WLV_K3GR-LBlaX9EVJ4t7Wd8XVIE8",
    authDomain: "dishathon-d0b1a.firebaseapp.com",
    databaseURL: "https://dishathon-d0b1a.firebaseio.com",
    projectId: "dishathon-d0b1a",
    storageBucket: "dishathon-d0b1a.appspot.com",
    messagingSenderId: "348125727548"
  };
firebase.initializeApp(config);

export const dataRef = firebase.database().ref("/data");