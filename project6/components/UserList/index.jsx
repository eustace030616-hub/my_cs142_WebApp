import React from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";


/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    fetchModel(`/user/list/`)
      .then(response => {
        this.setState({ users: response.data });
      });
  }

  render() {
    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {this.state.users.map(user => (
          <div key={user._id}>
            <ListItemButton component={Link} to={`/users/${user._id}`}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`}/>
            </ListItemButton>
            <Divider variant="middle"/>
          </div>

        ))}
      </List>
    );
  }
}

export default UserList;
