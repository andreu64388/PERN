import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { GetProducts } from './../store/CreateProduct';
import { useAppSelector } from '../store/store';
import Footer from './Footer';
import Slider_products from './Slider_products';
const Home: FC = () => {

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   const { product } = useAppSelector(state => state.product)

   const dispatch = useDispatch()
   useEffect
      (() => {
         dispatch(GetProducts())
      }, [])


   const settings = {
      dots: true,
      fade: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      arrows: false,
   };

   return (
      <div
         className='animate'>
         <div className="Slider">
            <Slider {...settings}>
               <div className="slider">
                  <img src="https://phonoteka.org/uploads/posts/2021-05/1622279315_10-phonoteka_org-p-krossovki-naik-art-krasivo-10.jpg" alt="" />
               </div>
               <div className="slider">
                  <img src="https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2019%2F11%2Fneed-for-speed-heat-puma-hi-octn-release-information-1.jpg" alt="" />
               </div>
               <div className="slider">
                  <img src="https://www.ccgrasseurope.com/wp-content/uploads/2020/07/iStock-512003230.jpg" alt="" />
               </div>
            </Slider>
         </div >
         <div className="wrapper">
            <h1 className="title">
               Sale of phones
            </h1>
         </div>
         <Slider_products category={"Phone"} product={product} />
         <div className="wrapper">
            <h1 className="title">
               Clothing sale
            </h1>
         </div>
         <Slider_products category={"Clothes"} product={product} />
         <div className="wrapper">
            <h1 className="title">
               Book sale
            </h1>
         </div>
         <Slider_products category={"book"} product={product} />
         <Footer />
      </div >
   )
}


export default Home