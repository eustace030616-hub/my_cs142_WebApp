import React from "react";
import { Link } from "react-router-dom";


import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
      
    this.state = {
      user: [],
    };

    const userId = this.props.match.params.userId;
    fetchModel(`/user/${userId}`)
          .then(response => {
            this.setState({ user: response.data });
          });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      fetchModel(`/user/${this.props.match.params.userId}`)
          .then(response => {
            this.setState({ user: response.data });
          });
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
