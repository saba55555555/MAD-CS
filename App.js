import React, { useState } from "react";
import HomeScreen from "./screens/HomeScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import ContactScreen from "./screens/ContactScreen.js";

export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "profile") return <ProfileScreen />;
  if (screen === "settings") return <SettingsScreen />;
  if (screen === "contact") return <ContactScreen />;

  return (
    <HomeScreen
      goProfile={() => setScreen("profile")}
      goSettings={() => setScreen("settings")}
      goContact={() => setScreen("contact")}
    />
  );
}