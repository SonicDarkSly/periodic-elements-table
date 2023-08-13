"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AtomAnimation from "../../../components/AtomAnimation";

const ElementPage = () => {
  const params = useParams();

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

  return (
    <div className="page-element">
      <div className="header">
        <h1>Fiche pour {element.name}</h1>
        <a href="/home">retour</a>
      </div>

      <div className="body">
        <div className="container-animation neon-border">
          {element && (
            <AtomAnimation
              protonCount={element.protons}
              neutronCount={element.neutrons}
              electronCount={element.atomicNumber}
              elementData={element}
            />
          )}

          <div className="informations">
            <table className="element-table">
              <tbody>
                {Object.entries(element).map(([key, value]) => (
                  <tr key={key}>
                    <td>
                      {key === "electronLayers" ? "Structure de Valence" : key}
                    </td>
                    <td>
                      {key === "electronLayers" ? value.join(", ") : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementPage;
