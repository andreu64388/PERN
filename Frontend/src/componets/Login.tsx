import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DeleteMessage, LoginUser } from '../store/CreateAuth';
import { useAppDispatch, useAppSelector } from '../store/store';
import Footer from './Footer';

const Login: FC = () => {
   const { message, token, user }: any = useAppSelector(state => state.auth);
   const [name, setName] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   useEffect(() => {
      window.scrollTo(0, 0);
   }
      , []);
   useEffect(() => {
      if (message) {
         if (message === "User logged in successfully") toast.success(message);
         else {
            toast.error(message)
         }
      }
      return () => {
         dispatch(DeleteMessage());
      }
   }, [message]);

   useEffect(() => {
      if (token) {
         navigate(`/profile/:${user?.id_person}`);
      }
   }, [token]);

   const Login = () => {
      if (name.trim() === "") {
         toast.error("Name is empty");
         return;
      }
      if (password.trim() === "") {
         toast.error("Password is empty");
         return;
      }
      dispatch(LoginUser({ name, password }));
   }

   const TryNameRegexp = (e: ChangeEvent<HTMLInputElement>) => {
      const regexp = /^[a-zA-Zа-яА-Я ]+$/;
      const name = e.target.value;
      if (regexp.test(name)) {
         setName(name);
      }
      if (name === "") {
         setName(name);
      }
   }

   const TryPasswordRegexp = (e: ChangeEvent<HTMLInputElement>) => {
      const regexp = /^[a-zA-Z0-9]+$/;
      const password = e.target.value;
      if (regexp.test(password)) {
         setPassword(password);
      }
      if (password === "") {
         setPassword(password);
      }
   }

   return (
      <div className='animate'>
         <div className="wrapper">
            <div className="form">
               <h1 className="title">
                  Login
               </h1>
               <div className="input">
                  <h2>
                     Name
                  </h2>
                  <input type="text" placeholder="Name"

                     value={name}
                     onChange={(e: ChangeEvent<HTMLInputElement>) => TryNameRegexp(e)}
                  />
                  <h2>
                     Password
                  </h2>
                  <input type="password" placeholder='Password'
                     value={password}
                     onChange={(e: ChangeEvent<HTMLInputElement>) => TryPasswordRegexp(e)}
                  />
               </div>
               <div className="message">
               </div>
               <p className='account'>
                  Do  you have not account? <Link to='/register'>Register</Link>
               </p>
               <div className="buttons">
                  <button
                     onClick={Login}>
                     Login
                  </button>

               </div>
            </div>
         </div>
         < Footer />
      </div>
   )
}

export default Login 