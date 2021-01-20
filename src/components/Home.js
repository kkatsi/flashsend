import React, { useEffect } from "react";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";
import { useAuth } from "../contexts/AuthContext";
import { FirestoreAfterLoginProvider } from "../contexts/FirestoreAfterLoginContext";
import { useFirestoreAfterLogin } from "../contexts/FirestoreAfterLoginContext";

export default function Home() {
  // const { allContacts } = useFirestoreAfterLogin();
  // useEffect(() => {
  //   console.log(allContacts);
  // }, []);
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
