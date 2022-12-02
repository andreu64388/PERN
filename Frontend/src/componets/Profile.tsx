import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Typewriter from "typewriter-effect";
import { DeleteMessage, DeleteUser, LogoutUser, UpdateImage, UpdateName } from '../store/CreateAuth';
import { useAppDispatch, useAppSelector } from '../store/store';
import { GetMe, UpdatePassword } from './../store/CreateAuth';
import { GetOrders, GetTopPersons } from './../store/CreateProduct';
import Footer from './Footer';
const Profile: FC = () => {
   const [modal, setModal] = React.useState(false);
   const { id } = useParams();
   const { user } = useAppSelector(state => state.auth);
   const { orders, top_persons } = useAppSelector(state => state.product);
   const [order, setOrder] = useState<any[]>(orders);
   const [show, setShow] = useState<boolean>(false);
   const [modalBool, setModalBool] = useState<boolean>(false);
   const [topPeersons, setTopPersons] = useState<any[]>(top_persons);
   const [modalImage, setModalImage] = useState<boolean>(false);
   const [image, setImage] = useState<string | null>(null);
   const navigate = useNavigate();
   const dispatch = useAppDispatch();


   useEffect(() => {
      if (!user) {
         navigate('/login');
      }
   }, [user]);

   useEffect(() => {
      dispatch(GetOrders(id));
      dispatch(GetTopPersons());
      setOrder(orders);
      setTopPersons(top_persons);
      window.scrollTo(0, 0);
   }, []);

   const Show = () => {
      dispatch(GetOrders(id));
      setOrder(orders);
      setShow(!show);
   }

   const ChangeModel = (modal: boolean) => setModal(modal);

   const CountOrders = (orders: any): number => {
      let count: number = 0;
      for (let i = 0; i < orders.length; i++) {
         count += orders[i].count;
      }
      return count;
   }

   const FormatDate = (date: Date) => {

      const newDate = new Date(date);
      const day = newDate.getDate();
      const month = newDate.getMonth() + 1;
      const year = newDate.getFullYear();
      const hours = newDate.getHours();
      const minutes = newDate.getMinutes();
      const seconds = newDate.getSeconds();
      return `${day}.${month}.${year} ${hours < 10 ? '0' + hours : hours}
      :${minutes < 10 ? '0' + minutes : minutes}
      :${seconds < 10 ? '0' + seconds : seconds}`;

   }
   const ChangeModal = (modal: boolean) => setModalBool(modal);

   const ChangeModalImage = (modal: boolean) => setModalImage(modal);

   const PhotoModal = (img: string | null) => {
      setImage(img);
      setModalImage(true);
   }
   useEffect(() => {
      if (modal) {
         window.addEventListener('scroll', () => {
            setModal(false);


         });
      }
      return () => {
         window.removeEventListener('scroll', () => {
            setModal(false);
         });
      }
   }, [modal]);

   useEffect(() => {
      if (modalBool) {
         window.addEventListener('scroll', () => {
            setModalBool(false);
         }
         );
      }
      return () => {
         window.removeEventListener('scroll', () => {
            setModalBool(false);
         });
      }
   }, [modalBool]);

   useEffect(() => {
      if (modalImage) {
         window.addEventListener('scroll', () => {
            setModalImage(false);
         }
         );
      }
      return () => {
         window.removeEventListener('scroll', () => {
            setModalImage(false);
         });
      }
   }, [modalImage]);




   return (
      <div className="animate">
         <div className='wrapper'>
            <h1 className='title-profile'>
               My Profile
            </h1>


            <div className="line"></div>
            <p
               style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: '20px'

               }}


            >
               <Typewriter
                  options={{
                     strings: ['Hello, ' + user?.name + '!',
                        'Welcome to your profile!',
                        'Here you can see your orders and change your profile information!',
                        'Have a nice day!'],


                     autoStart: true,
                     loop: true,
                  }}
               />
            </p>
            <div className="profile">
               <div className="photo">

                  <img src={`http://localhost:3001/User/${user?.image}`
                  } alt="prfile"

                     onClick={() => PhotoModal(`http://localhost:3001/User/${user?.image}`)}
                  />
                  <button
                     className='change-images'
                     onClick={() => ChangeModal(true)}
                  >
                     Update Photo
                  </button>
                  {modalBool && <ModalPhoto ChangeModal={ChangeModal} />}
                  {modalImage && <ModalPhotos ChangeModalImage={ChangeModalImage} photo={image} />}

               </div>
               <div className="information">
                  <div className="info_about_user">
                     <div className="name_info">
                        <p>
                           Name:
                        </p>
                        <p>
                           Surname:
                        </p>
                        <p>
                           Count orders :
                        </p>

                     </div>
                     <div className="value_info">
                        <p>
                           {user?.name || "No name"}
                        </p>
                        <p>
                           {user?.surname || "No surname"}
                        </p>
                        <p>
                           {
                              CountOrders(orders)
                           }
                        </p>




                     </div>
                  </div>
                  <div className="changeProfile">
                     <button
                        onClick={() => ChangeModel(true)}
                     >
                        Change Profile
                     </button>
                  </div>
               </div>


               {top_persons.length > 0 &&
                  (
                     <div className="table_best_people">

                        <h1>
                           Best people
                        </h1>
                        <table>
                           <thead>
                              <tr>
                                 <th>
                                    Position

                                 </th>
                                 <th>
                                    Name

                                 </th>
                                 <th>
                                    Surname
                                 </th>
                                 <th>
                                    Count orders
                                 </th>

                              </tr>
                           </thead>
                           {top_persons?.map((item: any, index: number) => {
                              return (
                                 <tbody key={index}>
                                    <tr style={
                                       item.name === user?.name && item.surname === user?.surname ?
                                          { color: 'green' } : {}
                                    }>
                                       <td >
                                          {index + 1}
                                       </td>
                                       <td >
                                          {item.name}
                                       </td>
                                       <td>
                                          {item.surname}
                                       </td>
                                       <td>
                                          {item.count}
                                       </td>

                                    </tr>
                                 </tbody>
                              )
                           })}
                        </table>
                     </div>
                  )}


            </div>

            {orders?.length > 0 &&
               <button
                  className="btn_show_orders"
                  onClick={Show}
               >
                  {show ? "Hide" : "Show"} all orders
               </button>

            }
            {show && <>

               <h1 className='title_my_orders'>
                  Your orders
               </h1>
               <div className="wrapper bas">
                  <div className="basket">
                     {order?.map((item: any, index: any) => {
                        const { id_product, name, img, count, price, dateorders, id_buy, isbuy } = item;
                        return (
                           <div className="product" key={index}>
                              <div className="id">
                                 <p>{index + 1}</p>
                              </div>
                              <div className="img">
                                 <Link to={`/product/:${id_product}`}>
                                    <img src={img} alt="" />
                                 </Link>
                              </div>
                              <div className="name">
                                 <Link to={`/product/:${id_product}`}>
                                    <p>{name}</p>
                                 </Link>
                                 <p>Price: {price} Count : {count}</p>

                                 <p style={{ color: 'red' }}>Date: {
                                    FormatDate(item?.dateorders)

                                 }</p>



                              </div>

                           </div>
                        )
                     })}
                  </div>
               </div></>}
            {modal && <Modal changeModal={ChangeModel} />}
         </div>
         <Footer />
      </div >
   )
}
export default Profile;
interface IModal {
   changeModal: (modal: boolean) => void;
}
const Modal: FC<IModal> = ({ changeModal }) => {
   const [surname, setSurname] = useState<string>("");
   const [boolSurname, setBoolSurname] = useState<boolean>(false);
   const [password, setPassword] = useState<string>("");
   const [boolPassword, setBoolPassword] = useState<boolean>(false);
   const [newPassword, setNewPassword] = useState<string>("");
   const [DeletePassword, setDeletePassword] = useState<string>("");
   const [boolDeletePassword, setBoolDeletePassword] = useState<boolean>(false);
   const { user, message } = useAppSelector(state => state.auth);
   const dispatch = useAppDispatch();

   useEffect(() => {
      if (message) {
         if (message === "Password updated successfully") {

            toast.success(message);
         }
         else if (message === "Surname updated successfully") {
            window.location.reload();

         }
         else {
            toast.error(message);
         }
      }
      return () => {
         dispatch(DeleteMessage())
      }
   }, [message]);

   useEffect(() => {
      if (user) {
         setSurname(user?.surname);
      }
   }, [boolSurname, boolPassword]);

   const SaveSurname = () => {
      if (surname.trim().length > 0) {
         if (surname === user?.surname) {
            {
               toast.error("You have not changed your surname");
               return setBoolSurname(false);
            }
         }
         dispatch(UpdateName({ id: user.id_person, surname: surname }));

      }
      setBoolSurname(false);
   }

   const SavePassword = () => {
      setBoolPassword(false);
      dispatch(UpdatePassword({ id: user.id_person, password: password, newPassword: newPassword }));
      setPassword("");
      setNewPassword("");
   }

   const ChangeModal = (modal: boolean) => {
      changeModal(modal);
      dispatch(DeleteMessage());
   }

   const DeleteAccount = () => {
      setBoolDeletePassword(true);

   }

   const ConfirmDeletePassword = () => {
      if (DeletePassword === user.password) {
         dispatch(DeleteUser({ id: user.id_person }));
         dispatch(LogoutUser());
         window.location.reload();
      }
      else {
         setBoolDeletePassword(false);
         toast.error("Wrong password");
      }
   }

   const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
         SaveSurname();
      }
   }

   const handleKeyDownPassword = (e: any) => {
      if (e.key === 'Enter') {
         SavePassword();
      }

   }

   const CheckEsc = (e: any) => {
      if (e.key === "Escape") {
         changeModal(false);
      }
   }

   useEffect(() => {
      window.addEventListener("keydown", CheckEsc);
      return () => {
         window.removeEventListener("keydown", CheckEsc);
      }
   }, []);


   return (
      <>
         <div className="modal">
            <div className="close"
               onClick={() => ChangeModal(false)}>
               <span>╳</span>
            </div>
            <div className="block_main">
               <h1>
                  Change  Profile
               </h1>
               <div className="line"></div>
               <div className="blocks">
                  <div className="block">
                     <div className='block_info'>
                        Surname
                     </div>
                     <div className="block_current_info">
                        {boolSurname ? (
                           <input type="text"
                              value={surname}
                              maxLength={18}
                              onKeyDown={e => handleKeyDown(e)}
                              onChange={(e) => setSurname(e.target.value)}
                           />
                        ) : (
                           <>
                              {user?.surname}
                           </>
                        )
                        }
                     </div>
                     <div className="block_change_button">
                        {boolSurname ? (
                           <button
                              className='cancel'
                              onClick={() => setBoolSurname(false)}>Cancel</button>
                        ) : (
                           <button
                              onClick={() => setBoolSurname(true)}>Change</button>
                        )
                        }
                     </div>
                  </div>
                  {
                     boolSurname && (<div className='Field_change_name'>
                        <button
                           onClick={SaveSurname}
                        >
                           Save
                        </button>
                     </div>)
                  }
                  <hr />
                  <div className="block">
                     <div className='block_info'>
                        Password
                     </div>
                     <div className="block_current_info">
                        {boolPassword && (
                           <div className='inputs'>
                              <input type="password"
                                 value={password}
                                 maxLength={20}
                                 placeholder='Old password'
                                 onChange={(e) => setPassword(e.target.value)}
                              />
                              <input type="password"
                                 value={newPassword}
                                 maxLength={20}
                                 onKeyDown={e => handleKeyDownPassword(e)}
                                 placeholder='New password'
                                 onChange={(e) => setNewPassword(e.target.value)}
                              />
                           </div>
                        )
                        }
                     </div>
                     <div className="block_change_button">
                        {boolPassword ? (
                           <button
                              className='cancel'
                              onClick={() => setBoolPassword(false)}>Cancel</button>
                        ) : (
                           <button
                              onClick={() => setBoolPassword(true)}>Change</button>
                        )
                        }
                     </div>
                  </div>
                  {
                     boolPassword && (<div className='Field_change_name'>
                        <button
                           onClick={SavePassword}>
                           Save
                        </button>
                     </div>)
                  }
                  <hr />
                  {
                     boolDeletePassword && (
                        <div className="block confirm_block">
                           <p className="title_password">
                              Enter your password to delete your account
                           </p>
                           <input type="password"
                              value={DeletePassword}
                              maxLength={20}
                              placeholder='Password'
                              onChange={(e) => setDeletePassword(e.target.value)}
                           />
                        </div>
                     )
                  }
                  <div className="block">
                     {
                        !boolDeletePassword ? (
                           <button className='delete'
                              onClick={DeleteAccount}>
                              Delete Account
                           </button>
                        ) : (
                           <div className='button_password'>
                              <button className='confirm'
                                 onClick={ConfirmDeletePassword}>
                                 Confirm
                              </button>
                              <button
                                 className='cancel'
                                 onClick={() => setBoolDeletePassword(false)}>
                                 Cancel
                              </button>
                           </div>

                        )
                     }
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
interface IModalPhoto {
   ChangeModal: (modal: boolean) => void;
}
const ModalPhoto: FC<IModalPhoto> = ({ ChangeModal }) => {
   const [image, setImage] = useState<any>(null);
   const { user } = useAppSelector(state => state.auth);
   const dispatch = useAppDispatch();
   const ChangeModals = (modal: boolean) => {
      ChangeModal(modal);
   }

   const UpdatePhoto = () => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('id', user.id_person);
      const datas = {
         image: formData.get('image'),
         id_person: formData.get('id')
      }

      dispatch(UpdateImage(datas));
      ChangeModals(false);
      window.location.reload();
      dispatch(GetMe());
   }

   const CheckEsc = (e: any) => {
      if (e.key === "Escape") {
         ChangeModals(false);
      }
   }

   useEffect(() => {
      window.addEventListener("keydown", CheckEsc);
      return () => {
         window.removeEventListener("keydown", CheckEsc);
      }
   }, []);

   return (<div className="modal">
      <div className="close"
         onClick={() => ChangeModals(false)}>
         <span>╳</span>
      </div>
      <div className="block_mainphoto">
         <div className="change-image">
            {!image && (
               <>

                  <label htmlFor="upload-photo">
                     Update
                  </label>
                  <input id="upload-photo" type="file"
                     accept=".jpg, .jpeg, .png"
                     onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                           setImage(e.target.files[0]);
                        }
                     }} /></>
            )}
            {image && <img src={URL.createObjectURL(image)} alt=""



            />}
            {image && (
               <div className='buttons'>
                  <button onClick={UpdatePhoto}
                     className="save">Save</button>
                  <button onClick={() => setImage(null)}
                     className="cancel"

                  >Cancel</button>
               </div>

            )}
         </div>

      </div>
   </div >
   )

}

const ModalPhotos = ({ photo, ChangeModalImage }: any) => {
   const CheckIsEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
         ChangeModalImage(false);
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
            onClick={() => ChangeModalImage(false)}>
            <span>╳</span>
         </div>
         <div className="block_main_photo">
            <div className="main_photo">
               <img src={photo} alt="photo" />
            </div>
         </div>
      </div>
   )
}

