import { Box, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, formatDurationRounded } from "../../../Utils/timeUtils";
import { getLastChecked } from "../../../Utils/monitorUtils";
import axiosInstance from "../../../Utils/axiosConfig";
import Button from "../../../Components/Button";
import WestRoundedIcon from "@mui/icons-material/WestRounded";
import SettingsIcon from "../../../assets/icons/settings-bold.svg?react";
import LastCheckedIcon from "../../../assets/icons/calendar-check.svg?react";
import ClockIcon from "../../../assets/icons/maintenance.svg?react";
import IntervalCheckIcon from "../../../assets/icons/interval-check.svg?react";
import GreenCheck from "../../../assets/icons/checkbox-green.svg?react";
import RedCheck from "../../../assets/icons/checkbox-red.svg?react";

import "./index.css";
import PageSpeedLineChart from "../../../Components/Charts/PagespeedLineChart";

/**
 * Displays a box with an icon, title, and value.
 *
 * @param {Object} props
 * @param {ReactNode} props.icon - The icon to display in the box.
 * @param {string} props.title - The title text to display above the value.
 * @param {string | number} props.value - The value text to display in the box.
 * @returns {JSX.Element}
 */
const StatBox = ({ icon, title, value }) => {
  const theme = useTheme();

  return (
    <Stack
      className="stat-box"
      direction="row"
      gap={theme.gap.small}
      p={theme.gap.ml}
      pb={theme.gap.mlplus}
    >
      {icon}
      <Box>
        <Typography variant="h6" mb={theme.gap.medium}>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
    </Stack>
  );
};

/**
 * Renders a centered label within a pie chart.
 *
 * @param {Object} props
 * @param {string | number} props.value - The value to display in the label.
 * @param {string} props.color - The color of the text.
 * @returns {JSX.Element}
 */
const PieCenterLabel = ({ value, color, setExpand }) => {
  const { width, height } = useDrawingArea();
  return (
    <g
      transform={`translate(${width / 2}, ${height / 2})`}
      onMouseEnter={() => setExpand(true)}
    >
      <circle cx={0} cy={0} r={width / 3} fill="transparent" />
      <text
        className="pie-label"
        style={{
          fill: color,
          fontSize: "45px",
          textAnchor: "middle",
          dominantBaseline: "central",
          userSelect: "none",
        }}
      >
        {value}
      </text>
    </g>
  );
};

/**
 * A component that renders a label on a pie chart slice.
 * The label is positioned relative to the center of the pie chart and is optionally highlighted.
 *
 * @param {Object} props
 * @param {number} props.value - The value to display inside the pie slice.
 * @param {number} props.startAngle - The starting angle of the pie slice in degrees.
 * @param {number} props.endAngle - The ending angle of the pie slice in degrees.
 * @param {string} props.color - The color of the label text when highlighted.
 * @param {boolean} props.highlighted - Determines if the label should be highlighted or not.
 * @returns {JSX.Element}
 */
const PieValueLabel = ({ value, startAngle, endAngle, color, highlighted }) => {
  const { width, height } = useDrawingArea();

  // Compute the midpoint angle in radians
  const angle = (((startAngle + endAngle) / 2) * Math.PI) / 180;
  const radius = height / 3.5; // length from center of the circle to where the text is positioned

  // Calculate x and y positions
  const x = Math.sin(angle) * radius;
  const y = -Math.cos(angle) * radius;

  return (
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      <text
        className="pie-value-label"
        x={x}
        y={y}
        style={{
          fill: highlighted ? color : "rgba(0,0,0,0)",
          fontSize: "12px",
          textAnchor: "middle",
          dominantBaseline: "central",
          userSelect: "none",
        }}
      >
        +{value}
      </text>
    </g>
  );
};

const PageSpeedDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState({});
  const { monitorId } = useParams();
  const { authToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMonitor = async () => {
      const res = await axiosInstance.get(
        `/monitors/${monitorId}?sortOrder=desc`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(monitor);
      setMonitor(res.data.data);
    };

    fetchMonitor();
  }, [monitorId]);

  const data = {
    _id: "66ad34001d483d284550e8cb",
    monitorId: "66ad2f5b4dfcd19cdbfc7205",
    status: true,
    accessibility: 100,
    bestPractices: 79,
    seo: 100,
    performance: 100,
    audits: {
      cls: {
        id: "cumulative-layout-shift",
        title: "Cumulative Layout Shift",
        description:
          "Cumulative Layout Shift measures the movement of visible elements within the viewport.",
        score: 0.1,
        scoreDisplayMode: "numeric",
        displayValue: "0",
        numericValue: 0,
        numericUnit: "unitless",
        _id: "66ad34001d483d284550e8cd",
      },
      si: {
        id: "speed-index",
        title: "Speed Index",
        description:
          "Speed Index shows how quickly the contents of a page are visibly populated.",
        score: 0.9,
        scoreDisplayMode: "numeric",
        displayValue: "0.6s",
        numericValue: 567.8934352052013,
        numericUnit: "millisecond",
        _id: "66ad34001d483d284550e8ce",
      },
      fcp: {
        id: "first-contentful-paint",
        title: "First Contentful Paint",
        description:
          "First Contentful Paint marks the time at which the first text or image is painted.",
        score: 0.8,
        scoreDisplayMode: "numeric",
        displayValue: "0.4s",
        numericValue: 419,
        numericUnit: "millisecond",
        _id: "66ad34001d483d284550e8cf",
      },
      lcp: {
        id: "largest-contentful-paint",
        title: "Largest Contentful Paint",
        description:
          "Largest Contentful Paint marks the time at which the largest text or image is painted.",
        score: 0.6,
        scoreDisplayMode: "numeric",
        displayValue: "0.4s",
        numericValue: 422.5,
        numericUnit: "millisecond",
        _id: "66ad34001d483d284550e8d0",
      },
      tbt: {
        id: "total-blocking-time",
        title: "Total Blocking Time",
        description:
          "Sum of all time periods between FCP and Time to Interactive",
        score: 0.9,
        scoreDisplayMode: "numeric",
        displayValue: "20ms",
        numericValue: 16,
        numericUnit: "millisecond",
        _id: "66ad34001d483d284550e8d1",
      },
      _id: "66ad34001d483d284550e8cc",
    },
    createdAt: "2024-08-02T19:31:12.732Z",
    updatedAt: "2024-08-02T19:31:12.732Z",
    __v: 0,
  };

  /**
   * Weight constants for different performance metrics.
   * @type {Object}
   */
  const weights = {
    fcp: 10,
    si: 10,
    lcp: 25,
    tbt: 30,
    cls: 25,
  };

  /**
   * Retrieves color properties based on the performance value.
   *
   * @param {number} value - The performance score used to determine the color properties.
   * @returns {{stroke: string, text: string, bg: string}} The color properties for the given performance value.
   */
  const getColors = (value) => {
    if (value >= 90 && value <= 100) return theme.pie.green;
    else if (value >= 50 && value < 90) return theme.pie.yellow;
    else if (value >= 0 && value < 50) return theme.pie.red;
    return theme.pie.default;
  };

  /**
   * Calculates and formats the data needed for rendering a pie chart based on audit scores and weights.
   * This function generates properties for each pie slice, including angles, radii, and colors.
   * It also calculates performance based on the weighted values.
   *
   * @returns {Array<Object>} An array of objects, each representing the properties for a slice of the pie chart.
   * @returns {number} performance - A variable updated with the rounded sum of weighted values.
   */
  let performance = 0;
  const getPieData = (audits) => {
    let props = [];
    let startAngle = 0;
    const padding = 3; // padding between arcs
    const max = 360 - padding * (Object.keys(audits).length - 1); // _id is a child of audits

    Object.keys(audits).forEach((key) => {
      if (audits[key].score) {
        let value = audits[key].score * weights[key];
        let endAngle = startAngle + (weights[key] * max) / 100;

        let theme = getColors(audits[key].score * 100);
        props.push({
          id: key,
          data: [
            {
              value: value,
              color: theme.stroke,
              label: key.toUpperCase(),
            },
            {
              value: weights[key] - value,
              color: theme.strokeBg,
              label: "",
            },
          ],
          arcLabel: (item) => `${item.label}`,
          arcLabelRadius: 95,
          startAngle: startAngle,
          endAngle: endAngle,
          innerRadius: 73,
          outerRadius: 80,
          cornerRadius: 2,
          highlightScope: { faded: "global", highlighted: "series" },
          faded: {
            innerRadius: 63,
            outerRadius: 70,
            additionalRadius: -20,
            arcLabelRadius: 5,
          },
          cx: pieSize.width / 2,
        });

        performance += Math.round(value);
        startAngle = endAngle + padding;
      }
    });

    return props;
  };

  const pieSize = { width: 200, height: 200 };
  const pieData = getPieData(data.audits);
  const colorMap = getColors(performance);

  const [highlightedItem, setHighLightedItem] = useState(null);
  const [expand, setExpand] = useState(false);

  return (
    <Stack className="page-speed-details" gap={theme.gap.large}>
      <Button
        level="tertiary"
        label="Back"
        animate="slideLeft"
        img={<WestRoundedIcon />}
        onClick={() => navigate("/pagespeed")}
        sx={{
          width: "fit-content",
          backgroundColor: theme.palette.otherColors.fillGray,
          px: theme.gap.ml,
          "& svg.MuiSvgIcon-root": {
            mr: theme.gap.small,
            fill: theme.palette.otherColors.slateGray,
          },
        }}
      />
      <Stack
        direction="row"
        gap={theme.gap.small}
        justifyContent="space-between"
      >
        <GreenCheck />
        <Box>
          <Typography component="h1" mb={theme.gap.xs} sx={{ lineHeight: 1 }}>
            {monitor?.url}
          </Typography>
          <Typography
            component="span"
            sx={{ color: "var(--env-var-color-17)" }}
          >
            Your pagespeed monitor is live.
          </Typography>
        </Box>
        <Button
          level="tertiary"
          label="Configure"
          animate="rotate90"
          img={
            <SettingsIcon
              style={{ width: theme.gap.mlplus, height: theme.gap.mlplus }}
            />
          }
          onClick={() => navigate(`/pagespeed/configure/${monitorId}`)}
          sx={{
            ml: "auto",
            alignSelf: "flex-end",
            backgroundColor: theme.palette.otherColors.fillGray,
            px: theme.gap.medium,
            "& svg": {
              mr: "6px",
            },
          }}
        />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        gap={theme.gap.xl}
        flexWrap="wrap"
      >
        <StatBox
          icon={<LastCheckedIcon />}
          title="Last checked"
          value={
            <>
              {formatDate(getLastChecked(monitor?.checks, false))}{" "}
              <Typography
                component="span"
                fontStyle="italic"
                sx={{ opacity: 0.8 }}
              >
                ({formatDurationRounded(getLastChecked(monitor?.checks))} ago)
              </Typography>
            </>
          }
        />
        <StatBox
          icon={<ClockIcon />}
          title="Checks since"
          value={
            <>
              {formatDate(new Date(monitor?.createdAt))}{" "}
              <Typography
                component="span"
                fontStyle="italic"
                sx={{ opacity: 0.8 }}
              >
                (
                {formatDurationRounded(
                  new Date() - new Date(monitor?.createdAt)
                )}{" "}
                ago)
              </Typography>
            </>
          }
        ></StatBox>
        <StatBox
          icon={<IntervalCheckIcon />}
          title="Checks every"
          value={formatDurationRounded(monitor?.interval)}
        ></StatBox>
      </Stack>
      <Typography component="h2">Score history</Typography>
      <Box height="300px">
        <PageSpeedLineChart pageSpeedChecks={monitor?.checks?.slice(0, 25)} />
      </Box>
      <Typography component="h2">Performance report</Typography>
      <Stack direction="row" alignItems="center" overflow="hidden">
        <Stack
          alignItems="center"
          textAlign="center"
          minWidth="300px"
          flex={1}
          px={theme.gap.xl}
          py={theme.gap.ml}
        >
          <Box onMouseLeave={() => setExpand(false)}>
            {expand ? (
              <PieChart
                series={[
                  {
                    data: [
                      {
                        value: 100,
                        color: colorMap.bg,
                      },
                    ],
                    outerRadius: 67,
                    cx: pieSize.width / 2,
                  },
                  ...pieData,
                ]}
                width={pieSize.width}
                height={pieSize.height}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                onHighlightChange={setHighLightedItem}
                slotProps={{
                  legend: { hidden: true },
                }}
                tooltip={{ trigger: "none" }}
                sx={{
                  "&:has(.MuiPieArcLabel-faded) .pie-label": {
                    fill: "rgba(0,0,0,0) !important",
                  },
                }}
              >
                <PieCenterLabel
                  value={performance}
                  color={colorMap.text}
                  setExpand={setExpand}
                />
                {pieData?.map((pie) => (
                  <PieValueLabel
                    key={pie.id}
                    value={pie.data[0].value}
                    startAngle={pie.startAngle}
                    endAngle={pie.endAngle}
                    color={pie.data[0].color}
                    highlighted={highlightedItem?.seriesId === pie.id}
                  />
                ))}
              </PieChart>
            ) : (
              <PieChart
                series={[
                  {
                    data: [
                      {
                        value: 100,
                        color: colorMap.bg,
                      },
                    ],
                    outerRadius: 67,
                    cx: pieSize.width / 2,
                  },
                  {
                    data: [
                      {
                        value: performance,
                        color: colorMap.stroke,
                      },
                    ],
                    innerRadius: 63,
                    outerRadius: 70,
                    paddingAngle: 5,
                    cornerRadius: 2,
                    startAngle: 0,
                    endAngle: (performance / 100) * 360,
                    cx: pieSize.width / 2,
                  },
                ]}
                width={pieSize.width}
                height={pieSize.height}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                tooltip={{ trigger: "none" }}
              >
                <PieCenterLabel
                  value={performance}
                  color={colorMap.text}
                  setExpand={setExpand}
                />
              </PieChart>
            )}
          </Box>
          <Typography mt={theme.gap.medium}>
            Values are estimated and may vary.{" "}
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              See calculator
            </Typography>
          </Typography>
        </Stack>
        <Box
          px={theme.gap.xl}
          py={theme.gap.ml}
          height="100%"
          flex={1}
          sx={{
            borderLeft: `solid 1px ${theme.palette.otherColors.graishWhite}`,
          }}
        >
          <Typography
            mb={theme.gap.medium}
            pb={theme.gap.ml}
            color={theme.palette.secondary.main}
            textAlign="center"
            sx={{
              borderBottom: `solid 1px ${theme.palette.otherColors.graishWhite}`,
              borderBottomStyle: "dashed",
            }}
          >
            The{" "}
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              performance score is calculated
            </Typography>{" "}
            directly from these{" "}
            <Typography component="span" fontWeight={600}>
              metrics
            </Typography>
            .
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            pt={theme.gap.ml}
            gap={theme.gap.ml}
          >
            {Object.keys(data.audits).map((key) => {
              if (key === "_id") return;

              let audit = data.audits[key];
              let metricParams = getColors(audit.score * 100);

              let shape = (
                <Box
                  sx={{
                    width: theme.gap.medium,
                    height: theme.gap.medium,
                    borderRadius: "50%",
                    backgroundColor: metricParams.stroke,
                  }}
                ></Box>
              );
              if (metricParams.shape === "square")
                shape = (
                  <Box
                    sx={{
                      width: theme.gap.medium,
                      height: theme.gap.medium,
                      backgroundColor: metricParams.stroke,
                    }}
                  ></Box>
                );
              else if (metricParams.shape === "triangle")
                shape = (
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      ml: `calc((${theme.gap.medium} - ${theme.gap.small}) / -2)`,
                      borderLeft: `${theme.gap.small} solid transparent`,
                      borderRight: `${theme.gap.small} solid transparent`,
                      borderBottom: `${theme.gap.medium} solid ${metricParams.stroke}`,
                    }}
                  ></Box>
                );

              // Find the position where the number ends and the unit begins
              const match = audit.displayValue.match(/(\d+\.?\d*)([a-zA-Z]+)/);
              let value;
              let unit;
              if (match) {
                value = match[1];
                unit = match[2];
              } else {
                value = audit.displayValue;
              }

              return (
                <Stack
                  className="metric"
                  key={`${key}-box`}
                  direction="row"
                  gap={theme.gap.small}
                >
                  {shape}
                  <Box>
                    <Typography sx={{ lineHeight: 1 }}>
                      {audit.title}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: metricParams.text,
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {value}
                      <Typography
                        component="span"
                        ml="2px"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontSize: "13px",
                        }}
                      >
                        {unit}
                      </Typography>
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default PageSpeedDetails;
