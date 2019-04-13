import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';

class FacultyDashboard extends PureComponent {
    constructor(props) {
        super(props);
      }
  render() {
    return (
        <div>
          <h1>Welcome, {this.props.name}</h1>
  
        </div>
      );
  }
}
export default FacultyDashboard;