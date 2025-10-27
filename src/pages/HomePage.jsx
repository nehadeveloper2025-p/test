import React from "react";
import Header from "../components/Header";
import PayPage from "../components/PayPage";

export default function HomePage() {
  return (
    <div className="relative bg-(--color-light) mb-10">
      <PayPage />
    </div>
  );
}
