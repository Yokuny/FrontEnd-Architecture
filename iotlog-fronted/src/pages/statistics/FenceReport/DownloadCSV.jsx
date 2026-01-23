import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";
import { FormattedMessage } from "react-intl";

export default function DownloadCSV({ listData }) {
    const downloadRef = React.useRef();

    const formatMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        let result = [];
        if (hours > 0) {
            result.push(`${hours}h`);
        }
        if (mins > 0) {
            result.push(`${mins}m`);
        }
        return result.join(" ");
    };

    const data = listData?.map((x) => ({
        machine: x.machine?.name || "",
        fence: x.fence?.description || "",
        fenceType: x.fence?.type?.label || x.fence?.type?.value || "",
        start: x.dateTimeStart ? moment(x.dateTimeStart).format("DD/MM/YYYY HH:mm") : "",
        end: x.dateTimeEnd ? moment(x.dateTimeEnd).format("DD/MM/YYYY HH:mm") : "",
        duration: formatMinutes(
            (new Date(x.dateTimeEnd).getTime() - new Date(x.dateTimeStart).getTime()) / 60000
        ),
    })) || [];

    const headers = [
        { label: "Embarcação", key: "machine" },
        { label: "Cerca", key: "fence" },
        { label: "Tipo", key: "fenceType" },
        { label: "Início", key: "start" },
        { label: "Fim", key: "end" },
        { label: "Duração", key: "duration" },
    ];

    const onDownload = () => {
        if (downloadRef.current?.link) downloadRef.current.link.click();
    };

    return (
        <>
            <CSVLink
                filename={`fence_report_${moment().format("YYYY-MM-DD-HHmmss")}.csv`}
                data={data}
                headers={headers}
                separator={";"}
                ref={downloadRef}
                style={{ display: "none" }}
            />
            <Tooltip
                content={<FormattedMessage id="download.csv" defaultMessage="Download CSV" />}
                placement="top"
            >
                <Button
                    size="Tiny"
                    status="Basic"
                    appearance="ghost"
                    className="flex-between"
                    onClick={onDownload}
                    disabled={!listData || listData.length === 0}
                >
                    <EvaIcon name="download-outline" className="mr-1" />
                    <FormattedMessage id="download.csv" defaultMessage="Download CSV" />
                </Button>
            </Tooltip>
        </>
    );
}
