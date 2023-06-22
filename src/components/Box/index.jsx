import React, { useState, useRef } from "react";
import Moveable from "react-moveable";

export const BoxComponent = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  imgUrl,
  fitType,
  id,
  setSelected,
  isSelected = false
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    fitType,
    imgUrl,
    id
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();
  
  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      imgUrl,
      fitType
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  // Esta función sirve para aplicar algo al final de hacer un Resize
  // Pero en este caso no tiene utilidad alguna; aun así se ha mantenido
  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;

    // const positionMaxTop = top + newHeight;
    // const positionMaxLeft = left + newWidth;

    // if (positionMaxTop > parentBounds?.height)
    //   newHeight = parentBounds?.height - top;
    // if (positionMaxLeft > parentBounds?.width)
    //   newWidth = parentBounds?.width - left;

    // const { lastEvent } = e;
    // const { drag } = lastEvent;
    // const { beforeTranslate } = drag;

    // const absoluteTop = top + beforeTranslate[1];
    // const absoluteLeft = left + beforeTranslate[0];

    updateMoveable(
      id,
      {
        top,
        left,
        width: newWidth,
        height: newHeight,
        color,
        imgUrl,
        fitType,
      },
      true
    );
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${imgUrl})`,
          objectFit: fitType,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
            imgUrl,
            fitType
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        verticalGuidelines={[
          50, 150, 200, 250, 300, 350, 400, 450, 550,
        ]}
        horizontalGuidelines={[
            50, 150, 200, 250, 300, 350, 400, 450, 550,
        ]}
        snappable={true}
        snapDirections={{
            top: true,
            left: true,
            bottom: true,
            right: true,
        }}
      />
    </>
  );
};
