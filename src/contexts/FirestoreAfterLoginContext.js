import React, { useContext, useEffect, useState } from "react";
import { firebaseDB } from "../firebase";
import { useAuth } from "./AuthContext";

const FirestoreAfterLoginContext = React.createContext();

export function useFirestoreAfterLogin() {
  return useContext(FirestoreAfterLoginContext);
}

export function FirestoreAfterLoginProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [getContacts, setGetContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  function getAllUsers() {
    return firebaseDB
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        var users = [];
        querySnapshot.forEach(function (user) {
          const tempData = user.data();
          tempData.uid = user.id;
          users.push(tempData);
        });
        setAllUsers(users);
      });
  }

  function getUsers(name) {
    return allUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(name.toLowerCase()) &&
        user.displayName !== currentUser.displayName
    );
  }

  function getAllContacts() {
    setLoading(true);
    firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .get()
      .then((querySnapshot) => {
        var contacts = [];
        querySnapshot.forEach(function (contact) {
          const tempData = contact.data();
          tempData.uid = contact.id;
          contacts.push(tempData);
        });
        setAllContacts(contacts);
        setFriendRequests(
          contacts.filter((contact) => contact.accepted === false)
        );
        setGetContacts(
          contacts.filter((contact) => contact.accepted !== false)
        );
        setLoading(false);
      });
  }

  async function sendFriendRequest(user) {
    return await firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .set({
        displayName: user.displayName,
        accepted: true,
        photoURL: user.photoURL,
      })
      .then(() => {
        firebaseDB
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .set({
            displayName: currentUser.displayName,
            accepted: false,
            photoURL: currentUser.photoURL,
          });
      });
  }

  async function acceptFriendRequest(user) {
    return await firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .update({
        accepted: true,
      })
      .then(() => {
        firebaseDB
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .update({
            accepted: true,
          })
          .then(() => {
            setFriendRequests(
              friendRequests.filter((contact) => user.uid !== contact.uid)
            );
          });
      });
  }

  async function denyFriendRequest(user) {
    return await firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .delete()
      .then(() => {
        firebaseDB
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .delete()
          .then(() => {
            setFriendRequests(
              friendRequests.filter((contact) => user.uid !== contact.uid)
            );
          });
      });
  }

  useEffect(() => {
    const unsubUsers = getAllUsers();
    const unsubContacts = getAllContacts();
    return [unsubUsers, unsubContacts];
  }, []);

  const value = {
    getUsers,
    sendFriendRequest,
    allContacts,
    getContacts,
    friendRequests,
    acceptFriendRequest,
    denyFriendRequest,
  };
  return (
    <FirestoreAfterLoginContext.Provider value={value}>
      {!loading && children}
    </FirestoreAfterLoginContext.Provider>
  );
}
