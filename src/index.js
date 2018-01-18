import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

import firebase from 'firebase/app'

firebase.initializeApp({
  apiKey: 'AIzaSyD_6rgKCy6-EwjkM7xaJEgdGKwmmEEcTGs',
  authDomain: 'bibic-vendeghaza-1501339026788.firebaseapp.com',
  databaseURL: 'https://bibic-vendeghaza-1501339026788.firebaseio.com',
  projectId: 'bibic-vendeghaza-1501339026788',
  storageBucket: 'bibic-vendeghaza-1501339026788.appspot.com',
  messagingSenderId: '159494803934'
})

ReactDOM.render(<App/>, document.getElementById('root'))
