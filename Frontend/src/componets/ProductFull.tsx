
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from "react-slick";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AddBasket, getProduct, UpdateComment } from '../store/CreateProduct';
import { AddComment, DeleteComment, GetProducts } from './../store/CreateProduct';
import { useAppDispatch, useAppSelector } from '../store/store';
import Footer from './Footer';
import Forms from './Forms';

var settings = {
   dots: false,
   infinite: true,
   speed: 500,
   slidesToShow: 3,
   slidesToScroll: 1,
   initialSlide: 0,
   autoplay: true,
   autoplaySpeed: 2500,
   arrows: false,
   responsive: [
      {
         breakpoint: 1024,
         settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,

         }
      },

      {
         breakpoint: 600,
         settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0
         }
      },
      {
         breakpoint: 480,
         settings: {
            slidesToShow: 1,
            slidesToScroll: 1
         }

      }
   ]
};


const ProductFull: FC = () => {
   const { id } = useParams();
   const id_product = Number(id);
   const { productID, product } = useAppSelector(state => state.product);
   const { user } = useAppSelector(state => state.auth);
   const [value, setValue] = useState<string>("")
   const [edit, setEdit] = useState<boolean>(false)
   const [products, setProducts] = useState<any>(product)
   const [productOne, setProductOne] = useState<any>(productID);
   const [editId, setEditId] = useState<string>("")
   const [date, setDate] = useState<any>("")
   const [name, setName] = useState<string>("")
   const [boolName, setBoolName] = useState<boolean>(false)
   const [FormBool, setFormBool] = useState<boolean>(false)
   const navigate = useNavigate();
   const dispatch = useAppDispatch()

   useEffect(() => {
      window.scrollTo(0, 0);
      dispatch(getProduct(id));
      dispatch(GetProducts())
   }, []);
   const commentRef = React.createRef<any>();

   const ScrollDown = () => {
      commentRef.current.scrollTo(0, commentRef.current.scrollHeight);
   }
   useEffect(() => {
      setProductOne(productID);
   }, [productID]);
   useEffect(() => {
      dispatch(getProduct(id));
      dispatch(GetProducts())
   }, [id]);
   const handleSendComment = (ids: number) => {

      if (value.length > 0 && value.trim() !== "") {
         const comment = {
            id_product: Number(id?.slice(1)),
            id_person: user.id_person,
            description: value,
            time: new Date(),
            date: new Date(),
            person_name: user.name,
            image: user?.image,
         }
         dispatch(AddComment(comment))
         setValue("")
         ScrollDown()
      }


   }
   useEffect(() => {
      setProducts(product)
   }, [product]
   )
   useEffect(() => {
      if (!user) {
         navigate('/login');
      }
   }, [user]);
   const changeBool = (value: boolean) => {
      setFormBool(value)

   }
   const handleSaveComment = (id_comment: number) => {
      if (value.trim() === "") {
         setEditId("")
         setEdit(false)
      }
      else {

         const comment = {
            id_comment: Number(editId),
            id_product: Number(id?.slice(1)),
            id_person: Number(user?.id_person),
            description: value,

         }
         console.log(comment)
         dispatch(UpdateComment(comment))
         toast.success("Комментарий изменен")

         setEditId("")
         setEdit(false)
         setValue('')
      }
   }
   const DeleteComments = (id_comment: number) => {

      const comment = {
         id_comment: Number(id_comment),
         id_product: Number(id?.slice(1)),
         id_person: user?.id_person,
      }
      toast.success("Комментарий удален")

      dispatch(DeleteComment(comment))



   }
   const handleEdit = (item: any, date: any) => {
      setEditId(item.id_comment)
      setEdit(true)
      setValue(item.description)
      setDate(date)

   }
   const handleBuyOrder = (item: any) => {
      setFormBool(true)

   }

   const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
         if (edit === true) {
            handleSaveComment(Number(editId))
         }
         else {
            handleSendComment(Number(id?.slice(1)))
         }

      }

   }
   const AddToBasket = (item: any) => {
      if (item.count === item.count_in_shop) {
         alert("Товар закончился")
      }
      else {

         const basket = {
            id_product: item.id_product,
            id_person: user?.id_person,
            count: item.count
         }


         console.log(basket)
         dispatch(AddBasket(basket))
         toast.success(`Товар ${item.name} добавлен в корзину`)

      }
   }
   function FormatWithZero(value: number) {
      return value < 10 ? `0${value}` : value;
   }

   function FormateTime(time: Date) {
      let times = new Date(time)
      let hours = times.getHours();
      let minutes = times.getMinutes();
      let seconds = times.getSeconds();
      return `${FormatWithZero(hours)}:${FormatWithZero(minutes)}:${FormatWithZero(seconds)}`;

   }
   return (
      <div className='animate'>
         <div className="wrapper product_fulss">
            <div className="block_img">
               <img src={productOne?.img} alt="" />
            </div>
            <div className="block_info">
               <h1 className="title">
                  {productID?.name}
               </h1>
               <div className="description_full">
                  {productID?.sale != 0 ? (<p>Sale: <span>{productID?.sale}%</span> </p>) : (
                     <></>
                  )}
                  <p>Category: <span>{productID?.category}</span> </p>
                  <p>Years: <span>{productID?.years}</span> </p>
                  <p className='color'>Color:
                     <span className="block"
                        style={{ backgroundColor: productID?.color }}>
                     </span> </p>
                  <p>Price: <span>{productID?.price}$</span> </p>
                  <p>Description: <span>{productID?.description}</span> </p>
               </div>
               <div className="block_buttons">
                  <button onClick={() => AddToBasket(productID)} >Add to cart</button>
                  <button onClick={() => handleBuyOrder(productID)}>Buy</button>
               </div>
            </div>
         </div>
         <div className="wrapper">
            <h1 className="title">
               Similar products
            </h1>
         </div>
         <div className="products_main">
            <div className="wrapper">
               <div className="products">
                  <Slider {...settings}>
                     {products.filter((item: any) => item.category.includes(productID.category)).length > 3 ?
                        (products.filter((items: any) => items.category.includes(productID.category)
                        ).filter((item1: any) => Number(item1.id_product) !== Number(productID.id_product))
                           .map((item: any, index: number) => {
                              const { id_product, img } = item;
                              return (
                                 <div className="product" key={index}>
                                    <div className="choise_product">
                                       <div className="blocks">
                                          <div className="block">
                                             <p onClick={() => AddToBasket(item)}>🛒</p>
                                          </div>
                                          <div className="block">
                                             <Link to={`/product/:${id_product}`}
                                                onClick={() => window.scrollTo(0, 0)}>
                                                <p>🔍</p>
                                             </Link>
                                          </div>
                                       </div>
                                    </div>
                                    <img src={img} alt="" />
                                 </div>
                              )
                           }
                           )) :
                        (products.filter((item: any) => item.product_id !== id?.slice(1))
                           .map((item: any, index: number) => {
                              const { id_product, img } = item;
                              return (
                                 <div className="product" key={index}>

                                    <div className="choise_product">
                                       <div className="blocks">
                                          <div className="block">
                                             <p
                                                onClick={() => AddToBasket(item)}>🛒</p>

                                          </div>
                                          <div className="block">
                                             <Link to={`/product/:${item.id_product}`}
                                                onClick={() => window.scrollTo(0, 0)}>
                                                <p>🔍</p>
                                             </Link>
                                          </div>
                                       </div>
                                    </div>
                                    <img src={img} alt="" />
                                 </div>
                              )
                           }
                           ))
                     }
                  </Slider>
               </div>
            </div>
         </div>
         {
            FormBool && <Forms changeBool={changeBool}
               products={[productID]}
               cost={productOne?.price}
            />
         }
         <div className="wrapper">
            <div className="comment">
               <h1 className='titles'>Comments</h1>
               <div className="commets_main" ref={commentRef}
               >
                  {productOne.comment?.length === 0 ? (
                     <div className='not_comment'
                     >
                        <h1>Not comment</h1>
                     </div>
                  ) : (<>
                     {productOne.comment?.map((item: any, index: number) => {
                        const { date, description, person_name, id_comment, id_person, image } = item;
                        return (
                           <div key={index}>
                              <div className="comment_block" >
                                 <div className="comment_block_img">
                                    <div className="blocks">
                                       <img src={`http://localhost:3001/User/${image}`} alt="" />
                                       <p>{person_name || "User "}</p>
                                    </div>
                                    <div className="Date">

                                       <p className="time">
                                          {FormateTime(date)}

                                       </p>
                                       <p>{date.slice(0, 10)}</p>

                                    </div>

                                 </div>

                                 <div className="comment_block_text">
                                    <p>{description}</p>
                                 </div>

                                 {user?.id_person === id_person && (
                                    <div className="buttons" style={editId === id_comment ? { opacity: 0 } : { opacity: 1 }}>
                                       <button className='test_button' onClick={() => handleEdit(item, id_comment)}>Edit</button>
                                       <button className='test_button' onClick={() => DeleteComments(Number(item.id_comment))}>Delete</button>
                                    </div>
                                 )}

                              </div>
                           </div>
                        )
                     })}
                  </>)}
               </div   >
               <div className="inputs_register">
                  <div className="input_register">
                     <button
                        className='register_button'
                        onClick={() => setBoolName(true)}>{user?.name || "user"}</button>
                  </div>
                  <div className="input_btn">
                     <span>{value.length}/300</span>
                     <input type="text"
                        maxLength={300}
                        value={value}

                        onKeyDown={(e) => handleKeyDown(e)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                        placeholder="Comment..." />
                     {edit === false ? <button onClick={() => handleSendComment(Number(id))}>Send</button> :
                        <button
                           onClick={() => handleSaveComment(id_product)}
                        >Save</button>}

                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </div >
   )
}
export default ProductFull
