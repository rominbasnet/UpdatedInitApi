import {useRef, useState, useEffect, useContext } from 'react';
import {AuthContext} from './auth/AuthWrapper.jsx';
import axios from 'axios';

const Login  = () =>{

  const { setAuth, auth } = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(()=>{
    emailRef.current.focus();
  }, [])

  useEffect(()=>{
    setErrMsg('');
  }, [email, password])

  const handleSubmit = async (e) =>{
    e.preventDefault(); 
    try{
      const response = await axios.post("http://localhost:8000/vendor/login",
        JSON.stringify({ email, password}),
        {
          headers: { 'Content-Type': 'application/json'}
        }
    )
    const accessToken = response?.data?.signature;
    const roles = response?.data?.roles;
    console.log(accessToken);
    console.log(roles);
    setAuth({ accessToken, roles})
    setEmail('');
    setPassword('');
    setSuccess(true);
        
    } catch(err){
      console.log(err);
    }
    
  }

  return(
   <>
    {success? (
      <section>
        <h1>You are logged in </h1>
        <br />
        <p>
          <a href="#">Go to Home Page</a>
        </p>
      </section>
    )
    :
  (
      <section>
      <p ref={errRef} className= {errMsg ? "errmsg" : "offscreen"} aria-live = "assertive">{errMsg}</p>    
      <h1>Sign In</h1>
      <form onSubmit= {handleSubmit}>
        <label htmlFor="username">Username/Email</label>
        <input
          type= "text"
          id= "username"
          ref= {emailRef}
          autoComplete= "off"
          onChange = {(e)=>setEmail(e.target.value)}
          value= {email}
          required
        />
       <label htmlFor="password">Password</label>
        <input
          type= "password"
          id= "password"
          autoComplete= "off"
          onChange = {(e)=>setPassword(e.target.value)}
          value= {password}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Create an account?<br />
        <span className= "link">
          <a href = "#">SignUp</a>
        </span>
      </p>
    </section>
  )}
  </>
)
}
export default Login;
