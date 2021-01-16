import axios from 'axios';
const POKEDEX_CONTAINER = document.getElementById("pokedex");
const SHOW_MORE = "Ver mas";
const TYPES = "Tipos";
const EVOLUTIONS = "Evoluciones";
const MODAL_SELECTOR = "#pokeDetailInformacion";
const SEARCH_SELECTOR = "searchPokemon";
 //falta hacer que funcione la barra de busqueda
 
class Pokedex {
  /*   me va a permitir almacenar el arreglo de pokemones
    en esta clase recibimos el JSON de la pokeapi.
    en el constructor recibimos los pokemones, por si las moscas, ponemos que por default sea un arreglo vacio. */
  constructor(pokemones = []) {
    this.pokemones = pokemones;
    this.addEventListenerToSearch();
    this.addEventListenerToModal();
  }
  addEventListenerToSearch(){ 
    document
      .getElementById(SEARCH_SELECTOR)
      .addEventListener(
        "keyup", 
        (e) => this.debounce(this.search(e), 300),
        );
  }
  search(e){
    const pokemonListFiltered = this.pokemones.filter((pokemon) =>
    pokemon.name.toLocaleLowerCase().includes(e.target.value.toLowerCase())
    );
    this.pokemones = pokemonListFiltered;
    this.renderPokemonsAsCards();
    //this.renderPokemonsAsCards(pokemonListFiltered.map((pokemon) => this.buildPokemonCard(pokemon)));
  }
  debounce(fn, delay){ 
    let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  }
  addEventListenerToSearch(){ 
    document
      .getElementById(SEARCH_SELECTOR)
      .addEventListener("keyup", this.debounce(this.searchPokemon, 300));
  }
  buildPokemonCard(pokemon) {
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
  renderPokemonsAsCards() {
    POKEDEX_CONTAINER.innerHTML = '';
    const pokemonCards = this.pokemones.map((pokemon) => this.buildPokemonCard(pokemon));
    pokemonCards.forEach((pokemon) => POKEDEX_CONTAINER.appendChild(pokemon));
    //Bueno, esto es algo muy loco, porque al momento en el que mostramos este arreglo lleno de objetos pokemon, aparece vacio, pero unos instantes despues y al acceder al arreglo desde la consola, esta lleno, esto se debe a que 'va cambiando con el tiempo'.
  }
  buildPokeModalImage(pokemon){
    const pokeImage = document.createElement("img");
    pokeImage.classList.add("img-fluid");
    pokeImage.src = pokemon.sprites.front_default;
    pokeImage.alt = "Image of a pokemon!"
    return pokeImage;
  }
  buildPokeModalDescription(pokemon){
    const pokeDescription = document.createElement("p");
    pokeDescription.innerText = pokemon.description;
    return pokeDescription;
  }
  buildPokeModalDetails(pokemon){
      const pokeDetails = document.createElement("div");
      const pokeTypes = document.createElement("div");
      const pokeTypesTitle = document.createElement("h5");
      const pokeEvolutions = document.createElement("div");
      const pokeEvolutionsTitle = document.createElement("h5");
    
      pokeTypesTitle.innerText = TYPES;
      pokeEvolutionsTitle.innerText = EVOLUTIONS;
    
      pokemon.types.map((type) => {
        const pokeDetailsType = document.createElement("span");
        pokeDetailsType.innerText = type;
        pokeDetailsType.classList.add("badge", "badge-dark", "p-2", "m-1");
        pokeTypes.appendChild(pokeDetailsType);
      });
    
   /*   El objeto de la API no trae el campo "evolutions" 
   
        pokemon.evolutions.map((evolution) => {
        const pokeDetailsType = document.createElement("span");
        pokeDetailsType.innerText = evolution.to;
        pokeDetailsType.classList.add("badge", "badge-success", "p-2", "m-1");
        pokeEvolutions.appendChild(pokeDetailsType);
      }); */
      pokeTypes.appendChild(pokeTypesTitle);
      pokeEvolutions.appendChild(pokeEvolutionsTitle);
      pokeDetails.appendChild(pokeTypes);
      pokeDetails.appendChild(pokeEvolutions);
      return pokeDetails;
    
  }
  addEventListenerToModal(){
    $(MODAL_SELECTOR).on("show.bs.modal", (event) => {
      const modal = $(MODAL_SELECTOR);
      const button = $(event.relatedTarget);
      const cardText = button[0].parentNode.innerText;
      const idPokemon = Number(cardText.split(' ')[1].slice(0, 1));
      /* en el idPokemon lo que esta sucediendo es que Maui tomo el texto que aparece en el modal, que era algo como asi:
      venusaur 5$Ver Mas
      con el .split(' ') queda asi:
      ["venusaur", "5$Ver Mas"]
      al indicarle que queremos la posicion 1:
      "5$Ver Mas"
      al aplicar el .slice(0, 1) sacamos la primera posicion:
      "5"
      obtenemos el texto cinco, asi que lo parseamos a numero mediante 
      Number()
      y ahora si obtenemos
      5
      que es el id del pokemon con el cual realizamos lo demas */
      const modalBody = modal.find(".modal-body");
      const dataAttributes = button.data();
      const pokemon = this.pokemones.find(
        (pokemon) => pokemon.id === idPokemon
      );
    
      modal.find(".modal-title").text(pokemon.name);
      modalBody.html("");
    
      const pokeImage = this.buildPokeModalImage(pokemon);
      const pokeDescription = this.buildPokeModalDescription(pokemon);
      const pokeDetails = this.buildPokeModalDetails(pokemon);
      modalBody.addClass("d-flex flex-column align-items-center");
      modalBody.append(pokeImage);
      modalBody.append(pokeDescription);
      modalBody.append(pokeDetails);
    });
  }
}
export default Pokedex;