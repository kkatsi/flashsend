import React, { useContext, useState, useEffect } from "react";
import { auth, firebaseRT, firebaseDB } from "../firebase";
import firebase from "firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function sendEmailVerification(user) {
    return user.sendEmailVerification();
  }

  async function login(email, password) {
    return await auth
      .signInWithEmailAndPassword(email, password)
      .then(() => firebaseRT.goOnline());
  }

  function logout() {
    firebaseRT.goOffline();
    return auth.signOut();
  }

  function updateProfile(user, props) {
    return user.updateProfile({
      displayName: props.name,
      photoURL: props.url,
    });
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsVerified(false);
      setCurrentUser(user);
      if (user) {
        if (user.emailVerified) setIsVerified(true);
        else {
          auth.signOut();
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) FBRealTimePresence(currentUser);
  }, [currentUser]);

  const value = {
    currentUser,
    isVerified,
    signup,
    sendEmailVerification,
    updateProfile,
    updateEmail,
    updatePassword,
    resetPassword,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

function FBRealTimePresence(user) {
  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userStatusDatabaseRef = firebaseRT.ref("/status/" + user.uid);

  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  firebaseRT.ref(".info/connected").on("value", function (snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
      return;
    }

    // If we are currently connected, then use the 'onDisconnect()'
    // method to add a set which will only trigger once this
    // client has disconnected by closing the app,
    // losing internet, or any other means.
    userStatusDatabaseRef
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function () {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect()
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        // We can now safely set ourselves as 'online' knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
  });

  var userStatusFirestoreRef = firebaseDB.doc("/status/" + user.uid);

  // Firestore uses a different server timestamp value, so we'll
  // create two more constants for Firestore state.
  var isOfflineForFirestore = {
    state: "offline",
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  var isOnlineForFirestore = {
    state: "online",
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  firebaseRT.ref(".info/connected").on("value", function (snapshot) {
    if (snapshot.val() == false) {
      // Instead of simply returning, we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      userStatusFirestoreRef.set(isOfflineForFirestore);
      return;
    }

    userStatusDatabaseRef
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function () {
        userStatusDatabaseRef.set(isOnlineForDatabase);

        // We'll also add Firestore set here for when we come online.
        userStatusFirestoreRef.set(isOnlineForFirestore);
      });
  });
}
