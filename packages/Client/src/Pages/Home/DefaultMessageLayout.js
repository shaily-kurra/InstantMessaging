import React from "react";

let textInput = React.createRef();

export class DefaultMessageLayout extends React.Component {
  render() {
    return (
      <div className="message-layout">
        <div className="conversation"><div className="empty-message-list">No messages to display</div></div>
        <div className="text-box">
          <input id="text" ref={textInput} placeholder="Choose a conversation from the left panel" />
        </div>
      </div>
    );
  }
}