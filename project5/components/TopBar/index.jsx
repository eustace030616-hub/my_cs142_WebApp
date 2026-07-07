import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { withRouter } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      version: '',
    };
  }

  componentDidMount() {
      fetchModel('/user/list')
      .then(response => this.setState({ userList: response.data}));

      fetchModel('/test/info')
      .then(response => this.setState({ version: response.data.__v}));
    }

  getTitle() {
    const path = this.props.location.pathname;

    // Extract userId from /users/:userId or /photos/:userId
    const match = path.match(/^\/(users|photos)\/(.+)$/);
    if (match) {
      const userId = match[2];
      const user =
        this.state.userList.find((u) => u._id === userId);

      if (match[1] === "photos") {
        return user
          ? `Photos of ${user.first_name} ${user.last_name}`
          : "Photos";
      }
      // match[1] === "users"
      return user ? `${user.first_name} ${user.last_name}` : "User Detail";
    }

    if (path === "/users") return "Users";
    return "PhotoSharing";
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Typography variant="h5" color="inherit">
              PhotoSharing
            </Typography>
            <Typography variant="caption" color="inherit">
              Eustace Holmes
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            color="inherit"
            sx={{ ml: "auto" }}
          >
            {this.getTitle()}
          </Typography>
          <Typography variant="caption" color="inherit" sx={{ ml:2}}>
            version {this.state.version}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
