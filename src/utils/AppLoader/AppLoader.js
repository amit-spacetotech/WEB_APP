import * as React from "react";

export default function AppLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width:"100%",
        justifyContent: "center",
        minHeight: "85vh",
        height: "100%",
        color: "#F8CD46",
      }}
    >
      <div className="spinner-border" />
    </div>
  );
}
