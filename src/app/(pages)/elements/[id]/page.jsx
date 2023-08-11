'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import AtomAnimation from '../../../components/AtomAnimation';

const ElementPage = () => {
  const params = useParams()
  
  const [animationStarted, setAnimationStarted] = useState(false);

  console.log(params.id);
  
  const element = {
    symbol: 'Pu',
    name: 'Plutonium',
    atomicNumber: Number(params.id),
    "electronLayers": [2, 8, 18, 32, 24, 8, 2]
  };

  const startAnimation = () => {
    setAnimationStarted(!animationStarted);
  };

  return (
    <div>
      <h1>Element Details</h1>
      <button onClick={startAnimation}>Démarrer l'animation</button>
      <AtomAnimation
        protonCount={element.atomicNumber}
        neutronCount={145}
        electronCount={element.atomicNumber}
        elementData={element}
        animationStarted={animationStarted}
      />
    </div>
  );
  
};

export default ElementPage;
