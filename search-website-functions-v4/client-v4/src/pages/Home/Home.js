import React from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from '../../components/SearchBar/SearchBar';

import "./Home.css";
import "../../pages/Search/Search.css";
import logo from '../../images/cognitive_search.jpg';

export default function Home() {
  const [status, setStatus] = useState({});
  const navigate = useNavigate();
  const navigateToSearchPage = (q) => {
    if (!q || q === '') {
      q = '*'
    }
    navigate('/search?q=' + q);
  }

    useEffect(() => {
    axios.get('/api/status')
      .then(response => {
        console.log(JSON.stringify(response.data))
        setStatus(response.data);

      },
      error => {
        console.log(error);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (
    <main className="main main--home">
      <div className="row home-search">
        <img className="logo" src={logo} alt="Cognitive Search"></img>
        <p className="poweredby lead">Powered by Azure Cognitive Search</p>
        <SearchBar postSearchHandler={navigateToSearchPage}></SearchBar>
      </div>
      { status }
    </main>
  );
};
