import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Divider,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import "./styles.css";
import axios from 'axios';

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    axios.get(`/user/list/`)
      .then(response => {
        this.setState({ users: response.data });
      });
  }

  render() {
    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {this.state.users.map(user => (
          <div key={user._id}>
            <ListItemButton onClick={() => this.props.history.push(`/photos/${user._id}`)}>
              <ListItemText>
                <Link to={`/users/${user._id}`} onClick={(e) => e.stopPropagation()}>
                  {user.first_name} {user.last_name}
                </Link>
              </ListItemText>
            </ListItemButton>
            <Divider variant="middle"/>
          </div>

        ))}
      </List>
    );
  }
}

export default withRouter(UserList);
