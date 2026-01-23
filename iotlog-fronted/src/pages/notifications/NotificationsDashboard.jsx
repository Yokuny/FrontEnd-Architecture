import {
  Card,
  CardHeader,
  Col,
  Row,
  Tabs,
  Tab,
  Button,
  CardFooter,
  EvaIcon,
} from "@paljs/ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  TextSpan,
  Fetch,
} from "../../components";
import AlertsTab from "./components/AlertsTab";
import DateFilter from "./components/DateFilter";
import DataCard from "./components/DataCard";

const NotificationsDashboard = (props) => {

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  const onViewAll = () => {
    setIsLoading(true);
    Fetch.put("/notification/view/all")
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        window.location.reload();
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12 }}>
          <Card>
            <CardHeader>
              <Row className="m-0">
                <TextSpan apparence="title">
                  <FormattedMessage id="notifications.dashboard" />
                </TextSpan>
              </Row>
              <Row>
                <Col breakPoint={{ xs: 12 }}>
                  <DateFilter />
                </Col>
              </Row>
            </CardHeader>

            <Tabs activeIndex={activeTab}
              fullWidth
              onSelect={index => setActiveTab(index)}>
              <Tab
                icon="pie-chart-outline"
                title={intl.formatMessage({ id: 'notifications.tab.dashboard' })}>
                <DataCard />
              </Tab>
              <Tab
                icon="bell-outline"
                title={intl.formatMessage({ id: 'notifications.tab.alerts' })}>
                <Card
                  className="mt-3"
                  style={{
                    minHeight: 380,
                    height: '100%',
                  }}>
                  <AlertsTab />
                </Card>
              </Tab>
            </Tabs>
            <CardFooter>
              <Button
                size="Tiny"
                status="Basic"
                appearance="ghost"
                className="flex-between"
                onClick={onViewAll}
                disabled={isLoading}
              >
                <EvaIcon name="eye-outline" className="mr-1" />
                <FormattedMessage id="view.all" />
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default NotificationsDashboard;
