import React from "react";
import ReactDOM from "react-dom";
import Example from "./components/Example";
import States from "./components/States";

class ViewSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { view: "example" };
    }

    render() {
        return (
            <div style={{ textAlign: "left", marginTop: "20px" }}>
                <button className="switch-btn" onClick={() => {
                    this.setState({ view: this.state.view === "example" ? "states" : "example" });
                }}>
                    Switch to {this.state.view === "example" ? "States" : "Example"}
                </button>
                {this.state.view === "example" ? <Example /> : <States />}
            </div>
        );
    }
}

ReactDOM.render(<ViewSwitch/>, document.getElementById("reactapp"));