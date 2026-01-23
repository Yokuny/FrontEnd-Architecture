import { List, ListItem } from "@paljs/ui";
import { Modal, TextSpan } from "../../../components";
import { useIntl } from "react-intl";

export default function ModalAnomaly(props) {
  const { show,
    onRequestClose,
    sensorsFeatures
  } = props;


  const sensors = Object.keys(sensorsFeatures || {});

  const intl = useIntl();

  return <>
    <Modal
      title={intl.formatMessage({ id: "sensors" })}
      size="Small"
      show={show} onClose={onRequestClose}
      styleContent={{
        padding: "0px",
        height: "40rem",
        overflowX: "hiden",
        overflowY: "auto",
      }}
      >
        <List>
          {sensors?.map((item, index) => (
            <ListItem key={index}>
              <TextSpan apparence="p2">
                {item}
              </TextSpan>
            </ListItem>
          ))}
        </List>
    </Modal>
  </>;
}
