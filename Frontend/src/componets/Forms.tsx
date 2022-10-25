import { ChangeEvent, FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddOrder } from './../store/CreateProduct';
import { useAppDispatch, useAppSelector } from "../store/store";

interface IProps {
   changeBool: (n: boolean) => void;
   cost: number;
   products: any | undefined;
}
const Forms: FC<IProps> = ({ changeBool, cost, products }) => {
   const [state, setState] = useState<number>(0);
   const [buttonValue, setbuttonValue] = useState<string>("Далее");
   const [dissabled, setDissabled] = useState<boolean>(true);
   const [name, setName] = useState<string>("")
   const [surname, setSurname] = useState<string>("");
   const [age, setAge] = useState<string>("");
   const [mobile, setMobile] = useState<string>("");
   const [gmail, setGmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const { user, loading, message } = useAppSelector((state: any): any => state.auth);
   const [country, setCountry] = useState<string>("")
   const [addres, setAdress] = useState<string>("")
   const [house, setHouse] = useState<string>("")
   const dispatch = useAppDispatch();

   const handleClick = (product: any) => {
      for (let i = 0; i < product.length; i++) {
         const order = {
            id_person: user.id_person,
            id_product: product[i].id_product,
            count: product[i].count,
            dateorders: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            mobile: mobile,
            gmail: gmail,
            place: `${country} ${addres} ${house}`
         }
         dispatch(AddOrder(order));
      }
      toast.success(`You have successfully bought ${product.length} products`);
      changeBool(false);
   };
   useEffect(() => {
      setCountry("Belarus")
   }, [])

   useEffect(() => {
      if (surname.trim() === "" || name.trim() === "" || age.trim() === "" || mobile.trim() === "" || password.trim() === "") {
         FuncDissabled(true);
      }

      else {
         FuncDissabled(false);
      }
   }, [name, surname, age, mobile, gmail, password])
   useEffect(() => {
      if (user) {
         setName(user?.name);
         setSurname(user?.surname);
      }
   }, [])

   useEffect(() => {
      if (mobile.length === 12) {
         setMobile(mobile.slice(0, 2) + " (" + mobile.slice(2, 4) + ") " + mobile.slice(4, 7) + "-" + mobile.slice(7, 9) + "-" + mobile.slice(9, 11))
      }

   }, [mobile])

   const TryMobile = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9+]+$/)) {

         if (value.length <= 12) {
            setMobile(value);
         }


      }
      else {
         setMobile(value.slice(0, value.length - 1))
      }

   }
   const TryAge = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9]+$/)) {
         if (value.length <= 2) {
            setAge(value);
         }
      }
      else {
         setAge(value.slice(0, value.length - 1))
      }
   }

   const TryEmail = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.match(/^[0-9a-zA-Z.@]+$/)) {
         if (value.length <= 30) {
            setGmail(value);
         }
      }
      else {
         setGmail(value.slice(0, value.length - 1))
      }
   }

   useEffect(() => {
      if (state === 2) {
         setbuttonValue("");
      } else if (state === 3) {
         changeBool(false);
      } else {
         setbuttonValue("Next");
      }
   }, [state]);
   const GetDateFromFirst = (data: any) => {
   }
   const FuncDissabled = (n: boolean) => {
      setDissabled(n)
   }

   const CheckEsc = (e: any) => {
      if (e.key === "Escape") {
         changeBool(false);
      }
   }

   useEffect(() => {
      window.addEventListener("keydown", CheckEsc);
      return () => {
         window.removeEventListener("keydown", CheckEsc);
      }
   }, []);

   return (
      <div className="onsova_form">
         <div className="close" onClick={() => changeBool(false)}>
            <span>╳</span>
         </div>
         <div className="froms">
            <div className="steps">
               {[1, 2, 3].map((value, index) => {
                  return (
                     <div
                        key={index}
                        className={`step ${state === index ? "active" : ""}${state > index ? "completet" : ""
                           }`}>
                        <p> {value}</p>
                     </div>
                  );
               })}
               <div className="step_1">
               </div>
            </div>
            <div className="osnova_form">
               {state === 0 && (
                  <div className="form_pages">
                     <div className="block choise">
                        <h1>Name</h1>

                        <input
                           type="text"
                           placeholder="Enter your name"
                           value={name}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                        <h1>Surname </h1>
                        <input
                           type="text"
                           placeholder="Enter your surname"
                           value={surname}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
                        />
                        <h1>Age</h1>
                        <input type="number" placeholder="Enter your age"
                           value={age}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => TryAge(e)}
                           min={1} max={100}
                           maxLength={3}

                        />
                        <div></div>
                     </div>
                     <div className="block choise">
                        <h1>Mobile Number </h1>
                        <input
                           type="phone"
                           placeholder="Enter your mobile number"
                           value={mobile}

                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              TryMobile(e)
                           }}

                           maxLength={13} />

                        <h1>Gmail</h1>
                        <input
                           type="text"
                           placeholder="Enter your gmail"
                           value={gmail}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => TryEmail(e)}
                        />
                        <h1>Password</h1>
                        <input type="password"
                           value={password}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                           placeholder="Enter your password"
                        />
                        <div>
                        </div>
                     </div>
                  </div>

               )}
               {state === 1 && (<div className="form_pages two">
                  <h1>Country</h1>
                  <select value={country} onChange={(e: ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}>
                     <option value="Russia">Russia</option>
                     <option value="Belarus">Belarus</option>
                     <option value="Ukraine">Ukraine</option>
                  </select>
                  <h1>City</h1>

                  {
                     country === "Russia" && (
                        <select value={addres} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdress(e.target.value)}>
                           <option value="Moscow">Moscow</option>
                           <option value="Saint-Petersburg">Saint-Petersburg</option>
                           <option value="Novosibirsk">Novosibirsk</option>
                        </select>
                     )

                  }
                  {
                     country === "Belarus" && (
                        <select value={addres} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdress(e.target.value)}>
                           <option value="Minsk">Minsk</option>
                           <option value="Gomel">Gomel</option>
                           <option value="Brest">Brest</option>
                           <option value="Vitebsk">Vitebsk</option>
                        </select>
                     )

                  }
                  {
                     country === "Ukraine" && (
                        <select value={addres} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdress(e.target.value)}>
                           <option value="Kiev">Kiev</option>
                           <option value="Kharkiv">Kharkiv</option>
                           <option value="Odessa">Odessa</option>
                           <option value="Dnipro">Dnipro</option>
                        </select>
                     )
                  }
                  <h1>
                     Street
                  </h1>
                  <select value={house} onChange={(e: ChangeEvent<HTMLSelectElement>) => setHouse(e.target.value)}>
                     <option value="Lenina">Lenina</option>
                     <option value="Pushkina">Pushkina</option>
                     <option value="Gogolia">Gogolia</option>
                     <option value="Tolstogo">Tolstogo</option>
                  </select>
                  <div>
                  </div>
               </div >)}
               {state === 2 && (<div className="form_pages tree">
                  <div className="block">
                     {products?.length === 1 ? <>
                        {products?.map((item: any) => {
                           const { img, name, price, count } = item;
                           return (
                              <div className="block_buy" key={name}>
                                 <img src={img} alt="" />
                                 <p>{name}</p>
                                 <p>{price}$</p>
                                 <p>{count}</p>
                              </div>
                           )
                        })}</> : (
                        <>{products?.map((item: any) => {
                           const { img, name, price, count } = item;
                           return (
                              <div className="block_buy" key={name}>
                                 <img src={img} alt="" />
                                 <p>{name}</p>
                                 <p>{price}$</p>
                                 <p>{count}</p>
                              </div>
                           )
                        })}</>
                     )}
                  </div>
                  <div className="block">
                     <h1>Title {cost}$</h1>
                     <button onClick={() => handleClick(products)}>Pay</button>
                  </div>
               </div >)
               }
            </div>
            <div className="osnova_forms">
               {state > 0 && (
                  <button onClick={() => setState((state) => state - 1)}>
                     Previous                  </button>
               )}
               <button
                  disabled={dissabled}
                  style={state === 2 ? { display: "none" } : {}}
                  onClick={() => setState((state) => state + 1)
                  }>

                  {buttonValue}
               </button>
            </div>
         </div>
      </div>
   );
};
export default Forms;
