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
  const [nameErr, setNameErr] = useState(false);
  const [heightErr, setHeightErr] = useState(false);
  const [movieErr, setMovieErr] = useState(false);

  useEffect(() => {
    if (person.id) {
      const selectedCharacter = people.find(
        (character) => character.id === person.id
      );
      if (selectedCharacter) {
        const { name, height, movies } = selectedCharacter;
        setName(name || "");
        setHeight(height || "");
        setMovies(movies ? movies.join(",") : "");
      }
    }
  }, [person, people]);

  const updateLocalStorage = (characters) => {
    localStorage.setItem("charactersData", JSON.stringify(characters));
  };

  const handleAddOrUpdateCharacter = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const hasError = !name.trim() || !height.trim() || !movies.trim();
    if (hasError) {
      setNameErr(!name.trim());
      setHeightErr(!height.trim());
      setMovieErr(!movies.trim());
      return;
    }
    const updatedCharacters = person.id
      ? people.map((character) =>
          character.id === person.id
            ? { ...character, name, height, movies: movies.split(",") }
            : character
        )
      : [
          ...people,
          { id: people.length + 1, name, height, movies: movies.split(",") },
        ];
    // Update the state and localStorage
    setCharacters(updatedCharacters);
    updateLocalStorage(updatedCharacters);

    // Reset form fields and selected character ID
    setName("");
    setHeight("");
    setMovies("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <button className="close-button" onClick={onClose}>
        <img src="/img/x-close.svg" alt="Close" />
      </button>
      <div className="modal-content">
        <form onSubmit={handleAddOrUpdateCharacter}>
          <p>Name</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              !/\d/.test(e.target.value) && setName(e.target.value);
              setNameErr(false);
            }}
            style={{
              padding: 5,
              borderRadius: 4,
              borderColor: nameErr ? "red" : "",
              borderStyle: "solid",
              borderWidth: 2,
            }}
          />
          <p>Height</p>
          <input
            type="text"
            placeholder="Height"
            value={height}
            onChange={(e) => {
              /^\d*$/.test(e.target.value) && setHeight(e.target.value);
              setHeightErr(false);
            }}
            style={{
              padding: 5,
              borderRadius: 4,
              borderColor: heightErr ? "red" : "",
              borderStyle: "solid",
              borderWidth: 2,
            }}
            maxLength={3}
          />
          <p>
            Movies{" "}
            {!person.id ? "(If multiple movies then separate with a ',')" : ""}
          </p>
          <textarea
            type="text"
            placeholder="Movies"
            value={movies}
            onChange={(e) => {
              setMovies(e.target.value);
              setMovieErr(false);
            }}
            rows={5}
            cols={30}
            style={{
              padding: 5,
              borderRadius: 4,
              borderColor: movieErr ? "red" : "",
              borderStyle: "solid",
              borderWidth: 2,
            }}
          />
          <div>
            <button type="submit">{person.id ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
