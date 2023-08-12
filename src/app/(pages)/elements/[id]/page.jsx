"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AtomAnimation from "../../../components/AtomAnimation";

const ElementPage = () => {
  const params = useParams();

  const [animationStarted, setAnimationStarted] = useState(false);
  const [element, setElement] = useState({});

  const fetchElements = async () => {
    try {
      const response = await fetch(
        `/api/elements/getOneElement?number=${params.id}`
      );
      const data = await response.json();
      setElement(data);
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  const startAnimation = () => {
    setAnimationStarted(!animationStarted);
  };

  return (
    <div>
      <h1>Element Details</h1>
      <button onClick={startAnimation}>Démarrer l'animation</button>

      {element && (
        <AtomAnimation
          protonCount={element.protons}
          neutronCount={element.neutrons}
          electronCount={element.atomicNumber}
          elementData={element}
          animationStarted={animationStarted}
        />
      )}
    </div>
  );
};

export default ElementPage;
