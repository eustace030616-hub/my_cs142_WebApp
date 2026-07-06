import React from "react";
import { Link } from "react-router-dom";


import "./styles.css";

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    //get userId from URL
    const userId = this.props.match.params.userId;

    //get user from model with userId
    const user = window.cs142models.userModel(userId);

    this.state = {
      user: user,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      const user = window.cs142models.userModel(this.props.match.params.userId);
      this.setState({ user: user });
    }
  }

  render() {
    return (
      <div>
        <h2>{this.state.user.first_name} {this.state.user.last_name}</h2>
        <Link to={`/photos/${this.props.match.params.userId}`}>View Photos</Link>
        <p>userId: {this.props.match.params.userId}</p>
        <p>Description: {this.state.user.description}</p>
        <p>Location: {this.state.user.location}</p>
        <p>Occupation: {this.state.user.occupation}</p>
      </div>

    );
  }
}

export default UserDetail;
