import React from "react";
import "./styles.css";
import Header from "../Header";
/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      substringInput: ""
    };
  }

  handelInputChange = (event) => {
    this.setState({ substringInput: event.target.value });
  }
  
  getFilteredStates() {
    const allStates = window.cs142models.statesModel();

    if (!this.state.substringInput) {
      return allStates;
    }
    return allStates.filter(state =>
      state.toLowerCase().includes(this.state.substringInput.toLowerCase()));
    
  }

  render() {
    const filteredStates = this.getFilteredStates();

    return (
    <div className="cs142-problem2-header">
      <Header />
      <div className="cs142-states-input"> 
        <p>
          <label htmlFor="substringInput">search for state names: </label>
            <input
              id="substringInput"
              type="text"
              value={this.state.substringInput}
              onChange={this.handelInputChange}
            />
        </p>
      </div>

      <div className="cs142-states-list">
        {filteredStates.length > 0 ? (
          filteredStates.map((state, index) => <p key={index}>{state}</p>)) : (
            <p>No Match</p>
          )}
      </div>
    </div>
  );
  }
}

export default States;
