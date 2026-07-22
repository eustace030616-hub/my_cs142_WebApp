import React from "react";
import { AppBar, Toolbar, Typography, Switch, FormControlLabel, Button } from "@mui/material";
import { Box } from "@mui/system";
import { withRouter } from "react-router-dom";

import "./styles.css";
import axios from 'axios';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      version: '',
    };
  }

  componentDidMount() {
      axios.get('/user/list')
      .then(response => this.setState({ userList: response.data}));

      axios.get('/test/info')
      .then(response => this.setState({ version: response.data.__v}));
    }

  handleLogout() {
    axios.post("/admin/logout")
      .then(() => {
        this.props.onLogout();
      })
      .catch(() => {});
  }

  getTitle() {
    const path = this.props.location.pathname;

    const match = path.match(/^\/(users|photos)\/(.+)$/);
    if (match) {
      const userId = match[2].split("?")[0];
      const user =
        this.state.userList.find((u) => u._id === userId);

      if (match[1] === "photos") {
        return user
          ? `Photos of ${user.first_name} ${user.last_name}`
          : "Photos";
      }
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

          <FormControlLabel
            control={
              <Switch
                checked={this.props.advancedFeatures}
                onChange={this.props.onToggleAdvanced}
                color="default"
                size="small"
              />
            }
            label="Advanced"
            sx={{ ml: 2, color: "inherit" }}
          />
          {this.props.userIsLoggedIn && (
            <Button
              color="inherit"
              size="small"
              onClick={() => this.handleLogout()}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
