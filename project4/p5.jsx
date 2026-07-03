import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";
import Example from "./components/Example";
import States from "./components/States";


class ViewSwitch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <Link to="/states" style={{
                        padding: "10px 20px",
                        marginRight: "10px",
                        background: "#4a90d9",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }}>
                        States
                    </Link>
                    <Link to="/example" style={{  
                        padding: "10px 20px",
                        marginRight: "10px",
                        background: "#4a90d9",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }}>
                        Example
                    </Link>
                    
                    <Route path="/states" component={States}/>
                    <Route path="/example" component={Example}/>
                </div>
            </HashRouter>
        );
    }
}

ReactDOM.render(<ViewSwitch/>, document.getElementById("reactapp"));