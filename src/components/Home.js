import React, { useEffect } from "react";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";
import { useAuth } from "../contexts/AuthContext";
import { FirestoreAfterLoginProvider } from "../contexts/FirestoreAfterLoginContext";
import { firebaseRT } from "../firebase";
import firebase from "firebase";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <FirestoreAfterLoginProvider>
      <div
        className="dashboardContainer d-flex"
        style={{ width: "200vw", overflow: "hidden" }}
      >
        <LeftColumn />
        <RightColumn />
      </div>
    </FirestoreAfterLoginProvider>
  );
}
