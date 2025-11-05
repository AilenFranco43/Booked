import React from "react";

export function AlertPopup({ message, type }) {
  const alertStyle = {
    padding: "10px",
    marginBottom: "15px",
    border: type === "success" ? "1px solid green" : "1px solid red",
    color: type === "success" ? "green" : "red",
    backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
    borderRadius: "5px",
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
  };

  return <div style={alertStyle}>{message}</div>;
}
