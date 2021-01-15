import axios from 'axios';
const POKEDEX_CONTAINER = document.getElementById("pokedex");
const SHOW_MORE = "Ver mas";

class Pokedex {
  /*   me va a permitir almacenar el arreglo de pokemones
    en esta clase recibimos el JSON de la pokeapi.
    en el constructor recibimos los pokemones, por si las moscas, ponemos que por default sea un arreglo vacio. */
    constructor(pokemones = []){
        this.pokemones = pokemones;
    }
    buildPokemonCard(pokemon){
      const pokeContainer = document.createElement("div");
      const pokeImage = document.createElement("img");
      const pokeBody = document.createElement("div");
      const pokeTitle = document.createElement("h5");
      const pokeModalToogle = document.createElement("button");
    
      pokeContainer.classList.add("card", "custom-card");

      if (pokemon.types.length > 1) pokeContainer.style.backgroundImage = `linear-gradient(45deg, ${pokemon.types.map((type) => `var(--${type})`).join(", ")})`;
      
      pokeContainer.style.backgroundColor = `var(--${pokemon.types[0]})`;
      pokeImage.classList.add("card-img-top");
      pokeBody.classList.add(
        "card-body",
        "d-flex",
        "flex-column",
        "align-items-center"
      );
      pokeTitle.classList.add("card-title");
      pokeModalToogle.classList.add("btn", "btn-primary");
    
      pokeImage.src = pokemon.sprites.front_default;
      pokeImage.alt = `${pokemon.name} Image`;
      pokeTitle.innerHTML = `${pokemon.name} <span class="badge badge-dark">${pokemon.id}</span>`;
      pokeModalToogle.textContent = SHOW_MORE;
    
      pokeModalToogle.setAttribute("data-id-pokemon", pokemon._id);
      pokeModalToogle.setAttribute("data-toggle", "modal");
      pokeModalToogle.setAttribute("data-target", "#pokeDetailInformacion");
    
      pokeBody.appendChild(pokeTitle);
      pokeBody.appendChild(pokeModalToogle);
      pokeContainer.appendChild(pokeImage);
      pokeContainer.appendChild(pokeBody);
      return pokeContainer;
    }
    renderPokemonsAsCards(){
        POKEDEX_CONTAINER.innerHTML = "";
        let promises = this.pokemones.map((pokemon) => {
          //const url = pokemon.url
          //esta forma de abajo es por destructuracion de objetos, que es mas chida
          const {url}  = pokemon;
          return axios.get(url).then(response => response.data);
          //this.buildPokemonCard(pokemon);
        });
        //recuerda que Axios nos devuelve promesas
        Promise.all(promises)
        .then(pokemons => {
          const pokemonCards = pokemons.map((pokemon) => this.buildPokemonCard(pokemon));
          pokemonCards.map((pokemon => POKEDEX_CONTAINER.appendChild(pokemonCards)));
        })
        .catch(e => console.error(e))
        //Bueno, esto es algo muy loco, porque al momento en el que mostramos este arreglo lleno de objetos pokemon, aparece vacio, pero unos instantes despues y al acceder al arreglo desde la consola, esta lleno, esto se debe a que 'va cambiando con el tiempo'.
          
    }
  
}
export default Pokedex;