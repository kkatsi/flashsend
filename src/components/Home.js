import React from "react";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";

export default function Home() {
  return (
    <div
      className="dashboardContainer d-flex"
      style={{ width: "200vw", overflow: "hidden" }}
    >
      <LeftColumn />
      <RightColumn />
    </div>
  );
}
