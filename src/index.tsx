import * as React from "react";
import { render } from "react-dom";
import "./styles.css";
import RiskMeter from "./risk-meter";

const rootElement = document.getElementById("root");

render(
  <div>
    <RiskMeter value={50} markerWidth={8} meterBroadness={6} />
  </div>,
  rootElement
);
