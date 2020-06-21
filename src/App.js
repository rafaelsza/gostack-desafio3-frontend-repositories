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
                    <img src="assets/like.png" className="iconButton"/>
                    Curtir
                  </button>

                  <a href={repository.url} target="_blank">
                    <button className="btGithub" onClick={() => {}}>
                        <img src="assets/github.png" className="iconButton"/>
                        GitHub
                    </button>
                  </a>

                  <button className="btDelete" onClick={() => handleRemoveRepository(repository.id)}>
                    <img src="assets/trash.png" className="iconButton"/>
                    Remover
                  </button>
                </div>
          </li>
        )}
      </ul>

      <button className="btAdd" onClick={handleAddRepository}>
        <img src="assets/add.png" className="iconButton"/>
        Adicionar repositório
      </button>
    </div>
  );
}

export default App;
