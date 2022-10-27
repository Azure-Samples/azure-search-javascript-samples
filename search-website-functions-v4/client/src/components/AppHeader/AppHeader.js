import React from "react";
import AppHeaderAuth from "../AppHeaderAuth/AppHeaderAuth";
import { Link } from "react-router-dom";

import logo from "../../images/microsoft_small.png";

import "./AppHeader.css";

export default function AppHeader() {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <Link className="navbar-brand" to={`/`}>
          <img src={logo} height="50" className="navbar-logo" alt="Microsoft" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/Search">
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                href="https://azure.microsoft.com/services/search/"
              >
                Learn more
              </Link>
            </li>
          </ul>
        </div>

        <AppHeaderAuth />
      </nav>
    </header>
  );
}
