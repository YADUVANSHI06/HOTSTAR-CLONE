import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "../Search/Search";
import { useEffect } from "react";
import { app } from "../../fireabase.config";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState();
  const [isPremium, setIsPremium] = useState();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const { search } = useLocation();

  useEffect(() => {
    setIsPremium(localStorage.getItem("premium") ? true : false);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(search).get("success")) {
      localStorage.setItem("premium", true);
    }
  }, []);

  useEffect(() => {
    setUser(localStorage.getItem("user") ? true : false);
    window.addEventListener("user-change", () => {
      setUser(localStorage.getItem("user") ? true : false);
    });
  }, []);

  const logOutUser = () => {
    localStorage.removeItem("user");
    setUser(false);
    navigate("/");
  };

  const handleLogin = () => {
    signInWithPopup(
      auth,
      provider.setCustomParameters({ prompt: "select_account" })
    )
      .then((result) => {
        // The signed-in user info.
        console.log(result);
        const user = result.user;
        // dispatch(
        //   addUser({
        //     _id: user.uid,
        //     name: user.displayName,
        //     email: user.email,
        //     image: user.photoURL,
        //   })
        // );
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
          })
        );
        window.dispatchEvent(new Event("user-change"));
        // setTimeout(() => {
        //   navigate("/");
        // }, 1500);
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  };

  const buyPremium = async () => {
    const res = await axios.post("http://localhost:7000/pay", {
      amount: 100000,
    });

    window.location.href = res.data;
    console.log(res);
  };

  return (
    <>
      <div className="nav">
        <div className="nav-left">
          <div>
            <Link to="/">
              <img
                className="disney-img"
                src="https://secure-media.hotstarext.com/web-assets/prod/images/brand-logos/disney-hotstar-logo-dark.svg"
                alt=""
              />
            </Link>
          </div>

          <div className="dropdown">
            <Link className="link" to="/tv">
              TV
            </Link>
            <ul>
              <li>
                <Link to={"/tv/en/individual"}>Other Shows</Link>
              </li>
              <li>
                <Link to={"/tv/hi/individual"}>Hotstar Specials</Link>
              </li>
              <li>
                <Link to={"/tv/te/individual"}>Star Plus</Link>
              </li>
              <li>
                <Link to={"/tv/ml/individual"}>Star Vijay</Link>
              </li>
              <li>
                <Link to={"/tv/ta/individual"}>Asianet</Link>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <Link className="link" to="/movie">
              Movies
            </Link>
            <ul>
              <li>
                <Link to={"/movies/hi"}>Hindi</Link>
              </li>
              <li>
                <Link to={"/movies/bn"}>Bengali</Link>
              </li>
              <li>
                <Link to={"/movies/te"}>Telugu</Link>
              </li>
              <li>
                <Link to={"/movies/ml"}>Malayalam</Link>
              </li>
              <li>
                <Link to={"/movies/ta"}>Tamil</Link>
              </li>
              <li>
                <Link to={"/movies/kn"}>Kannada</Link>
              </li>
            </ul>
          </div>
          <div className="dropdown">
            <Link className="link" to="/sports">
              Sports
            </Link>
            <ul>
              <li>
                <Link to={"#"}>Cricket</Link>
              </li>
              <li>
                <Link to={"#"}>Football</Link>
              </li>
              <li>
                <Link to={"#"}>Hockey</Link>
              </li>
              <li>
                <Link to={"#"}>Formula one</Link>
              </li>
              <li>
                <Link to={"#"}>Tennis</Link>
              </li>
              <li>
                <Link to={"#"}>Golf</Link>
              </li>
              <li>
                <Link to={"#"}>Kabaddi</Link>
              </li>
            </ul>
          </div>
          <div classaName="small">
            <Link to="/disney+">Disney+</Link>
          </div>
        </div>
        <div className="nav-right">
          <Search />
          {user ? (
            <>
              <div className="dropdown">
                <div className="link" to="/sports">
                  PROFILE
                </div>
                <ul>
                  <li>
                    <Link to="/watchlist">WatchList</Link>
                  </li>
                  <li>
                    <Link to="/profile">My Account</Link>
                  </li>
                  <li onClick={logOutUser}>Log Out</li>
                </ul>
              </div>
              {!isPremium && <div onClick={buyPremium}>Buy Premium</div>}
            </>
          ) : (
            <div onClick={handleLogin}>LOGIN</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
