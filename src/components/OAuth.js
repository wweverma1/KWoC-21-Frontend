import React, { useEffect } from "react";
import { BACKEND_URL } from "../constants/constants";

export default function MentorOAuth(props) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const URL = `${BACKEND_URL}/oauth`;
    const data = {
      code: code,
      state: state,
    };

    fetch(URL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        //storing the respective JWT and username in localStorage
        // and if a old user, redirecting them to their dashboards
        const userData = {
          username: res.username,
          name: res.name,
          email: res.email,
        };

        if (res.type === "mentor") {
          localStorage.setItem("mentor_jwt", res.jwt);
          localStorage.setItem("mentor_username", res.username);
          if (!res["isNewUser"]) props.history.push("/dashboard/mentor");
          else
            props.history.push({
              pathname: `/form/${res.type}`,
              state: userData,
            });
        } else if (res.type === "student") {
          localStorage.setItem("student_jwt", res.jwt);
          localStorage.setItem("student_username", res.username);
          if (!res["isNewUser"]) props.history.push("/dashboard/student");
          else
            props.history.push({
              pathname: `/form/${res.type}`,
              state: userData,
            });
        }
      })
      .catch((err) => {
        alert("Server Error! Please try again");
      });
  }, []);

  return (
    <div>
      <h1>Loading ...</h1>
    </div>
  );
}
