import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  //since nuxt executes ssr, we want to only execute once, since firebase handles that
  var firebaseConfig = {
    apiKey: 'AIzaSyD0jayuw2qBhqGxG2J2WmFIa-4xRmeY5eU',
    authDomain: 'ejukate-news.firebaseapp.com',
    projectId: 'ejukate-news',
    storageBucket: 'ejukate-news.appspot.com',
    messagingSenderId: '83922593096',
    appId: '1:83922593096:web:f7d63ced6bca8dfa983f7d',
    measurementId: 'G-Z2134T9DS1'
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  firebase.firestore().settings({
    timestampsInSnapshots: true
  })
}

const db = firebase.firestore()
export default db //export it so that other parts of our app can use it
