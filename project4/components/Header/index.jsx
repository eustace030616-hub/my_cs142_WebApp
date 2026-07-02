import React from "react";
import "./style.css";
import theRockGif from "./resources/the-rock_small.gif";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flashColor: null
        };
        this.clickSound = new Audio("/components/Header/resources/metalbar-falling-sound.mp3");
    }

    handleClick = () => {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});

        // Rainbow flash
        const colors = ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#4400ff", "#ff00ff"];
        let i = 0;
        const interval = setInterval(() => {
            this.setState({ flashColor: colors[i % colors.length] });
            i++;
            if (i >= colors.length) {
                clearInterval(interval);
                this.setState({ flashColor: null });
            }
        }, 70);
    };

    render() {
        return (
            <header
                className="creative-header"
                onClick={this.handleClick}
                style={this.state.flashColor ? { background: this.state.flashColor } : undefined}
            >
                <img
                    src={theRockGif}
                    alt="Animated header"
                    className="header-gif"
                />
                <div className="header-text">
                    <h1>CS142</h1>
                    <p className="header-subtitle">Click surprise</p>
                </div>
                <img
                    src={theRockGif}
                    alt="Animated header"
                    className="header-gif-mirror"
                />
            </header>
        );
    }
}

export default Header;