import React  from "react";
import {ReactComponent as Logo} from '../../logo.svg';
import './Register.css';
import {useNavigate} from 'react-router-dom';

const axios = require("axios");

axios.defaults.withCredentials = true;


const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };

class Register extends React.Component {
    state = {
        fullname:'',
        uname: '',
        password: '',
        cpassword:'',
        errors: {
            fullname:'',
            uname: '',
            password: '',
            cpassword:'',
          }
    }

    createUser = () => {
          axios({method: 'get',
          url: 'http://localhost:3001/userregister2',
          params: {fullname: this.state.fullname, uname:this.state.uname, password:this.state.password}
          })
          .then(res => {
                if (res.status >= 400) {
                    alert('Something went wrong during creation of user')
                }
                else{
                    alert('User Successfully created')
                    this.props.navigate('/')
                }
        })
    }

    handleChange = (e) => {
        const {name,value} = e.target
        this.setState({[name]:value})
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        var validate_user = 0
        if(validateForm(this.state.errors)) {
            // Check if user exists
            // 1 - User does not exist - create
            // 2 - User exists
            const options = {
                method: 'GET',
                url: 'http://localhost:3001/userregister',
                params: {fullname: this.state.fullname,uname:this.state.uname},
            }
            
            axios.request(options)
            .then(res => {
                if (!res || res.data.rows.length == 0) {
                    validate_user = 1;
                }
                else{
                    validate_user = 2;
                    }
                if(validate_user == 1){
                    if (this.state.password === this.state.cpassword){
                        this.createUser()
                    }
                    else{
                        alert('Passwords dont match, Re-enter again!')
                    }
                }
                else if(validate_user == 2){
                    alert('User Exists, Please login again!')
                    this.props.navigate('/')
                }    
            })
        }
        else{
          alert('Invalid Data')
        }
    }

    render(){
        return(
            <div className='div-register'>
                <div className='div-register-logo'>
                    <Logo />
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                    <input className='input' type = 'fullname' name = 'fullname' placeholder ='Display Name' required onChange = {this.handleChange} />
                    <input className='input' type = 'username' name = 'uname' placeholder ='Username' required onChange = {this.handleChange} />
                    <input className='input' type = 'password' name = 'password' placeholder ='Password' required onChange = {this.handleChange} />
                    <input className='input' type = 'password' name = 'cpassword' placeholder ='Confirm Password' required onChange = {this.handleChange} />
                    <button className='button' onSubmit = {this.handleSubmit}> Register </button>
                    </form>
                </div>
            </div>    
        )
    }
} 

function RegisterN(props) {
    let navigate = useNavigate();
    return <Register {...props} navigate={navigate} />
}

export default RegisterN;