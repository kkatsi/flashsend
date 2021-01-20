import React, { useContext, useEffect } from "react";
import { firebaseDB } from "../firebase";

const FirestoreBeforeLoginContext = React.createContext();

export function useFirestoreBeforeLogin() {
  return useContext(FirestoreBeforeLoginContext);
}

export function FirestoreBeforeLoginProvider({ children }) {
  function createUser(user) {
    return firebaseDB.collection("users").doc(user.uid).set({
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  }
  function updateUser(user) {
    return firebaseDB.collection("users").doc(user.uid).update({
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  }

  const value = {
    createUser,
    updateUser,
  };
  return (
    <FirestoreBeforeLoginContext.Provider value={value}>
      {children}
    </FirestoreBeforeLoginContext.Provider>
  );
}
