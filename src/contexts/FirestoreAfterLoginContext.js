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
  const [usersStatus, setUsersStatus] = useState([]);
  const [contactsStatus, setContactsStatus] = useState([]);
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
      .onSnapshot((querySnapshot) => {
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

  async function deleteContact(user) {
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
          .delete();
      });
  }

  function statusChange() {
    firebaseDB.collection("status").onSnapshot(function (querySnapshot) {
      var status = [];
      querySnapshot.forEach(function (contact) {
        const tempData = contact.data();
        tempData.uid = contact.id;
        status.push(tempData);
      });
      setUsersStatus(status);
    });
  }

  function updateContactList() {
    allContacts.forEach((contact) => {
      allUsers.forEach((user) => {
        if (contact.uid === user.uid)
          firebaseDB
            .collection("users")
            .doc(currentUser.uid)
            .collection("contacts")
            .doc(contact.uid)
            .update({
              displayName: user.displayName,
              photoURL: user.photoURL,
            });
      });
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
    const unsubStatus = statusChange();
    return [unsubUsers, unsubContacts, unsubStatus];
  }, []);

  useEffect(() => {
    if (allUsers.length > 0 && allContacts.length > 0) {
      updateContactList();
    }
  }, [allUsers, allContacts]);

  useEffect(() => {
    setContactsStatus([]);
    getContacts.forEach((contact) => {
      setContactsStatus((prevContactsStatus) => [
        ...prevContactsStatus,
        ...usersStatus.filter((userstatus) => userstatus.uid === contact.uid),
      ]);
    });
  }, [usersStatus, getContacts]);

  useEffect(() => {
    console.log(contactsStatus);
  }, [contactsStatus]);

  const value = {
    getUsers,
    sendFriendRequest,
    allContacts,
    contactsStatus,
    getContacts,
    friendRequests,
    deleteContact,
    acceptFriendRequest,
    denyFriendRequest,
  };
  return (
    <FirestoreAfterLoginContext.Provider value={value}>
      {!loading && children}
    </FirestoreAfterLoginContext.Provider>
  );
}
