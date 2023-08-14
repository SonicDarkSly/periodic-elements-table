const NavigationButtons = ({ id }) => {

  const goToPrevious = () => {
    if (id > 1) {
      window.location.href = `/elements/${id - 1}`;
    }
  };

  const goToNext = () => {
    if (id < 118) {
      window.location.href = `/elements/${id + 1}`;
    }
  };

  return (
    <div className="navigation-buttons">
    <button onClick={goToPrevious} disabled={id === 1}>
      Précédent
    </button>
    <button onClick={goToNext} disabled={id === 118}>
      Suivant
    </button>
  </div>
  );
};

export default NavigationButtons;
