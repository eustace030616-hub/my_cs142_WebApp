import React from "react";
import { Typography, TextField, Button, Paper } from "@mui/material";

import "./styles.css";
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_name: "",
            password: "",
            error: "",
        };
    }

    handleSubmit() {
        axios.post("/admin/login", {
            login_name: this.state.login_name,
            password: this.state.password,
        })
        .then(response => {
            this.props.onLogin(response.data._id);
        })
        .catch(error => {
            const serverMsg = error.response?.data?.error || "login failed"
            this.setState({ error: serverMsg });
        });
    }

    render() {
        return(
            <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>

                <TextField
                fullWidth
                label="Username"
                value={this.state.login_name}
                onChange={(e) => this.setState({ login_name: e.target.value })}
                sx={{ mb: 2 }}
                />

                <TextField
                fullWidth
                label="Password"
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                sx={{ mb: 2 }}
                />

                <Button
                variant="contained"
                fullWidth
                onClick={() => this.handleSubmit()}
                >
                Submit
                </Button>

                {this.state.error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {this.state.error}
                </Typography>
                )}
            </Paper>
        );
    }
}

export default LoginRegister;