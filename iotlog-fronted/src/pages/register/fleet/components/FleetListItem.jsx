import React from "react";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import ContextMenu from "@paljs/ui/ContextMenu";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  ColCenter,
  IconRounded,
  ItemRow,
  TextSpan,
} from "../../../../components";

const FleetListItem = ({ item }) => {
  const intl = useIntl();

  return (
    <ItemRow color={item?.color} style={{ flexWrap: "wrap" }}>
      <ColCenter breakPoint={{ md: 1, xs: 2 }}>
        <div className="flex-row-center">
          <IconRounded color={item?.color}>
            <EvaIcon
              name={"navigation-outline"}
              options={{
                fill: "#fff",
                width: 25,
                height: 25,
                animation: { type: "pulse", infinite: false, hover: true },
              }}
            />
          </IconRounded>
        </div>
      </ColCenter>
      <ColCenter breakPoint={{ md: 10, xs: 8 }} className="center-mobile">
        <TextSpan apparence="s1">{item.description}</TextSpan>
      </ColCenter>
      <ColCenter breakPoint={{ md: 1, xs: 2 }} className="mt-2 mb-2 col-center-middle">
        <ContextMenu
          className="inline-block mr-1 text-start"
          placement="left"
          items={[
            {
              icon: "edit-2-outline",
              title: intl.formatMessage({ id: "edit" }),
              link: { to: `/fleet-add?id=${item.id}` },
            },
          ]}
          Link={Link}
        >
          <Button size="Tiny" status="Basic">
            <EvaIcon name="more-vertical" />
          </Button>
        </ContextMenu>
      </ColCenter>
    </ItemRow>
  );
};

export default FleetListItem;
