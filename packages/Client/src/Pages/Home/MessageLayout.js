import React from "react";
import { Message } from "./Message";
import axios from 'axios';

let textInput = React.createRef();

axios.defaults.withCredentials = true;

export class MessageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      friendSelected: false
    };

    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(this.getMessages, 500)
    this.getMessages()
  }

  componentDidUpdate(prevProps) {
    if (this.props.friend !== prevProps.friend) {
      this.getMessages()
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  getMessages() {
    console.log('get message')
    console.log(this.props.friend)
    const options = {
      method: 'GET',
      url: 'http://localhost:3001/getMessages',
      params: { target: this.props.friend },
      credentials: true
    }
    axios.request(options).then((response) => {
      if (response.data) {
        var sortedMessages = response.data.sort((function (a, b) {
          return new Date(a.timestamp) - new Date(b.timestamp)
        }));

        this.setState({ messages: sortedMessages.map(newMessage => ({ sender: newMessage.sender, text: newMessage.message, id: 'random' })) })
      }
      else {
        this.setState({ messages: [] })
      }
    }).catch((error) => {
      console.error(error)
      alert("Bad")
    })
  }

  sendMessage() {
    const options = {
      method: 'GET',
      url: 'http://localhost:3001/send',
      params: { text: textInput.current.value, receiver: this.props.friend },
      credentials: true
    }
    axios.request(options).then((response) => {
      document.getElementById("text").value = ''
    }).catch((error) => {
      console.error(error)
      alert("Bad")
    })
  }

  handleClick = () => {
    this.sendMessage()
    this.getMessages()
  }

  render() {
    return (
      <div className="message-layout">
        <div className="conversation">{this.state.messages.map(convertJsonMessageToHtml)}</div>
        <div className="text-box">
          <input id="text" ref={textInput} placeholder="Type a message..." />
          <button onClick={this.handleClick}>Send</button>
        </div>
      </div>
    );
  }
}

function convertJsonMessageToHtml(message) {
  return (
    <Message
      id={message.id}
      sender={message.sender}
      text={message.text}
    ></Message>
  );
}