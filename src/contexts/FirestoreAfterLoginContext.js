import React, { useContext, useEffect, useState } from "react";
import { firebaseDB } from "../firebase";
import { useAuth } from "./AuthContext";
import firebase from "firebase";

const FirestoreAfterLoginContext = React.createContext();

export function useFirestoreAfterLogin() {
  return useContext(FirestoreAfterLoginContext);
}

export function FirestoreAfterLoginProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [usersStatus, setUsersStatus] = useState([]);
  const [contactsStatus, setContactsStatus] = useState([]);
  const [tempContactsStatus, setTempContactsStatus] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [getContacts, setGetContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [allMessagesLength, setAllMessagesLength] = useState();
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

  function getAllConversations() {
    setLoading(true);
    firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .orderBy("time", "desc")
      .onSnapshot((querySnapshot) => {
        var contacts = [];
        querySnapshot.forEach(function (contact) {
          const tempData = contact.data();
          tempData.uid = contact.id;
          contacts.push(tempData);
        });
        setAllConversations(
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
      .doc(user.uid)
      .collection("contacts")
      .doc(currentUser.uid)
      .set({
        displayName: currentUser.displayName,
        accepted: false,
        photoURL: currentUser.photoURL,
        hasMessages: false,
        lastMessage: "",
        time: null,
        alert: false,
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
          .set({
            displayName: currentUser.displayName,
            accepted: true,
            photoURL: currentUser.photoURL,
            hasMessages: false,
            lastMessage: "",
            time: null,
            alert: false,
          })
          .then(() => {
            firebaseDB
              .collection("messages")
              .doc(user.uid)
              .collection("contacts")
              .doc(currentUser.uid)
              .set({ messages: [] })
              .then(() => {
                firebaseDB
                  .collection("messages")
                  .doc(currentUser.uid)
                  .collection("contacts")
                  .doc(user.uid)
                  .set({ messages: [] })
                  .then(() => {
                    setFriendRequests(
                      friendRequests.filter(
                        (contact) => user.uid !== contact.uid
                      )
                    );
                  });
              });
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
        setFriendRequests(
          friendRequests.filter((contact) => user.uid !== contact.uid)
        );
      });
  }

  async function setHasMessages(user) {
    return await firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .update({ hasMessages: true })
      .then(() => {
        firebaseDB
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .update({
            hasMessages: true,
          });
      });
  }

  async function setLastMessage(user, msg) {
    console.log(msg);
    return await firebaseDB
      .collection("users")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .update({
        lastMessage: `You: ${msg}`,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        alert: false,
      })
      .then(() => {
        firebaseDB
          .collection("users")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .update({
            lastMessage: `${currentUser.displayName.substr(
              0,
              currentUser.displayName.indexOf(" ")
            )}: ${msg}`,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            alert: true,
          });
      });
  }

  async function getAllMessages(user) {
    return await firebaseDB
      .collection("messages")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .collection("messages")
      .orderBy("time", "desc")
      .onSnapshot(function (querySnapshot) {
        var mes = [];
        querySnapshot.forEach(function (doc) {
          mes.push(doc.data());
        });
        setAllMessagesLength(mes.length);
        setAllMessages(mes);
        setMessages(mes.filter((message, index) => index < 20));
      });
  }

  function getMessages(from, mes) {
    setMessages((prevMessages) => {
      return [
        ...prevMessages,
        ...mes.filter((message, index) => index >= from && index < from + 20),
      ];
    });
  }

  async function sendMessage(msg, user) {
    return await firebaseDB
      .collection("messages")
      .doc(currentUser.uid)
      .collection("contacts")
      .doc(user.uid)
      .collection("messages")
      .doc()
      .set({
        message: msg,
        user: currentUser.displayName,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        firebaseDB
          .collection("messages")
          .doc(user.uid)
          .collection("contacts")
          .doc(currentUser.uid)
          .collection("messages")
          .doc()
          .set({
            message: msg,
            user: currentUser.displayName,
            time: firebase.firestore.FieldValue.serverTimestamp(),
          });
      });
  }

  useEffect(() => {
    const unsubUsers = getAllUsers();
    const unsubContacts = getAllContacts();
    const unsubStatus = statusChange();
    const unsubConversations = getAllConversations();
    return [unsubUsers, unsubContacts, unsubStatus, unsubConversations];
  }, []);

  useEffect(() => {
    if (allUsers.length > 0 && allContacts.length > 0) {
      updateContactList();
    }
  }, [allUsers, allContacts]);

  useEffect(() => {
    setContactsStatus([]);
    setTempContactsStatus([]);
    getContacts.forEach((contact) => {
      setTempContactsStatus((prevTempContactsStatus) => [
        ...prevTempContactsStatus,
        ...usersStatus.filter((userstatus) => userstatus.uid === contact.uid),
      ]);
    });
  }, [usersStatus, getContacts]);

  useEffect(() => {
    setContactsStatus(tempContactsStatus);
  }, [tempContactsStatus]);

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
    sendMessage,
    messages,
    getMessages,
    getAllMessages,
    allMessages,
    allMessagesLength,
    setHasMessages,
    setLastMessage,
    allConversations,
  };
  return (
    <FirestoreAfterLoginContext.Provider value={value}>
      {!loading && children}
    </FirestoreAfterLoginContext.Provider>
  );
}
