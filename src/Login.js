import React, { PureComponent } from "react";
import './styling/Login.css';

class Login extends PureComponent {
  render() {
    return (
      <div className="login">
        <h1>Trent University Chemistry Department</h1>

        <div className="login-box">

          <h2>Sign In</h2>
          <form>
            <label>
              Email:
              <input type="text" name="email" />
            </label>
            <label>
              Password:
              <input type="text" name="password" />
            </label>
            <input type="submit" value="Submit" />
          </form>

        </div>

      </div>
    );
  }
}
export default Login;