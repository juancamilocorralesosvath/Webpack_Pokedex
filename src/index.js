import './styles/main.scss'; // de esta manera traemos los estilos para que los Loaders de webpack puedan procesarlo.
import Pokedex from './pokedex.js';
//asi lo haciamos antes
//const request = require('request');
//ahora con axios
import axios from 'axios';
// 1) tenemos que traer todos los pokemones!
const init = () => {
    //TODO: Consultar pokeApi
    // Make a request for a user with a given ID
    axios.get(' https://pokeapi.co/api/v2/pokemon?limit=0&offset=20')
        .then(response => {
            // Obtenemos la lista de pokemones incompleta
            const pokemonesAPI = response.data.results;
            //pedimos la data completa de todos los pokemones,
            //y guardamos los objetos 'promise' en una variable
            let promises = pokemonesAPI.map((pokemon) => {
                //const url = pokemon.url
                //esta forma de abajo es por destructuracion de objetos, que es mas chida
                const { url } = pokemon;
                return axios.get(url).then(response => response.data);
                //this.buildPokemonCard(pokemon);
            });
            //recuerda que Axios nos devuelve promesas, asi que esperamos a que todas las promesas terminen de procesarse
            Promise.all(promises)
                .then(pokemons => {
                    //ojo, que esta asignacion y el console.log ls tenemos que llevar a cabo aqui, en el .then de la promesa, de lo contrario, si lo hacemos por fuera, no obtendriamos respuesta, porque estamos dentro de un proceso asincrono.
                    const pokedex = new Pokedex(pokemons);
                    pokedex.renderPokemonsAsCards();
             })
                .catch(e => console.error(e))
        
        })
        .catch(function (error) {
            // handle error
            alert('No funciono u_U');
            console.log(error);
        });
};
// 2) tenemos que renderizar cada pokemon
// 3) hay que activar un modal por cada pokemon

init();