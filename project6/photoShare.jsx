import React from "react";
import ReactDOM from "react-dom";
import { Grid, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFeatures: false,
    };
  }

  handleToggleAdvanced() {
    this.setState(function (prevState) {
      return { advancedFeatures: !prevState.advancedFeatures };
    });
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedFeatures={this.state.advancedFeatures}
                onToggleAdvanced={() => this.handleToggleAdvanced()}
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
                <UserList />
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
                  <Route
                    path="/users/:userId"
                    render={(props) => <UserDetail {...props} />}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => (
                      <UserPhotos
                        {...props}
                        advancedFeatures={this.state.advancedFeatures}
                      />
                    )}
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
