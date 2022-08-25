import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import IndexNavbar from "components/Navbars/IndexNavbar.js"
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";


export default function Admin() {

  const [auth, setAuth] = React.useState(true);

  const initialLoad = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/get-admin-authenticate-by-jwt`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("jwtToken", data.jwtToken);
        setAuth(true);
        return;
      }
      else {
        localStorage.removeItem("jwtToken");
        setAuth(false);
        return;
      }

    }
    catch (error) {
      alert(error?.message);
      return;
    }
  }

  useEffect(() => {

    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      setAuth(true);
    } else {
      setAuth(false);
      initialLoad();
    }
  }, [])


  return (
    <>
      <div className="relative bg-blueGray-100">
        <IndexNavbar transparent />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            {
              auth ?
                <>
                  <Route path="/admin/dashboard" exact component={Dashboard} />
                  <Route path="/admin/maps" exact component={Maps} />
                  <Route path="/admin/settings" exact component={Settings} />
                  <Route path="/admin/tables" exact component={Tables} />
                  <Redirect from="/admin" to="/admin/tables" />
                </>
                :
                <Redirect to="/" />
            }
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
