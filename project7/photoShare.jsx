import React from "react";
import ReactDOM from "react-dom";
import { Grid, Paper } from "@mui/material";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister"
import axios from 'axios';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFeatures: false,
      userIsLoggedIn: false,
      loggedinUserId: null,
      loadingSession: true,
    };
  }

  componentDidMount() {
    axios.get("/admin/session")
      .then(response => {
        this.setState({
          userIsLoggedIn: true,
          loggedinUserId: response.data._id,
          loadingSession: false,
        });
      })
      .catch(() => {
        this.setState({ loadingSession: false });
      });
  }

  handleToggleAdvanced() {
    this.setState(function (prevState) {
      return { advancedFeatures: !prevState.advancedFeatures };
    });
  }

  handleLogin(userId) {
    this.setState({
      userIsLoggedIn: true,
      loggedinUserId: userId,
    });
  }

  handleLogout(userId) {
    this.setState({
      userIsLoggedIn: false,
      loggedinUserId: null,
    });
    window.location.hash = '#/';
  }

  render() {
    if (this.state.loadingSession) {
      return <div />;
    }

    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedFeatures={this.state.advancedFeatures}
                onToggleAdvanced={() => this.handleToggleAdvanced()}
                userIsLoggedIn={this.state.userIsLoggedIn}
                onLogout={() => this.handleLogout()}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" style={{ marginTop: 70 }} />
            <Grid item sm={3}>
              <Paper
                className="cs142-main-grid-item"
                sx={{
                  height: "calc(100vh - 85px)",
                  overflow: "auto",
                  minWidth: 200,
                }}
              >
                {this.state.userIsLoggedIn ? (
                  <UserList />
                ) : (
                  <div>Please login</div>
                )}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper
                className="cs142-main-grid-item"
                sx={{
                  height: "calc(100vh - 85px)",
                  overflow: "auto",
                }}
              >
                <Switch>
                  
                  <Route exact path="/">
                    {this.state.userIsLoggedIn ? (
                      <Redirect to={`/photos/${this.state.loggedinUserId}`} />
                    ) : (
                      <LoginRegister
                        onLogin={(userId) => this.handleLogin(userId)}
                      />
                    )}
                  </Route>

                  <Route
                    path="/users/:userId"
                    render={(props) => (
                      this.state.userIsLoggedIn ? (
                        <UserDetail {...props} />
                      ) : (
                        <LoginRegister onLogin={(userId) => this.handleLogin(userId)} />
                      )
                    )}
                  />

                  <Route
                    path="/photos/:userId"
                    render={(props) =>
                      this.state.userIsLoggedIn ? (
                        <UserPhotos
                          {...props}
                          advancedFeatures={this.state.advancedFeatures}
                        />
                      ) : (
                        <LoginRegister onLogin={(userId) => this.handleLogin(userId)} />
                      )
                    }
                  />

                  <Route path="/users" component={UserList} />

                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
