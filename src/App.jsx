import Main from "./components/Main";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

import { useState, useEffect } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = "http://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;

      //caching
      const today = new Date().toDateString();
      const localkey = `NASA-${today}`;

      if (localStorage.getItem(localkey)) {
        const apiData = JSON.parse(localStorage.getItem(localkey));
        setData(apiData);
        return;
      }
      //if no cached data available, jus clean the localstorage and fetch new
      localStorage.clear();
      try {
        const res = await fetch(url);
        const apiData = await res.json();
        //cache the obtained data
        localStorage.setItem(localkey, JSON.stringify(apiData));
        setData(apiData);
        console.log(apiData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAPIData();
  }, []);

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && <Footer data={data} handleToggleMoadal={handleToggleModal} />}
    </>
  );
}

export default App;
