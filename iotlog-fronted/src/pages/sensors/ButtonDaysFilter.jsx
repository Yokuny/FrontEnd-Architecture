import { Button, Row } from "@paljs/ui";

const ButtonDaysFilter = ({
  onChange = (day) => { },
  value = 1,
}) => {

  const buttonsDate = [
    {
      value: 1,
      label: '1 D',
    },
    {
      value: 3,
      label: '3 D',
    },
    {
      value: 7,
      label: '7 D',
    }
  ]
  return (
    <>
      <Row className="m-0 pt-1" middle="xs" center="xs">
        {
          buttonsDate.map((button) => (
            <Button
            size="Tiny"
            className="mr-2"
            style={{ border: '0px' }}
            status={value === button.value ? 'Info' : 'Basic'}
            appearance={value === button.value ? 'filled' : 'outline'}
            key={button.value} onClick={() => onChange(button.value)}>{button.label}</Button>
          ))
        }
      </Row>
    </>
  );
}

export default ButtonDaysFilter;
