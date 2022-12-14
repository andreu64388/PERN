import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
interface contactsTS {
   name: string;
   img: string;
   Link: string;
}

const contacts: contactsTS[] = [
   { name: "VK", img: "http://localhost:3001/Social/Vk.png", Link: "https://vk.com/andr15shev" },
   { name: "Instagram", img: "http://localhost:3001/Social/Insta.png", Link: "https://www.instagram.com/andr_15_sh/" },
   { name: "Telegram", img: "http://localhost:3001/Social/Telegram.png", Link: "https://github.com/andreu64388" },
]
const Footer: FC = () => {
   const [isWrite, setIsWrite] = useState<boolean>(false);
   const ChangeWrite = (state: boolean) => {
      setIsWrite(state);
   }
   useEffect(() => {
      if (isWrite) {
         window.addEventListener("scroll", () => {

            setIsWrite(false);
         })
      }

      return () => {
         window.removeEventListener("scroll", () => {
            setIsWrite(false);
         })
      }

   }, [isWrite]);


   return (
      <div className='footer'>
         <div className="wrapper">
            <div className="logo">
               <Link to="/">
                  WebShop
               </Link>
            </div>
            <div className="adress_contact">
               <div className="adress">
                  <h3>Addres</h3>
                  <p>
                     123456, Belarus, Minsk, Lenina str. 15
                  </p>
               </div>
               <div className="contact">
                  <h3>Contact</h3>
                  <p>
                     +375 (29) 123-45-67
                  </p>

                  <button
                     className='btn_write'
                     onClick={() => setIsWrite(!isWrite)}
                  >
                     Write to us
                  </button>
               </div>
            </div>
            {isWrite && <SendDeveloper ChangeWrite={ChangeWrite}></SendDeveloper>}
            <div className="contacts">


               <ul>
                  {contacts.map((item: contactsTS) => {
                     const { img, name, Link } = item;
                     return (
                        <li key={name}>
                           <a href={Link}>
                              <img src={img} alt={name} />
                              <p>{name}</p>
                           </a>
                        </li>
                     )

                  })}
               </ul>
            </div>
         </div>
      </div >
   )
}

export default Footer

const SendDeveloper = ({ ChangeWrite }: any) => {
   const [name, setName] = useState<string>("");
   const [email, setEmail] = useState<string>("");
   const [message, setMessage] = useState<string>("");


   const CheckIsEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
         ChangeWrite(false);
      }
   }
   useEffect(() => {
      document.addEventListener("keydown", CheckIsEscape);
      return () => {
         document.removeEventListener("keydown", CheckIsEscape)
      }
   }, [])

   const Send = () => {
      const data = {
         name,
         email,
         message
      }
      if (name.length === 0 || email.length === 0 || message.length === 0) {
         toast.error("Enter all fields");
         return;
      }
      toast.success("Message send");
      ChangeWrite(false);
   }

   const SendKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
         Send();
      }
   }



   return (
      <div className="modal">
         <div className="close"
            onClick={() => ChangeWrite(false)}>
            <span>???</span>
         </div>
         <div className="block_main_from">
            <h1>
               Write to us
            </h1>
            <form
            >

               <input

                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
               <input

                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />

               <textarea
                  name=""
                  id=""
                  //
                  placeholder="Write your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e: any) => SendKey(e)}
               ></textarea>

               <div className="buttons">
                  <button
                     type='button'
                     onClick={() => Send()}
                  >
                     Send
                  </button>
                  <button
                     type="reset"
                     onClick={() => ChangeWrite(false)}
                  >
                     Cancel
                  </button>


               </div>

            </form>      </div>
      </div>
   )
}
