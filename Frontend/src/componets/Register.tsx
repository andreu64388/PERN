import { ChangeEvent, FC, useEffect, useState } from 'react';
import { AiOutlineDownload } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { DeleteMessage, RegisterUser } from "../store/CreateAuth";
import { useAppDispatch, useAppSelector } from '../store/store';
import Footer from './Footer';
const Register: FC = () => {

   const { message, auth, token, user } = useAppSelector(state => state.auth);
   const [name, setName] = useState<string>('');
   const [surname, setSurname] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [twoPassword, setTwoPassword] = useState<string>('');
   const [messages, setMessage] = useState<string>('');
   const [image, setImage] = useState<any>(null);
   const [photoBool, setPhotoBool] = useState<boolean>(false);
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      window.scrollTo(0, 0);
   }
      , []);

   useEffect(() => {
      if (message) {
         if (message === "User registered successfully") toast.success(message);
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
   }, [auth, token]);

   const RegistUser = () => {
      if (name.trim() === "") {
         setMessage("Name is empty");
         toast.error("Name is empty");
         return;
      }
      if (surname.trim() === "") {
         setMessage("Surname is empty");
         toast.error("Surname is empty");

         return;
      }
      if (password.trim() === "") {
         setMessage("Password is empty");
         toast.error("Password is empty");
      }
      if (password !== twoPassword) {
         setMessage("Password is not same");
         toast.error("Password is not same");
         return;
      }
      var formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("password", password);
      formData.append("image", image);
      const data = {
         name: formData.get("name"),
         surname: formData.get("surname"),
         password: formData.get("password"),
         image: formData.get("image")
      }
      dispatch(RegisterUser(data));
      setMessage("");

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

   const TrySurnameRegexp = (e: ChangeEvent<HTMLInputElement>) => {
      const regexp = /^[a-zA-Zа-яА-Я ]+$/;
      const surname = e.target.value;
      if (regexp.test(surname)) {
         setSurname(surname);
      }
      if (surname === "") {
         setSurname(surname);
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

   const TryTwoPasswordRegexp = (e: ChangeEvent<HTMLInputElement>) => {
      const regexp = /^[a-zA-Z0-9]+$/;
      const twoPassword = e.target.value;
      if (regexp.test(twoPassword)) {
         setTwoPassword(twoPassword);
      }
      if (twoPassword === "") {
         setTwoPassword(twoPassword);
      }
   }

   const ChangePhoto = (modal: boolean) => {
      setPhotoBool(modal);
   }

   return (
      <div className='animate'>
         <div className="wrapper">
            <div className="form">
               <form
                  onSubmit={(e) => e.preventDefault()}>
                  <h1 className="title">
                     Register
                  </h1>
                  <div className="input">
                     <h2>
                        Name
                     </h2>
                     <input type="text" placeholder="Name"
                        value={name}
                        maxLength={20}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => TryNameRegexp(e)}
                     />

                     <h2>
                        Surname
                     </h2>
                     <input type="text" placeholder="Surname"
                        value={surname}
                        maxLength={20}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => TrySurnameRegexp(e)}
                     />
                     <h2>
                        Password
                     </h2>
                     <input type="password" placeholder='Password'
                        value={password}
                        maxLength={40}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => TryPasswordRegexp(e)
                        }
                     />

                     <h2>
                        Confirm Password
                     </h2>
                     <input type="password"

                        placeholder='Confirm Password'
                        value={twoPassword}
                        maxLength={40}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                           TryTwoPasswordRegexp(e)
                        }
                     />
                     <h2>
                        Image
                     </h2>
                     {!image && (<><label htmlFor="photolabel">Photo  <AiOutlineDownload ></AiOutlineDownload></label>
                        <input type="file" id={"photolabel"}
                           accept=".jpg, .jpeg, .png"
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files![0])}
                        />
                     </>)
                     }

                     {image && <img src={URL.createObjectURL(image)} alt="photo"
                        onClick={() => ChangePhoto(true)}

                     />}
                  </div>
                  {image && (<>
                     <button
                        className='cansel'
                        onClick={
                           () => setImage(null)
                        }>
                        Cansel
                     </button>
                  </>)}

                  <div className="message">
                     <p>
                     </p>
                  </div>
                  <p className='account'>
                     Do you have account? <Link to='/login'>Login</Link>
                  </p>


                  <div className="buttons">
                     <button
                        onClick={RegistUser}
                     >
                        Register
                     </button>

                  </div>
               </form>
            </div>

         </div>
         {photoBool && <ModalPhoto ChangePhoto={ChangePhoto} photo={image}
         />}
         < Footer />
      </div>
   )
}
export default Register;

const ModalPhoto = ({ photo, ChangePhoto }: any) => {
   const CheckIsEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
         ChangePhoto(false);
      }
   }
   useEffect(() => {
      document.addEventListener("keydown", CheckIsEscape);
      return () => {
         document.removeEventListener("keydown", CheckIsEscape)
      }
   }, [])

   return (
      <div className="modal">
         <div className="close"
            onClick={() => ChangePhoto(false)}>
            <span>╳</span>
         </div>
         <div className="block_main_photo">
            <div className="main_photo">
               <img src={URL.createObjectURL(photo)} alt="photo" />
            </div>
         </div>
      </div>



   )
}
