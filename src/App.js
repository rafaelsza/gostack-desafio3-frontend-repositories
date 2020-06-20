import React, {useState, useEffect} from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Repository ${Date.now()}`,
	    url: "https://github.com/rafaelsza/js-starter-rocketseat",
	    techs: ["Node.js"]
    });

    const repo = response.data;

    setRepositories([...repositories, repo]);
  }

  async function handleAddLike(id) {
    const response = await api.post(`repositories/${id}/like`);

    const indexRepo = repositories.findIndex(repo => repo.id === id);

    repositories[indexRepo] = response.data;

    setRepositories([...repositories]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    if(response.status === 204){
      const indexRepo = repositories.findIndex(repo => repo.id === id);

      repositories.splice(indexRepo, 1);
      setRepositories([...repositories]);
    }
  }

  function compareLikes(likes) {
    switch(likes){
      case 0:
        return 'Ninguém curtiu ainda. Seja o primeiro!';
      break;
      case 1:
        return `${likes} curtida`;
      break;
      default:
        return `${likes} curtidas`
    }
  }

  return (
    <div className="divRoot">
      <ul data-testid="repository-list" className="listRepositories">
        {repositories.map(repository => 
          <li key={repository.id} className="repository">
              <strong>
                {repository.title}
              </strong>
              <ul>
                {repository.techs.map(tech => 
                  <li key={tech}>{tech}</li>  
                )} 
              </ul>
                <p>
                  {compareLikes(repository.likes)}
                </p>
                <div className="contentButtons">
                  <button className="btLike" onClick={() => handleAddLike(repository.id)}>
                    <img src="" width="14"/>
                    Curtir
                  </button>
                  <button className="btDelete" onClick={() => handleRemoveRepository(repository.id)}>
                    Remover
                  </button>
                </div>
          </li>
        )}
      </ul>

      <button className="btAdd" onClick={handleAddRepository}>Adicionar repositório</button>
    </div>
  );
}

export default App;
