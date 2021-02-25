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
      <div className="dashboardContainer d-flex" style={{ maxHeigth: "100vh" }}>
        <LeftColumn style={{ maxHeight: "100vh" }} />
        <RightColumn style={{ maxHeight: "100vh" }} />
      </div>
    </FirestoreAfterLoginProvider>
  );
}
