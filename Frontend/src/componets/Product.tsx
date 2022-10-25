import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from '../store/store';
import { AddBasket, GetProducts } from './../store/CreateProduct';
import Footer from './Footer';
const Product: FC = () => {
   const { product } = useAppSelector(state => state.product);
   const { user } = useAppSelector(state => state.auth);
   const [products, setProducts] = useState<any>(product);
   const [sortPrice, setSortPrice] = useState<string>("");
   const [sortYear, setSortYear] = useState<string>("")
   const [sortSale, setSortSale] = useState<string>("")
   const [research, setResearch] = useState<string>("");
   const [filter, setFilter] = useState<any>(product)
   const [option, setOption] = useState<any[]>(product);
   const [testColor, setTestColor] = useState<any[]>();
   const [unique_property, setUnique_property] = useState<any[]>();
   //сделать пагинацию
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [postsPerPage] = useState<number>(6);
   const [Pagination, setPagination] = useState<any[]>([]);

   const dispatch = useAppDispatch()
   const navigate = useNavigate();

   useEffect(() => {
      if (!user) {
         navigate('/login');
      }
   }, [user]);

   useEffect(() => {
      window.scrollTo(0, 0);
      dispatch(GetProducts())
      setProducts(product)
      setFilter(product)

   }, []);

   useEffect(() => {
      setProducts(product)
      setFilter(product)
   }, [product])

   useEffect(() => {
      if (unique_property?.map(item => item.checked).includes(true) && testColor?.map(item => item.checked).includes(true)) {
         const productNew =
            option.map((item: any): any => {
               if (unique_property?.filter(item => item.checked).map(item => item.unique_property).includes(item.unique_property) && testColor.filter(item => item.checked).map(item => item.color).includes(item.color)) {
                  return item;
               }
            }
            )

         const product = productNew.filter((item: any) => item !== undefined);

         setProducts(product)

      } else if (unique_property?.map(item => item.checked).includes(true)) {
         const productNew =

            option.map((item: any): any => {
               if (unique_property?.filter(item => item.checked).map(item => item.unique_property).includes(item.unique_property)) {
                  return item;
               }
            }
            )

         const product = productNew.filter((item: any) => item !== undefined);

         setProducts(product)

      } else if (testColor?.map(item => item.checked).includes(true)) {
         const productNew =

            option.map((item: any): any => {
               if (testColor.filter(item => item.checked).map(item => item.color).includes(item.color)) {
                  return item;
               }
            }
            )

         const product = productNew.filter((item: any) => item !== undefined);

         setProducts(product)

      } else {
         setProducts(option)
      }
   }, [unique_property, testColor])

   const handleChangePrice = (value: string) => {
      setSortPrice(value)
      setSortSale("Sale")
      setSortYear("Years")
      const result = "price"
      if (value === "ascending") {
         const newProduct = [...products].sort((a: any, b: any) => a[result] - b[result])
         setProducts(newProduct)
      }
      else if (value === "descending") {
         const newProduct = [...products].sort((a: any, b: any) => b[result] - a[result])
         setProducts(newProduct)
      }
      else {
         setProducts(product)
      }
   }
   const Filter = (valueOfFilter: string | any) => {
      setFilter(valueOfFilter)
      Unique_propertyForFilter(valueOfFilter)
      ColorFirFilter(valueOfFilter)

      if (valueOfFilter == products) {
         setSortPrice("");
         setSortYear("");
         setSortSale("");
         setResearch("")
         setProducts(product)
         setOption(product)
         setFilter(product);
         setUnique_property(undefined)
         setTestColor(undefined)

      }
      else {
         const NewDate = product.filter((item: any) => item.category === valueOfFilter);
         setProducts(NewDate)
         setOption(NewDate);
         setSortPrice("");
         setSortYear("");
         setSortSale("");
         setResearch("")
      }

   }

   const handleChangeYears = (value: string) => {
      setSortYear(value)
      setSortPrice("Price")
      setSortSale("Sale")
      const result = "years"
      if (value === "ascending") {
         const newProduct = [...products].sort((a: any, b: any) => a[result] - b[result])
         setProducts(newProduct)
      }
      else if (value === "descending") {
         const newProduct = [...products].sort((a: any, b: any) => b[result] - a[result])
         setProducts(newProduct)
      }
      else {
         setProducts(product)
      }
   }
   const handleChangeSale = (value: string) => {
      setSortSale(value)
      setSortPrice("Price")
      setSortYear("Years")
      const result = "sale"
      if (value === "ascending") {
         const newProduct = [...products].sort((a: any, b: any) => a[result] - b[result])
         setProducts(newProduct)
      }
      else if (value === "descending") {
         const newProduct = [...products].sort((a: any, b: any) => b[result] - a[result])
         setProducts(newProduct)
      }
      else {
         setProducts(product)
      }
   }
   const ResetAllFilters = () => {
      setSortPrice("");
      setSortYear("");
      setSortSale("");
      setResearch("")
      setProducts(product)
      setOption(product)
      Filter(products)

   }
   //тут переделать
   const AddToBasket = (item: any) => {
      if (Number(item.count) == Number(item.count_in_shop)) {
         alert("Товар закончился")
      }

      else {
         console.log(item)
         const basket = {
            id_product: Number(item.id_product),
            id_person: Number(user?.id_person),
            count: item.count
         }
         dispatch(AddBasket(basket))
         toast.success(`Товар ${item.name} добавлен в корзину`)
      }
   }

   const Unique_propertyForFilter = (category: string) => {
      const ArrayOfPrtoperty = product.filter((item: any) => item.category === category).map((item: any) => {
         return item
      });

      const Sets = Array.from(new Set(ArrayOfPrtoperty.map((item: any) => item.unique_property)))
      const ArrayOfUniqueProperty = Sets.map((item: any) => {
         const result = {
            unique_property: item.toString(),
            checked: false
         }
         return result
      });
      setUnique_property(ArrayOfUniqueProperty)

   }

   const handlerChangeCheckboxUniqueProperty = (index: number) => {
      setUnique_property(
         unique_property?.map((topping, currentIndex) =>
            currentIndex === index
               ? { ...topping, checked: !topping.checked }
               : topping
         )
      )
   }
   const ColorFirFilter = (category: string) => {
      const ArrayOfPrtoperty = product.filter((item: any) => item.category === category).map((item: any) => {
         return item
      });

      const Sets = Array.from(new Set(ArrayOfPrtoperty.map((item: any) => item.color)))

      const ArrayOfUniqueProperty = Sets.map((item: any) => {
         const result = {
            color: item,
            checked: false
         }
         return result
      });
      console.log(ArrayOfUniqueProperty)
      setTestColor(ArrayOfUniqueProperty)
   }

   const handlerChangeColor = (index: number) => {
      setTestColor(
         testColor?.map((topping, currentIndex) =>
            currentIndex === index
               ? { ...topping, checked: !topping.checked }
               : topping
         )
      )
   }

   return (
      <div
         className='animate'>
         <div className="wrapper">
            <div className="research">
               <div className="sort">
                  <p>Sort by:</p>
                  <div className="selects">
                     <select
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangePrice(e.target.value)}
                        value={sortPrice}>
                        <option value="">Price</option>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                     </select>
                     <select
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeYears(e.target.value)}
                        value={sortYear}>
                        <option>Year</option>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                     </select>
                     <select
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeSale(e.target.value)}
                        value={sortSale}>
                        <option>Sale</option>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                     </select>
                  </div>
               </div>
            </div>
            <div className="products__input">

               <div className="input">
                  <h1>Research</h1>
                  <input type="text"
                     placeholder="Search"
                     onChange={(e: ChangeEvent<HTMLInputElement>) => setResearch(e.target.value)}
                     value={research}
                  />
                  <h1>Category</h1>
                  <div className="categors">
                     <button style={filter === products ? { background: "black", color: "white" } : {}}
                        onClick={() => Filter(products)} >All</button>
                     <button style={filter === "Phone" ? { background: "black", color: "white" } : {}}
                        onClick={() => Filter("Phone")} >Phone</button>
                     <button
                        style={filter === "Clothes" ? { background: "black", color: "white" } : {}}
                        onClick={() => Filter("Clothes")} >Clothes</button>
                     <button
                        style={filter === "book" ? { background: "black", color: "white" } : {}}
                        onClick={() => Filter("book")} >Book</button>
                  </div>
                  {
                     (testColor === undefined || testColor.length === 0) ?
                        <></> :
                        <h2>Color section {filter}</h2>
                  }
                  <div className="colors">
                     {testColor?.map((index, i) => {
                        return (
                           <p className='check'>
                              <input type="checkbox"
                                 id={index.color}
                                 key={i}
                                 checked={testColor[i].checked}
                                 onChange={() => handlerChangeColor(i)} />
                              <label htmlFor={index.color}>
                                 <p className={testColor[i].checked ? 'circle active' : 'circle'}
                                    style={{ background: index.color }}
                                 >
                                 </p></label>
                           </p>
                        );
                     })}
                  </div>

                  <div className="unique_property">
                     {
                        (unique_property === undefined || unique_property.length === 0) ?
                           <></> :
                           <h2>Unique property {filter}</h2>
                     }
                     <div className="values">
                        {
                           unique_property?.map((item: any, i: number) => {
                              return (
                                 <p className='checks'
                                    key={i}
                                 >
                                    <input type="checkbox"
                                       id={item.unique_property}
                                       checked={item.checked}
                                       className={item.checked ? 'circle active' : 'circle'}
                                       style={item.checked ? { background: "black", color: "white" } : {}}
                                       onChange={() => handlerChangeCheckboxUniqueProperty(i)} />
                                    <label htmlFor={item.unique_property} >
                                       <p className={unique_property[i].checked ? 'circles active' : 'circles'}
                                       >  {item.unique_property}
                                       </p></label>
                                 </p>
                              );
                           })
                        }
                     </div>
                  </div>
                  <button className='reset'
                     onClick={ResetAllFilters} >
                     Reset all filters
                  </button>
               </div>
               <div className="products">

                  {products.length === 0 && (
                     <div className="no_products">
                        <h1>Sorry, no products 😔
                        </h1>
                     </div>
                  )}
                  {products?.filter((n: any) => {
                     if (research === "") return n;
                     else if (
                        n.name.toLowerCase().includes(research.toLowerCase())
                     ) {
                        return n;
                     }
                  })?.map((item: any, index: number) => {
                     const { id_product, img } = item;
                     return (
                        <div className="product" key={index}>
                           {item.sale !== 0 && (
                              <div className="sale">
                                 <p className='sales'>{item.sale}%</p>
                                 <p className="old_price">
                                    {item.price}$
                                 </p>

                                 <p className="newprice">
                                    {
                                       //округлить
                                       Math.round(item.price - (item.price * item.sale) / 100)
                                    }$
                                 </p>
                              </div>
                           )
                           }
                           <div className="choise_product">
                              <div className="blocks">
                                 <div className="block">
                                    <p onClick={() => AddToBasket(item)}> 🛒</p>
                                 </div>
                                 <div className="block">
                                    <Link to={`/product/:${id_product}`}>
                                       <p>🔍</p>
                                    </Link>
                                 </div>
                              </div>
                           </div>
                           <img src={img} alt={item.category}
                           />
                        </div>
                     )
                  }
                  )}
               </div>
            </div>
         </div >

         <Footer />
      </div >
   )
}
export default Product



