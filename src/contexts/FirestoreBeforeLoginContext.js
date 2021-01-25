import React, { useContext, useEffect, useState } from "react";
import { firebaseDB } from "../firebase";
import { useAuth } from "./AuthContext";

const FirestoreBeforeLoginContext = React.createContext();

export function useFirestoreBeforeLogin() {
  return useContext(FirestoreBeforeLoginContext);
}

export function FirestoreBeforeLoginProvider({ children }) {
  const { currentUser } = useAuth();

  async function createUser(user) {
    return await firebaseDB
      .collection("users")
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
      .then(() => {
        firebaseDB
          .collection("status")
          .doc(user.uid)
          .set({ state: null, last_changed: null })
          .then(() => {
            firebaseDB
              .collection("messages")
              .doc(user.uid)
              .set({ created: true });
          });
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
