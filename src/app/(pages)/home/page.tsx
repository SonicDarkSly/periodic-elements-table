'use client'

import React, { useState, useEffect } from 'react';

const Homepage: React.FC = () => {
  const [elements, setElements] = useState<
    Array<{
      symbol: string;
      name: string;
      atomicNumber: number;
      atomicMass: string | number;
    }>
  >([]);

  useEffect(() => {
    fetch('/api/elements/getAllElements')
      .then(response => response.json())
      .then(elements => setElements(elements.list));
  }, []);

  const tableLayout: Array<Array<number | null>> = [
    [1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2],
    [3, 4, null, null, null, null, null, null, null, null, null, null, 5, 6, 7, 8, 9, 10],
    [11, 12, null, null, null, null, null, null, null, null, null, null, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 5771, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 63, 64, 65, 66],
    [87, 88, 89103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
  ];


  const generatePeriodicTable = () => {
    const periodicTable: JSX.Element[] = [];
    let key = 0;

    for (let column = 0; column < tableLayout[0].length; column++) {
      const tableRow: JSX.Element[] = [];

      for (let row = 0; row < tableLayout.length; row++) {
        const elementNumber = tableLayout[row][column];

        if (elementNumber) {
          const element = elements.find(elem => elem.atomicNumber === elementNumber);
          if (element) {
            tableRow.push(
              <div key={key++} className={`element group${elementNumber}`}>
                <div className="symbol">{element.symbol}</div>
                <div className="name">{element.name}</div>
                <div className="atomicNumber">{element.atomicNumber}</div>
                <div className="atomicMass">{parseFloat(element.atomicMass).toFixed(2)}</div>
              </div>
            );
          } else {
            tableRow.push(
              <div key={key++} className={elementNumber === 5771 ? `element lanthanides` : elementNumber === 89103 ? `element actinides` : `element`}>
                <div className="symbol">{elementNumber === 5771 ? "lanthanides" : "actinides"}</div>
              </div>
            );
          }
        } else {
          tableRow.push(
            <div key={key++} className="element empty">
              <div className="emptyText"></div>
            </div>
          );
        }
      }

      periodicTable.push(
        <div key={key++} className="tableRow">
          {tableRow}
        </div>
      );
    }

    return periodicTable;
  };

  const generateLanthanides = () => {
    const lanthanides: JSX.Element[] = [];
    let key = 0;
  
    for (let i = 0; i < 15; i++) {
      const elementNumber = 57 + i;
      const element = elements.find(elem => elem.atomicNumber === elementNumber);
  
      if (element) {
        lanthanides.push(
          <div key={key++} className={`element lanthanides`}>
            <div className="symbol">{element.symbol}</div>
            <div className="name">{element.name}</div>
            <div className="atomicNumber">{element.atomicNumber}</div>
            <div className="atomicMass">{element.atomicMass}</div>
          </div>
        );
      } else {
        lanthanides.push(
          <div key={key++} className="element empty">
            <div className="emptyText">-</div>
          </div>
        );
      }
    }
  
    return lanthanides;
  };
  
  const generateActinides = () => {
    const actinides: JSX.Element[] = [];
    let key = 0;
  
    for (let i = 0; i < 15; i++) {
      const elementNumber = 89 + i;
      const element = elements.find(elem => elem.atomicNumber === elementNumber);
  
      if (element) {
        actinides.push(
          <div key={key++} className={`element actinides`}>
            <div className="symbol">{element.symbol}</div>
            <div className="name">{element.name}</div>
            <div className="atomicNumber">{element.atomicNumber}</div>
            <div className="atomicMass">{element.atomicMass}</div>
          </div>
        );
      } else {
        actinides.push(
          <div key={key++} className="element empty">
            <div className="emptyText">-</div>
          </div>
        );
      }
    }
  
    return actinides;
  };
  

  return (
    <div className='container'>
      <h1>Tableau périodique des éléments</h1>
      <div className="periodicTable">{generatePeriodicTable()}</div>
      <h2>Lanthanides</h2>
      <div className="periodicTable">{generateLanthanides()}</div>
      <h2>Actinides</h2>
      <div className="periodicTable">{generateActinides()}</div>
    </div>
  );
};

export default Homepage;
