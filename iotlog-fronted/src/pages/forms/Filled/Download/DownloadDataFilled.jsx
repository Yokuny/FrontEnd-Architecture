import { Button, EvaIcon, Row } from "@paljs/ui";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

import { getFormatCell } from "../Data/Utils";
import { Fetch, SpinnerFull } from "../../../../components";

export default function DownloadDataFilled(props) {

  const { totalItems, isFormRVE } = props;

  const [itemsToExport, setItemsToExport] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const downloadRef = useRef();

  const [searchParams] = useSearchParams();

  const idForm = searchParams.get("idForm");

  useEffect(() => {
    if (itemsToExport.length) {
      onDowload();
    }
  }, [itemsToExport]);

  const getData = () => {

    const inconsistenceType = searchParams.get("inconsistenceType");

    const machines = searchParams.get("machines");
    const initialDate = searchParams.get("initialDate");
    const finalDate = searchParams.get("finalDate");

    const filter = [
      `idForm=${idForm}`,
      `size=${totalItems}`,
      `page=0`,
    ];

    if (machines) {
      filter.push(`machines=${machines}`);
    }

    if (initialDate) {
      filter.push(`dateStart=${new Date(initialDate).toISOString()}`);
    }

    if (finalDate) {
      filter.push(`dateEnd=${new Date(finalDate).toISOString()}`);
    }

    if (inconsistenceType) {
      filter.push(`inconsistenceType=${inconsistenceType}`);
    }

    setIsExporting(true);
    Fetch.get(`/formdata/download?${filter.join("&")}`)
      .then((response) => {
        setItemsToExport(processCSV(response.data ? response.data : {}));
        setIsExporting(false);
      })
      .catch((e) => {
        setIsExporting(false);
      });
  }

  const onDowload = () => {
    if (downloadRef.current?.link) downloadRef.current.link.click();
  };

  const processCSV = (data) => {
    const columns = data?.columns || [];

    return data.data.flatMap((item) => {
      const baseRow = {};
      const tableDatas = {};

      columns.forEach((column) => {
        if (column.datatype === "table" || column.datatype === "group") {
          const tableData = getFormatCell(column, item, data, true);
          if (Array.isArray(tableData)) {
            tableDatas[column.name] = {
              data: tableData,
              fields: column.fields || []
            };
          }
        } else {
          baseRow[column.name] = getFormatCell(column, item, data, true);
        }
      });

      if (isFormRVE) {
        baseRow.status = item?.inconsistenciesType?.join(', ');
      }

      if (Object.keys(tableDatas).length === 0) {
        return [baseRow];
      }

      const tableRows = [];
      const maxRows = Math.max(...Object.values(tableDatas).map(table => table.data.length));

      for (let i = 0; i < maxRows; i++) {
        const row = {};

        if (i === 0) {
          Object.assign(row, baseRow);
        } else {
          Object.keys(baseRow).forEach(key => {
            row[key] = '';
          });
        }

        Object.entries(tableDatas).forEach(([tableName, tableInfo]) => {
          const { data, fields } = tableInfo;
          const rowData = data[i] || {};

          fields.forEach(field => {
            const columnKey = field.label || field.name;
            row[columnKey] = rowData[field.name] || '';
          });
        });

        tableRows.push(row);
      }

      return tableRows;
    });
  };

  return (<>
    <Row start="md" className="m-0">
      <CSVLink
        filename={`data-filled-export-${moment().format("YYYY-MM-DD-HHmmss")}.csv`}
        data={itemsToExport}
        ref={downloadRef}
        style={{ display: "none" }}
        separator={";"}
      />

      <Button
        size="Tiny"
        status="Basic"
        disabled={isExporting || !idForm}
        appearance="ghost"
        className="flex-between"
        onClick={getData}
      >
        <EvaIcon name="download-outline" className="mr-1" />
        <FormattedMessage id="download" />
      </Button>
      <SpinnerFull isLoading={isExporting} />
    </Row>
  </>)
}
