import React from "react";
export class Message extends React.Component {
  render() {
    return (
      <div className="message">
        <div>
          <b>{this.props.sender} : </b>
          <span>{this.props.text}</span>
        </div>
      </div>
    );
  }
}
