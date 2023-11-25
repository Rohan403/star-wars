import React, { useState, useEffect } from "react";
import "./Character.css";
import CharacterDetails from "./CharacterDetails";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import { faker } from '@faker-js/faker';


export default function Character() {
  const [people, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is already in localStorage
        const localStorageData = localStorage.getItem("charactersData");
        if (localStorageData) {
          // If data is present in localStorage, use it
          setCharacters(JSON.parse(localStorageData));
        } else {
          // If no data in localStorage, fetch from API
          const response = await axios.get("https://swapi.dev/api/people/");
          const data = response.data.results.slice(0, 3);

          const charactersWithMovies = await Promise.all(
            data.map(async (character, index) => {
              const movies = await Promise.all(
                character.films.map(async (filmUrl) => {
                  try {
                    const filmResponse = await axios.get(filmUrl);
                    return filmResponse.data.title;
                  } catch (error) {
                    console.error("Error fetching movie title:", error);
                    return "Unknown Title";
                  }
                })
              );

              return {
                id: index + 1,
                name: character.name,
                height: character.height,
                movies: movies.map((title) => (title)),
              };
            })
          );

          setCharacters(charactersWithMovies);

          // Store charactersWithMovies in localStorage
          localStorage.setItem(
            "charactersData",
            JSON.stringify(charactersWithMovies)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCharacterClick = (person) => {
    setSelectedCharacter(person);
  };

  const handleModalClose = () => {
    setSelectedCharacter(null);
  };
  

  const handleRemoveCharacter = (id) => {
    const updatedCharacters = people.filter((character) => character.id !== id);

    // Update the state
    setCharacters(updatedCharacters);

    // Update local storage
    localStorage.setItem("charactersData", JSON.stringify(updatedCharacters));
  };

  return (
    <div className="character-wrapper _container">
      {loading && (
        <BeatLoader
          className="spinner-container"
          color="#fff"
          loading={loading}
          speedMultiplier={0.5}
          size={17}
        />
      )}
      <button
        className="button-outline"
        id="character-button"
        onClick={() => handleCharacterClick(true)}
      >
        Add your favorite characters!!!
      </button>
      {!loading && (
        <>
          <ul className="character-list">
            {people?.length > 0 ? (
              people.map((person) => (
                <>
                  <li key={person.url} id="card">
                  {people?.length > 3 && (
                    <button
                      className="close-button"
                      onClick={() => handleRemoveCharacter(person.id)}
                    >
                      <img src="/img/x-close.svg" alt="Close" />
                    </button>
                  )}
                    <img
                      className="character-img character-click"
                      src={faker.image.avatar()}
                      alt={person.name}
                      onClick={() => handleCharacterClick(person)}
                    />
                    <h4>{person.name}</h4>
                    <p>Height: {person.height}</p>
                    <h4>Movies</h4>
                    <ul>
                      {person.movies.map((movie, movieIndex) => (
                        <li key={movieIndex}>
                          <p>{movieIndex + 1}. {movie}</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="button-outline"
                      onClick={() => handleCharacterClick(person)}
                    >
                      Edit
                    </button>
                  </li>
                </>
              ))
            ) : (
              <h3 className="no-results">No results found</h3>
            )}
          </ul>
          {selectedCharacter && (
            <CharacterDetails
              person={selectedCharacter}
              isOpen={true}
              onClose={handleModalClose}
              people={people}
              setCharacters={setCharacters}
              setSelectedCharacter={setSelectedCharacter}
            />
          )}
        </>
      )}
    </div>
  );
}
