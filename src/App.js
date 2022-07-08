import './App.css';
import { useState, useRef } from 'react';

function App() {

  const [entryValue, setEntryValue] = useState("");
  const resultsDiv = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryValue) {
      alert("Por favor, digite um verbete na caixa de texto.");
      return;
    }
    const endpoint = new URL(`https://significado.herokuapp.com/v2/${entryValue}`);
    const response = await fetch(endpoint);
    if (response.status === 400) {
      alert("Verbete não encontrado na base de dados.");
      return;
    }

    if (resultsDiv.current.classList.contains("full-list")) {
      resultsDiv.current.textContent = null;
    } else {
      resultsDiv.current.classList.add("full-list")
    }

    const data = await response.json();
    renderResults(data)

  }

  async function renderResults(data) {
    let title = document.createElement("h2");
    title.appendChild(document.createTextNode(entryValue));
    resultsDiv.current.appendChild(title);
    data.forEach(entriesData);

  }

  async function entriesData(returnedData) {

    let paragraph = document.createElement("h4");
    let contentPartOfSpeech = document.createTextNode(returnedData.partOfSpeech);
    paragraph.appendChild(contentPartOfSpeech)
    resultsDiv.current.appendChild(paragraph);
    let meaningsList = document.createElement("ul");

    resultsDiv.current.appendChild(meaningsList)
    for (let x = 0; x < returnedData.meanings.length; x++) {
      let meaningBox = document.createElement("li")
      let contentMeanings = document.createTextNode(returnedData.meanings[x]);
      meaningBox.appendChild(contentMeanings)
      meaningsList.appendChild(meaningBox);
    }

    let etimologyBox = document.createElement("p");
    let contentEtimology = document.createTextNode(returnedData.etymology);
    etimologyBox.appendChild(contentEtimology)
    resultsDiv.current.appendChild(etimologyBox);

    return;
  }


  return (
    <div className="App">
      <main className="base-container">
        <div className="main-container">
          <h1>reactDict</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="searchField"
              id="search-field"
              placeholder="Digite o verbete aqui"
              onChange={(e) => setEntryValue(e.target.value)}
            />
            <button id="searchBtn">Pesquisar</button>
          </form>
        </div>

        <div className="result-container">
          <div id="results" ref={resultsDiv}>

          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="footer-inside">
          <a href="https://www.linkedin.com/in/leonsp95/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/leonsp95" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>

    </div>
  );
}

export default App;
