import React from "react";
import { MessageLayout } from "./MessageLayout";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { DefaultMessageLayout } from "./DefaultMessageLayout";
import axios from 'axios';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendList: [],
      selectedFriend: null
    };
    this.updateFriendSelected = this.updateFriendSelected.bind(this);
    this.getFriendPanel = this.getFriendPanel.bind(this);
  }

  componentDidMount() {
    const options = {
      method: 'GET',
      url: 'http://localhost:3001/friends',
      credentials: true
    }

    axios.request(options).then((response) => {
      this.setState({ friendList: response.data.map(friend => ({ name: friend })) })
    }).catch((error) => {
      console.error(error)
      alert("Bad")
    })
  }

  updateFriendSelected(friend) {
    this.setState({ selectedFriend: friend })
    console.log('selected')
    console.log(friend)
  }

  getFriendPanel(friend) {
    return <div className="friend-panel" onClick={() => this.updateFriendSelected(friend.name)}>
      <div>{friend.name}</div>
    </div>
  }

  render() {
    let messageLayout = <DefaultMessageLayout />
    if (this.state.selectedFriend) {
      messageLayout = <MessageLayout friend={this.state.selectedFriend} />
    }
    return (
      <div className="home-page">
        <div className="friend-list">{this.state.friendList.map(this.getFriendPanel)}</div>;
        {messageLayout}
      </div>
    );
  }
}

function HomeN(props) {
  let navigate = useNavigate();
  return <Home {...props} navigate={navigate} />;
}

export default HomeN;
