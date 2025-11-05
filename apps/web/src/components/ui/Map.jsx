const Map = ({ latitude, longitude }) => {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;

  return (
    <div style={{ width: "100%" }}>
      <iframe
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
      >
        <a href="https://www.gps.ie/car-satnav-gps/">Car Navigation Systems</a>
      </iframe>
    </div>
  );
};

export default Map;