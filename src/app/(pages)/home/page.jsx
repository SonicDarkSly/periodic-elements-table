"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();

  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = (atomicNumber) => {
    router.push(`/elements/${atomicNumber}`);
  };

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const response = await fetch("/api/elements/getAllElements");
        const data = await response.json();
        setElements(data.list);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    };

    fetchElements();
  }, []);

  const tableLayout = [
    [
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      2,
    ],
    [
      3,
      4,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      5,
      6,
      7,
      8,
      9,
      10,
    ],
    [
      11,
      12,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      13,
      14,
      15,
      16,
      17,
      18,
    ],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 5771, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [
      87, 88, 89103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
      116, 117, 118,
    ],
  ];

  const getClassForGroupBlock = (groupBlock) => {
    switch (groupBlock) {
      case "nonmetal":
        return "nonmetal";
      case "noble gas":
        return "noble-gas";
      case "alkali metal":
        return "alkali-metal";
      case "alkaline earth metal":
        return "alkaline-earth-metal";
      case "metalloid":
        return "metalloid";
      case "halogen":
        return "halogen";
      case "metal":
        return "metal";
      case "transition metal":
        return "transition-metal";
      case "lanthanoid":
        return "lanthanoid";
      case "actinoid":
        return "actinoid";
      case "post-transition metal":
        return "post-transition-metal";
      default:
        return "";
    }
  };

  const generatePeriodicTable = () => {
    let key = 0;

    const periodicTable = tableLayout[0].map((_, columnIndex) => (
      <div key={columnIndex} className="tableColumn">
        {tableLayout.map((row, rowIndex) => {
          const elementNumber = row[columnIndex];

          if (elementNumber) {
            const element = elements.find(
              (elem) => elem.atomicNumber === elementNumber
            );
            if (element) {
              const group = getClassForGroupBlock(element.groupBlock);
              return (
                <div
                  key={key++}
                  className={`element ${group}`}
                  onClick={() => handleClick(element.atomicNumber)}
                >
                  <div className="symbol">{element.symbol}</div>
                  <div className="atomicNumber">{element.atomicNumber}</div>
                  <div className="atomicMass">
                    {typeof element.atomicMass === "number"
                      ? element.atomicMass.toFixed(2)
                      : parseFloat(element.atomicMass).toFixed(2)}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={key++}
                  className={
                    elementNumber === 5771
                      ? `element lanthanides`
                      : elementNumber === 89103
                      ? `element actinides`
                      : `element`
                  }
                >
                  <div className="name">
                    <span className="rotate-text">
                      {elementNumber === 5771 && "lanthanides"}
                      {elementNumber === 89103 && "actinides"}
                    </span>
                  </div>
                </div>
              );
            }
          } else {
            return (
              <div key={key++} className="element empty">
                <div className="emptyText"></div>
              </div>
            );
          }
        })}
      </div>
    ));

    return periodicTable;
  };

  const generateElements = (startNumber, endNumber) => {
    const elementsList = [];
    let key = 0;

    for (let i = startNumber; i <= endNumber; i++) {
      const element = elements.find((elem) => elem.atomicNumber === i);

      if (element) {
        elementsList.push(
          <div
            key={key++}
            className={`element ${
              startNumber === 57 ? "lanthanides" : "actinides"
            }`}
            onClick={() => handleClick(element.atomicNumber)}
          >
            <div className="symbol">{element.symbol}</div>
            <div className="atomicNumber">{element.atomicNumber}</div>
            <div className="atomicMass">
              {typeof element.atomicMass === "number"
                ? element.atomicMass.toFixed(2)
                : parseFloat(element.atomicMass).toFixed(2)}
            </div>
          </div>
        );
      } else {
        elementsList.push(
          <div key={key++} className="element empty">
            <div className="emptyText">-</div>
          </div>
        );
      }
    }

    return elementsList;
  };

  const generateLanthanides = () => {
    return generateElements(57, 71);
  };

  const generateActinides = () => {
    return generateElements(89, 103);
  };

  return (
    <div className="container">
      {loading ? (
        <div>
          <h1>Tableau périodique des éléments</h1>
          <div className="periodicTable">{generatePeriodicTable()}</div>
          <h2>Lanthanides</h2>
          <div className="periodicTable">{generateLanthanides()}</div>
          <h2>Actinides</h2>
          <div className="periodicTable">{generateActinides()}</div>
        </div>
      ) : (
        <div>chargement</div>
      )}
    </div>
  );
};

export default Homepage;
