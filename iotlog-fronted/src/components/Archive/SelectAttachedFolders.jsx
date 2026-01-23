import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Col from "@paljs/ui/Col";
import {
    LabelIcon,
    Fetch,
} from "../";

const SelectAttatchedFolders = ({
    onChange,
    value,
    isDisabled = false,
}) => {
    const [isLoading, setIsLoading] = React.useState();
    const intl = useIntl();
    const first = React.useRef(true);
    const [selectOptions, setSelectOptions] = React.useState();

    React.useEffect(() => {
        getData();
    }, []);


    const getData = async () => {
        const response = await Fetch.get("/folder/list/attachment-view");
        if (!!response.data.length) {
            setSelectOptions(response.data.map(
                (folder) => {
                    return {
                        value: folder.id,
                        label: folder.name
                    }
                }
            ))
        }
    }

    return (
        <>
            <Col breakPoint={{ md: 12, lg: 12 }} className="mb-4">
                <LabelIcon
                    iconName="folder-outline"
                    title={`${intl.formatMessage({ id: "attatched.folder" })}`}
                />
                <Select
                    options={selectOptions}
                    noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
                    placeholder={intl.formatMessage({
                        id: "select.option",
                    })}
                    isLoading={isLoading}
                    onChange={onChange}
                    isMulti
                    value={value}
                    isDisabled={isDisabled}
                    menuPosition="fixed"
                />
            </Col>
        </>
    );
};

export default SelectAttatchedFolders;
