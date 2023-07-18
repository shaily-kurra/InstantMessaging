import React  from "react";
import {ReactComponent as Logo} from '../../logo.svg';
import './Login.css';
import {useNavigate} from 'react-router-dom';

const axios = require("axios");

const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  }; 

class Login extends React.Component {
    state = {
        uname: '',
        password: '',
        errors: {
            uname: '',
            password: '',
          }
    }

    handleChange = (e) => {
        const {name,value} = e.target
        this.setState({[name]:value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(validateForm(this.state.errors)) {
            const options = {
                method: 'GET',
                url: 'http://localhost:3001/userlogin',
                params: {uname:this.state.uname, password:this.state.password},
            }
            
            axios.request(options)
            .then(res => {
                if (!res || res.data.rows.length == 0) {
                    alert('User does not exist! Please register and try again!')
                    this.props.navigate('/userregister')
                }
                else{
                    if(res.status == 200){
                        this.props.navigate('/userhome')
                    }
                    else{
                        alert('Incorrect Password!')
                    }
                }
            })
        }else{
            alert('Invalid Data')
        }
      }

    render(){
        return(
            <div className='div-login'>
                <div className='div-login-logo'>
                    <Logo />
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                    <input className='input' type = 'username' name = 'uname' placeholder ='Username' required onChange = {this.handleChange} />
                    <input className='input' type = 'password' name = 'password' placeholder ='Password' required onChange = {this.handleChange} />
                    <button className='button' onSubmit = {this.handleSubmit}> Log In </button>
                    </form>
                    <form>
                    <button className='button' onClick = {() => this.props.navigate('/userregister')}> New User? Register Here </button>
                    </form>
                </div>
            </div>    
        )
    }
} 

function LoginN(props) {
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}

export default LoginN;