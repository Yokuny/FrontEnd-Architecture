import { Tab, Tabs } from "@paljs/ui";
import { useIntl } from "react-intl";
import { TYPE_MACHINE } from "../../../../constants";
import General from "./General";
import MaintenanceMachine from "./MaintenanceMachine";
import VesselCharacteristics from "./VesselCharacteristics";
import Contact from "./Contact";
import Cameras from "./Cameras";

export default function AddMachine(props) {
  const {
    data,
    enterprise,
    onChange,
    onChangeDetails,
    onChangeItemContacts,
    itemsByEnterprise,
    setEnterprise,
    isEdit,
    setImagePreview,
    setImage,
    imagePreview,
    image,
    onChangeItemCameras,
    disabled = false,
  } = props;

  const intl = useIntl();

  const isShowMaintenance =
    itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === enterprise?.value &&
        x.paths?.includes("/maintenance-plan-list")
    ) || false;

  const isShowPartList =
    itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === enterprise?.value &&
        x.paths?.includes("/parts-list")
    ) || false;

  const isShip = data?.modelMachine?.typeMachine === TYPE_MACHINE.SHIP;
  const isMaintenance = !!(isShowPartList || isShowMaintenance);

  const onChangeDimensions = (prop, value) => {
    onChangeDetails("aisDimensions", {
      ...(data?.dataSheet?.aisDimensions || {}),
      [prop]: value,
    });
  };

  if (!isShip && !isMaintenance) {
    return (
      <General
        data={data}
        onChange={onChange}
        enterprise={enterprise}
        setEnterprise={setEnterprise}
        isEdit={isEdit}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        setImage={setImage}
        image={image}
        disabled={disabled}
      />
    );
  }

  return (
    <>
      <Tabs fullWidth>
        <Tab
          icon="wifi-outline"
          responsive
          title={intl.formatMessage({ id: "machine" })}
          style={{ padding: 0 }}
        >
          <General
            data={data}
            onChange={onChange}
            enterprise={enterprise}
            setEnterprise={setEnterprise}
            isEdit={isEdit}
            setImagePreview={setImagePreview}
            imagePreview={imagePreview}
            setImage={setImage}
            image={image}
            disabled={disabled}
          />
        </Tab>

        <Tab
          style={{ padding: 0, display: !isShip && "none" }}
          responsive
          icon="file-text-outline"
          title={intl.formatMessage({ id: "details" })}
        >
          {isShip && (
            <VesselCharacteristics
              data={data.dataSheet}
              onChange={onChangeDetails}
              onChangeDimensions={onChangeDimensions}
            />
          )}
        </Tab>
        <Tab
          style={{ padding: 0, display: !isMaintenance && "none" }}
          icon="settings-2-outline"
          responsive
          title={intl.formatMessage({ id: "maintenance" })}
        >
          {isMaintenance && (
            <MaintenanceMachine
              isShowPartList={isShowPartList}
              isShowMaintenance={isShowMaintenance}
              data={data}
              onChange={onChange}
              enterprise={enterprise}
            />
          )}
        </Tab>
        <Tab
          icon="people-outline"
          responsive
          title={intl.formatMessage({ id: "contact" })}
          style={{ padding: 0 }}
        >
          <Contact
            data={data}
            dataSheet={data.dataSheet}
            onChange={onChangeDetails}
            onChangeMaster={onChange}
            onChangeItem={onChangeItemContacts}
          />
        </Tab>
        <Tab icon="camera-outline" responsive title="Câmeras">
          <Cameras
            data={data.cameras}
            onChangeItem={onChangeItemCameras}
            onChangeMaster={onChange}
          />
        </Tab>
      </Tabs>
    </>
  );
}
