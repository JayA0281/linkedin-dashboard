import { useState } from "react";
import Dashboard from "./Dashboard";

const USERNAME = "admin";
const PASSWORD = "cleverdev2026";

export default function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  function handleLogin() {

    if (
      username === USERNAME &&
      password === PASSWORD
    ) {

      setIsAuthenticated(true);

    } else {

      alert("Invalid credentials");
    }
  }

  if (!isAuthenticated) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F8FAFC]
        px-6
      ">

        <div className="
          w-full
          max-w-md
          bg-white
          border border-[#E2E8F0]
          rounded-[32px]
          p-10
          shadow-sm
        ">

          <div className="
            text-sm
            tracking-[0.25em]
            uppercase
            text-[#2563EB]
            font-semibold
          ">
            CleverDev Intelligence
          </div>

          <h1 className="
            text-4xl
            font-semibold
            mt-5
            leading-tight
          ">
            Secure Dashboard Access
          </h1>

          <div className="mt-8 space-y-4">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="
                w-full
                border border-[#E2E8F0]
                rounded-2xl
                px-5 py-4
                outline-none
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                border border-[#E2E8F0]
                rounded-2xl
                px-5 py-4
                outline-none
              "
            />

            <button
              onClick={handleLogin}
              className="
                w-full
                bg-[#2563EB]
                text-white
                rounded-2xl
                py-4
                font-medium
              "
            >
              Access Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  return <Dashboard />;
}