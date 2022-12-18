import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIsAuth, LogoutUser } from './../store/CreateAuth';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Reset } from '../store/CreateProduct';
import { toast } from "react-toastify";

interface INavbar {
   count: number
}
const Navbar: FC<INavbar> = ({ count }) => {
   const [state, setState] = useState<boolean>(false)
   const [scroll, setScroll] = useState<boolean>(false)
   const { user }: any = useAppSelector(state => state.auth);
   const dispatch = useAppDispatch();
   const isAuth = useAppSelector(CheckIsAuth);
   const [user_id, setUser_id] = useState<number>(user?.id_person)

   useEffect(() => {
      setUser_id(user?.id_person)
   }, [user]);


   const handleExit = () => {
      dispatch(LogoutUser())
      toast.success("You are logged out")
      setState(false)
      dispatch(Reset())
   }
   const logo = () => {
      window.scrollTo(0, 0)
      setState(false)
   }

   //прии скролле увеличиваеться высота навбара

   useEffect(() => {
      window.addEventListener('scroll', () => {
         if (window.scrollY > 0) {
            setScroll(true)
         } else {
            setScroll(false)
         }
      })
   }, [])

   const PathBasket = `/basket/:${user_id}`;
   const PathProfile = `/profile/:${user_id}`;
   return (
      <div className='header'>
         <div className={scroll ? "wrapper" : "wrapper active"}>
            <div className="burger">
               <div id="nav-icon1"
                  className={state ? 'open' : ''}
                  onClick={() => setState(!state)}>
                  <span></span>
                  <span></span>
                  <span></span>
               </div>
            </div>
            <div className="logo">
               <Link to="/"
                  onClick={() => logo()
                  }

               >WebShop</Link>
            </div>
            <nav
               className={state ? 'nav active' : 'nav'}
            >
               <ul>
                  <li
                  >
                     <Link to="/"
                        onClick={() => setState(false)}
                     >Home</Link>
                  </li>
                  <li>
                     <Link to="/product"
                        onClick={() => setState(false)}
                     >Product</Link>
                  </li>
                  <li>
                     <Link to={PathBasket}
                        onClick={() => setState(false)}>Basket<span>
                           <p> {count}</p></span></Link>
                  </li>
                  <li>
                     <Link to={PathProfile}
                        onClick={() => setState(false)}>Profile</Link>
                  </li>
                  <li className='li_end'>
                     {isAuth
                        ?
                        <a
                           className='button_b'
                           onClick={() => {
                              handleExit();
                           }}
                        >
                           Exit
                        </a>
                        :

                        <Link
                           onClick={() => setState(false)}
                           className='button_a'
                           to="/login">
                           Entrance
                        </Link>




                     }
                  </li>
               </ul>
            </nav>
         </div>
      </div >
   )
}

export default Navbar