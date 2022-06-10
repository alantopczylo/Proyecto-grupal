import React, { useEffect, useState } from "react";
import NavBarShop from "../../Components/NavBar/NavBarShop";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, NavLink } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getOwners, getPets } from "../../redux/actions/ownProvActions";
import styleContainer from "../../Components/GlobalCss/InContainer.module.css";
import style from "./Profile.module.css";

export default function Profile() {
  const pets = useSelector((state) => state.pets);
  const dispatch = useDispatch();
  const [userData, setUser] = useState({});
  const { user, isAuthenticated } = useAuth0();
  const [isProvider, setIsProvider] = useState(false)
  const [providerInfo, setProviderInfo] = useState()
  useEffect(() => {
    if (isAuthenticated) {
      axios.get("http://localhost:3001/providers?filter=&order=ASC").then((x) => {
        const providerCheck = x.data.find((x) => x.email === user.email);
        if (providerCheck){ 
          setIsProvider(true);
          setProviderInfo(providerCheck);
        }
      })
      axios.get("http://localhost:3001/owners").then((x) => {
        const userdb = x.data.find((x) => x.email === user.email);
        console.log(userdb);
        setUser({
          nombre: user.name,
          picture:
            userdb.profilePicture && userdb.profilePicture[0]
              ? userdb.profilePicture[0]
              : "/assets/img/notloged.png",
          email: user.email,
          pets: userdb.pets,
          address: userdb.address,
          isAdmin: userdb.isAdmin
        });
        console.log("userdb", userdb);
      });
    }
  }, [user, isAuthenticated, pets, dispatch]);

  async function byePet(id) {
    await axios.delete(`http://localhost:3001/pets/${id}`, { isActive: false });
    dispatch(getPets());
  }

  console.log('USERDATA', userData)


  return (
    <main>
      <NavBarShop />
      <div className={styleContainer.container}>
        <section className={style.infoProfile}>
          <img src={userData.picture} alt="profilePicture" />
          <article className={style.profile}>
            <h1 className={style.name}>{user.name}</h1>
            <div>
              <NavLink to="/mis-datos">
                <button className={style.data}>Cambiar datos</button>
              </NavLink>
            </div>
          </article>
          <div className={style.service}>
            <NavLink to="/servicio">
              <button>Ofrecer servicio</button>
            </NavLink>
          </div>
          <div className={style.service}>
            <NavLink to="/calificacionesOwner">
              <button>MIS RESEÑAS</button>
            </NavLink>
          </div>
          {isProvider && <div className={style.service}>
            <NavLink to="/calificacionesProvider">
              <button>RESEÑAS RECIBIDAS</button>
            </NavLink>
          </div>}
        </section>
        <section className={style.mainInfoProfile}>
          <h2>Mis datos</h2>
          <h4 className={style.email}>
            {" "}
            Correo electronico: <span className={style.span}>{user.email}</span>
          </h4>
          <h4 className={style.address}>
            Direccion:{" "}
            <span className={style.span}>
              {userData.address ? userData.address.road : null}
            </span>{" "}
          </h4>
        </section>
        
       {providerInfo&& providerInfo.schedule &&<section className={style.mainInfoProfile}>
          <h2 style={{display:"block"}}>Mis horarios de trabajo</h2>
          <br/>
          <br/>
          {console.log(providerInfo)}
          <div style={{display:'block'}}><h3>lunes</h3>{providerInfo.schedule.lunes.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>martes</h3>{providerInfo.schedule.martes.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>miércoles</h3>{providerInfo.schedule.miercoles.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>jueves</h3>{providerInfo.schedule.jueves.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>viernes</h3>{providerInfo.schedule.viernes.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>sábado</h3>{providerInfo.schedule.sabado.map(x=><div><h4>{x}</h4></div>)}</div>
          <div><h3>domingo</h3>{providerInfo.schedule.domingo.map(x=><div><h4>{x}</h4></div>)}</div>
          <NavLink to="/misHorarios">
              <button>CAMBIAR HORARIOS</button>
            </NavLink>
        </section>}
        <section>
          <h2 className={style.boxLabel}>Mis mascotas</h2>
          <div className={style.addPet}>
            <NavLink to="/agregarmascota">
              <button>Agregar mascota</button>
            </NavLink>
            {
           userData.isAdmin?
            <Link to='/admin/dashboard'>
            <button>Herramientas de Admin</button> 
            </Link>
              : null
          
                }
          </div>
          <article className={style.petsProfile}>
            {userData.pets && userData.pets.length > 0
              ? userData.pets.map((x, y) => {
                if (x.isActive) {
                  return (
                    <div className={style.petInfo} key={y}>
                      <img src={x.profilePicture} alt="profilePicture" className={style.profilePicture} />
                      <div className={style.petData}>
                        <h2>{x.name}</h2>
                        <h4>Raza: {x.race}</h4>
                        <p className={style.aboutDog}>
                          Sobre {x.name}: {x.description}
                        </p>
                        <button onClick={() => byePet(x.id)}>
                          Eliminar mascota
                        </button>
                      </div>
                    </div>
                  );
                }
              })
              : null}
          </article>
        </section>
        <section>
          <h2>Mis reservas</h2>
        </section>
      </div>
      <Footer />
    </main>
  );
};
