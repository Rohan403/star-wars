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
            ? selectedCharacter.movies.join(',')
            : ""
        );
      }
    }
  }, [person, people]);

  const handleAddOrUpdateCharacter = () => {
    if (!name?.trim() || !height?.trim() || !movies) {
      alert("Please fill out all fields.");
      return;
    }
    if (person.id && person.id !== null) {
      // Editing existing character
      const updatedCharacters = people.map((character) =>
        character.id === person.id
          ? {
              ...character,
              name: name,
              height: height,
              movies: movies.split(","),
            }
          : character
      );
      console.log('updatedCharacters......',updatedCharacters)
      // Update the state and localStorage
      setCharacters(updatedCharacters);
      localStorage.setItem("charactersData", JSON.stringify(updatedCharacters));
    } else {
      // Adding a new character
      const newCharacter = {
        id: people.length + 1,
        name: name,
        height: height,
        movies: movies.split(","),
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
    >
      <button className="close-button" onClick={onClose}>
        <img src="/img/x-close.svg" alt="Close" />
      </button>
      <div className="modal-content">
        <p>Name</p>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            // Check if the input matches the regex pattern (only numbers)
            if (!/\d/.test(e.target.value)) {
              setName(e.target.value);
            }
          }}
          style={{ padding: 5, borderRadius: 4 }}
        />
        <p>Height</p>
        <input
          type="text"
          placeholder="Height"
          value={height}
          onChange={(e) => {
            // Check if the input matches the regex pattern (only numbers)
            if (/^\d*$/.test(e.target.value)) {
              setHeight(e.target.value);
            }
          }}
          style={{ padding: 5, borderRadius: 4 }}
          maxLength={3}
        />
        <p>
          Movies{" "}
          {person.id == null
            ? "(If multiple movies then separate with a ',')"
            : ""}
        </p>
        <textarea
          type="text"
          placeholder="Movies"
          value={movies}
          onChange={(e) => setMovies(e.target.value)}
          rows={5}
          cols={30}
          style={{ padding: 5, borderRadius: 4 }}
        />
        <div>
          <button onClick={() => handleAddOrUpdateCharacter()}>
            {person.id && person.id !== null ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
