import React, { useState, useEffect } from "react";
import "./CharacterDetails.css";
import Modal from "react-modal";

export default function CharacterDetails({
  person,
  isOpen,
  onClose,
  people,
  setCharacters,
}) {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [movies, setMovies] = useState("");


  useEffect(() => {
    // Set form fields with data of the selected character for editing
    if (person.id !== null) {
      const selectedCharacter = people.find(
        (character) => character.id === person.id
      );
      if (selectedCharacter) {
        setName(selectedCharacter.name || "");
        setHeight(selectedCharacter.height || "");
        setMovies(
          selectedCharacter.movies
            ? selectedCharacter.movies.map((data) => data)
            : ""
        );
      }
    }
  }, [person, people]);

  const handleAddOrUpdateCharacter = () => {
    if (person.id && person.id !== null) {
      // Editing existing character
      const updatedCharacters = people.map((character) =>
        character.id === person.id
          ? {
              ...character,
              name: name,
              height: height,
              movies: movies.split(','),
            }
          : character
      );

      // Update the state and localStorage
      setCharacters(updatedCharacters);
      localStorage.setItem("charactersData", JSON.stringify(updatedCharacters));
    } else {
      // Adding a new character
      const newCharacter = {
        id: people.length + 1,
        name: name,
        height: height,
        // movies: [{ title: movies }],
        movies: movies.split(',')
      };
      const updatedCharacters = [...people, newCharacter];

      // Update the state and localStorage
      setCharacters(updatedCharacters);
      localStorage.setItem("charactersData", JSON.stringify(updatedCharacters));
    }

    // Reset form fields and selected character ID
    setName("");
    setHeight("");
    setMovies("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Character Details"
    >
      <button className="close-button" onClick={onClose}>
        <img src="/img/x-close.svg" alt="Close" />
      </button>
      <div className="modal-content">
        <div>
          <p>Name</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Height</p>
          <input
            type="text"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <p>Movies</p>
          <textarea
            type="text"
            placeholder="Movies"
            value={movies}
            onChange={(e) => setMovies(e.target.value)}
            rows={5} 
            cols={30}
          />
          <div>
            <button onClick={() => handleAddOrUpdateCharacter()}>Submit</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
