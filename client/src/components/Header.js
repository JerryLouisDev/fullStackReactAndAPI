import React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.PureComponent {
  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    return (
      <header>
        <div className="wrap header">
          <div className="header--flex">
            <h1 className="header--logo">
              <a href="/">Courses </a>
            </h1>
            <nav>
              {authUser ? (
                <React.Fragment>
                  <ul className="header--signedin">
                    <span>Welcome, {authUser.firstName} {authUser.lastName}! </span>
                    <Link to="/signout">Sign Out</Link>
                  </ul>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ul className="header--signedout">
                    <li>
                      {" "}
                      <Link className="wrap header--flex" to="/signup">
                        Sign Up
                      </Link>{" "}
                    </li>
                    <li>
                      <Link className="wrap header--flex" to="/signin">
                        Sign In
                      </Link>{" "}
                    </li>
                  </ul>
                </React.Fragment>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}
