import React from "react";
import { Switch, Route } from "react-router-dom";
import ConversationLayout from "./ConversationLayout";
import { useLocation } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

export default function RightColumn() {
  const location = useLocation();
  return (
    <div className="rightColumn min-vh-100 bg-dark d-flex justify-content-center">
      {location.pathname === "/" && (
        <div className="emptySection align-self-center d-flex flex-column align-items-center text-light">
          <div
            className="iconContainer d-flex justify-content-center align-items-center"
            style={{
              width: "100px",
              height: "100px",
              border: "1px solid white",
              borderRadius: "50%",
            }}
          >
            <FaPaperPlane style={{ fontSize: "3em", marginRight: ".5rem" }} />
          </div>
          <span className="mt-4">
            Select or start a conversation to display
          </span>
        </div>
      )}
      <Switch>
        <Route path="/:id" component={ConversationLayout} />
      </Switch>
    </div>
  );
}
