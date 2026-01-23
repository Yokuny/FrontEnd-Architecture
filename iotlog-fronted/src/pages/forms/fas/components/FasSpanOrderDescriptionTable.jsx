
const FasSpanOrderDescriptionTable = ({ breakPoint = { lg: 4, md: 4 }, apparence = "s1", title, text, titleText = "", ...rest }) => {

  return (
    <div style={{
      fontWeight: "600",
      fontSize: "0.8rem",
      "white-space": "pre-line"
    }}>
      {text}
    </div>
  );
}

export { FasSpanOrderDescriptionTable }
