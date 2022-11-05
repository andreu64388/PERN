import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { AddBasket, DeleteAllBasket, DeleteBasket, GetBasket } from './../store/CreateProduct';
import Footer from './Footer';
import Forms from './Forms';

const Basket: FC = () => {
   const { id } = useParams();
   const { basket, sum } = useAppSelector(state => state.product);
   const { user } = useAppSelector(state => state.auth);
   const [state, setState] = useState<any>([])
   const [FormBool, setFormBool] = useState<boolean>(false)

   const dispatch = useDispatch();
   const navigate = useNavigate();
   useEffect(() => {
      setState(basket)
      dispatch(GetBasket((id)));
   }, [basket]);
   useEffect(() => {
      window.scrollTo(0, 0);
      dispatch(GetBasket((id)));
      setState(basket)
   }, []);

   useEffect(() => {
      if (!user) {
         navigate('/login');
      }
   }, [user]);

   const DeleteBasketAll = () => dispatch(DeleteAllBasket(Number(user?.id_person)))

   const changeBool = (value: boolean) => setFormBool(value)

   const handleBuyOrder = () => setFormBool(true)

   const AddToBasket = (item: any) => {

      const basket = {
         id_product: Number(item.id_product),
         id_person: Number(user?.id_person),
         count: Number(item.count)
      }
      dispatch(AddBasket(basket))

   }
   const DeleteToBasket = (item: any) => {
      const basket = {
         id_product: Number(item.id_product),
         id_person: Number(user?.id_person),
         id_basket: Number(item.id_basket)
      }
      dispatch(DeleteBasket(basket))
   }

   return (
      <div
         className='animate'>
         {state?.length === 0 ? (<div className="empty">
            <img src='https://img.freepik.com/free-vector/empty-concept-illustration_114360-1188.jpg?w=826&t=st=1648823036~exp=1648823636~hmac=b65d6663a934e8e750a4393fd70d7f1c40e0cea01fa1e9a84336aa1e5a2465d9' />
            <p>Your basket is empty go to <Link to="/product">Products</Link></p>
         </div>) : (
            <>            <h1 className='title_basket'>
               Your basket
            </h1>
               <button
                  className='button_delete_all'
                  onClick={DeleteBasketAll}
               >Delete All</button>
               <p className="count_products">
                  <span>{state?.length || 0}</span> products
               </p>
               <div className="wrapper bas">
                  <div className="basket">
                     {state?.map((item: any, index: any) => {
                        const { id_product, name, img, count } = item;
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
                              </div>
                              <div className="buttons_add_del">
                                 <button className='add' onClick={() => AddToBasket(item)}>Add</button>
                                 <p className='count'><p>{count || 0}</p></p>
                                 <button className='del'
                                    onClick={() => DeleteToBasket(item)}
                                 >Del</button>
                              </div>
                           </div>
                        )
                     })}
                  </div>

                  <div className="title_list">
                     <p>Total: {sum} $</p>
                     <button onClick={() => handleBuyOrder()}>Buy</button>

                  </div>
               </div>
               {FormBool && <Forms changeBool={changeBool} cost={sum}
                  products={state}
               />}
            </>
         )}
         <Footer />
      </div>
   )
}
export default Basket