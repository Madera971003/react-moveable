import React, { useState, useEffect } from "react";
// Para mejor estructura se separó el componente que conforma la caja
import { BoxComponent } from "./components/Box";
// Esta es la función del servicio para las fotos
import { getPhotos } from "./services/getPhotos";
import './styles.css'

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  // Un nuevo estado para el almacenamiento de las photos
  const [photos, setPhotos] = useState([])

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    // objeto de fit disponibles para css
    const fitTypeObj = ["fill", "contain", "cover", "none", "scale-down"];

    // Funcion para obtener algún numero entre las 5000 photos disponibles
    // Siempre y cuando aun no se haya mostrado en el frontend
    function getRandomNum() {
        let numRandom = Math.floor(Math.random() * photos.length);
        const numFound = moveableComponents.some((el) => el.id === numRandom);

        if (!numFound) {
            return numRandom;
        } else {
            getRandomNum();
        }
    }

    const num = getRandomNum();
    const img = photos[num];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: img.id,
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        imgUrl: img.url,
        fitType: fitTypeObj[Math.floor(Math.random() * fitTypeObj.length)],
        updateEnd: true,
      },
    ]);
  };

  // Esta funcion elimina el Box que en su momento está seleccionado
  // haciendo un filtro
  const removeBox = (id) => {
    setMoveableComponents((current) =>
        current.filter((object) => {
            return object.id !== id;
        })
    );
  };

  // Esta funcion sirve para actualizar el estado de la posicion de la Caja
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  useEffect(() => {
    // Este useEffect solo se ejecuta una vez durante todo el proceso
    // almacenandolo en photos con setPhotos
    getPhotos().then(res => setPhotos(res))
  }, [])

  return (
    <main style={{ height : "100vh", width: "100vw" }}>
      <h1 style={{fontFamily: 'Arial', textAlign: 'center', padding: '20px 0'}}>Add, Drag and Delete Boxes</h1>
      {/* Aqui hice un bloque con tres botones con funcionalidades */}
      {/* Se incluyo un tercero para limpiar todos los Boxes */}
      <div className="buttonsContainer">
        <button className="buttonAdd" onClick={addMoveable}>
            Add Moveable
        </button>
        <button
            className="buttonRemove"
            onClick={() => removeBox(selected)}
        >
            Remove Moveable
        </button>
        <button
            className="buttonDeleteAll"
            onClick={() => setMoveableComponents([])}
        >
            Delete All
        </button>
      </div>
      <div id="parent">
        {moveableComponents.map((item) => (
          <BoxComponent
            {...item}
            key={item.id}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        padding: '4px',
        fontFamily: 'Arial'
      }}>
        <p>Hecho por <strong>Abisai Antonio Madera</strong></p>
      </div>
    </main>
  );
};

export default App;

