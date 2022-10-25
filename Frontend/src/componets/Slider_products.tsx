
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { toast } from 'react-toastify';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AddBasket } from '../store/CreateProduct';
import { useAppSelector } from '../store/store';
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
interface Sliders {
   category: string;
   product: any;
}

const Slider_products: FC<Sliders> = ({ category, product }) => {
   const dispatch = useDispatch()
   const { user } = useAppSelector(state => state.auth)
   const AddToBasket = (item: any) => {

      const basket = {
         id_product: Number(item.id_product),
         id_person: Number(user?.id_person),
         count: item.count
      }
      console.log(basket)
      dispatch(AddBasket(basket))
      toast.success(`${item.name} добавлен в корзину`)

   }
   return (
      <div className="products_main">
         <div className="wrapper">
            <div className="products">
               <Slider {...settings}>
                  {product?.filter((item: any) => item.category.includes(category)).
                     map((item: any) => {
                        const { id_product, img } = item;
                        return (
                           <div className="product" key={id_product}>
                              <div className="choise_product">
                                 <div className="blocks">
                                    <div className="block">
                                       {
                                          user ?
                                             (<p onClick={() => AddToBasket(item)}>🛒</p>)
                                             :
                                             (<Link to="/login">🛒</Link>)
                                       }
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
                     })}
               </Slider>
            </div>
         </div>
      </div>
   )
}
export default Slider_products
