import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyCrwbikbBSM0M8yFBXtdFvwOZko_kq5GZE",
    authDomain: "log-chimp-7f4d1.firebaseapp.com",
    databaseURL: "https://log-chimp-7f4d1.firebaseio.com",
    projectId: "log-chimp-7f4d1",
    storageBucket: "log-chimp-7f4d1.appspot.com",
    messagingSenderId: "391569845579"
};
var fire = firebase.initializeApp(config);

export default fire