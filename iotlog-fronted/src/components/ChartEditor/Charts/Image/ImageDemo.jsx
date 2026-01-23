import React from "react";
import { ContainerChart } from "../../Utils";
import TextSpan from "../../../Text/TextSpan";
import { FormattedMessage } from "react-intl";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(2);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 4));
    }, 3200);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

let images = [
  "https://images.unsplash.com/photo-1561480337-7fb12b1d9bc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1564182843062-67664a64c9b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
  "https://cdn.pixabay.com/photo/2016/06/02/06/36/fork-lift-truck-1430377_960_720.jpg",
  "https://cdn.pixabay.com/photo/2017/01/29/15/17/container-2018465_960_720.jpg"
]

export function ImageDemo(props) {
  const { height = 150, width = 150 } = props;
  const { value } = useSetTimeout()
  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow pt-1">
        <TextSpan apparence="s2" className="pb-2">
          <FormattedMessage id="image" />
        </TextSpan>
        <img
          src={images[value]}
          alt="Image_Demo"
          width={width}
          height={height - 30}
          style={{ objectFit: 'cover' }}
        />
      </ContainerChart>
    </>
  );
}
