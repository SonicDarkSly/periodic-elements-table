"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AtomAnimation from "../../../components/AtomAnimation";
import Navigations from "../../../components/Navigations";
import axios from "axios";

const ElementPage = () => {
  const params = useParams();

  const id = params.id;

  const [element, setElement] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchElements = async () => {
    setLoading(true);
    await axios
      .get(`/api/elements/getOneElement?number=${id}`)
      .then((response) => {
        const data = response.data;
        setElement(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // appellation fr selon element json
  const getDisplayKey = (key) => {
    const keyMappings = {
      electronLayers: "Structure électronique",
      atomicNumber: "Numéro Atomique",
      symbol: "Symbole",
      atomicMass: "Masse Atomique",
      electronicConfiguration: "Configuration Électronique",
      electronegativity: "Électronégativité",
      atomicRadius: "Rayon Atomique",
      ionRadius: "Rayon Ionique",
      vanDerWaalsRadius: "Rayon de van der Waals",
      ionizationEnergy: "Énergie d'Ionisation",
      electronAffinity: "Affinité Électronique",
      oxidationStates: "États d'Oxydation",
      standardState: "État Standard",
      bondingType: "Type de Liaison",
      meltingPoint: "Point de Fusion",
      boilingPoint: "Point d'Ébullition",
      density: "Densité",
      groupBlock: "Bloc du Groupe",
      yearDiscovered: "Année de Découverte",
      block: "Bloc",
      cpkHexColor: "Couleur CPK en Hex",
      period: "Période",
      group: "Groupe",
      protons: "Protons",
      neutrons: "Neutrons",
      electrons: "Électrons",
      name: "Nom",
    };
    return keyMappings[key] || key;
  };

  // rendu du tableau
  const renderKeyValueRow = (key, value) => (
    <tr key={key}>
      <td>{getDisplayKey(key)}</td>
      <td>{key === "electronLayers" ? value.join(", ") : value}</td>
    </tr>
  );

  useEffect(() => {
    fetchElements();
  }, []);

  return (
    <div className="page-element">
      <div className="header">
        <h1>Fiche pour {element.name}</h1>
      </div>

      <Navigations id={parseInt(id)} />

      <div className="body">
        {error ? (
          <div className="container">
            <p className="error">{error.message}</p>
          </div>
        ) : (
          <div className="container">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
              <>
                {element && (
                  <AtomAnimation
                    protonCount={element.protons}
                    neutronCount={element.neutrons}
                    electronCount={element.electrons}
                    elementData={element}
                  />
                )}

                <div className="informations">
                  <table className="element-table">
                    <tbody>
                      {Object.entries(element).map(([key, value]) =>
                        renderKeyValueRow(key, value)
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementPage;