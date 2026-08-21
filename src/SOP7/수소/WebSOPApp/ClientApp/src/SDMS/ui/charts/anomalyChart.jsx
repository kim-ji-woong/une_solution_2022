import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

/**
 * 실제값 : 각 분의 details의 마지막값 point_value_original
 * 학습값 : 각 분의 details의 마지막값 point_value_reconstruct
 * 오차   : 각 분의 details의 마지막값 error_abs_value (없으면 |첫 실제 - 마지막 학습|)
 * x축    : base_read_data_time
 * 임계치 : reconstruction_error_threshold (첫 값 우선, 가드 포함)
 * y축    : 0, 0.5, 1.0, 10, 20, 30, 40 동일간격 스케일 (0..6 고정)
 * 막대   : 0에서 시작해 위로(왼쪽 y축 공유), 두께는 포인트 간격의 80%
 * 
 * 이상탐지 상세정보 : 각 분이 가지고 있는 details 10개 데이터
 * 비교 구간 : 클릭한 분 기준 1분전, 2분전, 3분전 데이터가 가지고 있는 details의 오차값
 */


export default function AnomalyChart({ anomalyDatas, onRangeSelect }) {
    const chartRef = useRef(null);
    const [selectedRange, setSelectedRange] = useState("24h");

    const xTimesRef = useRef([]);
    const barWRef = useRef(5000);
    const programmaticRef = useRef(false); // 내부 리레이아웃 구분
    const hoverStartRef = useRef(null);    // 마지막 호버 x(ms)

    const detectionsRef = useRef([]);
    const latestTimeRef = useRef(null);

    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;

        setSelectedRange("24h");

        // === Font ===
        const FONT_ID = "spoqa-font-link";
        if (!document.getElementById(FONT_ID)) {
            const link = document.createElement("link");
            link.id = FONT_ID;
            link.rel = "stylesheet";
            link.href = "//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css";
            document.head.appendChild(link);
        }

        // ===== Palette =====
        const C = {
            bg: "#131313",
            axis: "#FFFFFF",
            actual: "#0085FF",
            pred: "#00FFE0",
            errFill: "rgba(200,200,200,0.25)",
            errBorder: "rgba(180,180,180,0.40)",
            thrLine: "rgba(255, 86, 82, 0.95)"
        };

        // ===== 입력 데이터 파싱 (props.anomalyDatas 우선) =====
        const src = anomalyDatas || {};
        let rows = [];

        if (Array.isArray(src)) {
            rows = src;
        } else if (src && Array.isArray(src.anomalyDetections)) {
            rows = src.anomalyDetections.flatMap(d => d?.details || []);
        } else if (src?.details) {
            rows = src.details;
        } else {
            rows = [];
        }

        // ===== 데이터 생성 =====
        const detections = Array.isArray(src?.anomalyDetections)
            ? src.anomalyDetections
            : [];
        
        detectionsRef.current = detections;

        // 시간순 정렬 (base_read_data_time 기준)
        const finalRows = detections
            .slice()
            .sort((a, b) =>
                new Date(a.base_read_data_time).getTime() -
                new Date(b.base_read_data_time).getTime()
            )
            .map(det => {
                const details = det.details || [];
                if (!details.length) return null;

                const first = details[0];
                const last = details[details.length - 1];

                return {
                read_data_time: det.base_read_data_time, // x축
                point_value_original: last.point_value_original,
                point_value_reconstruct: last.point_value_reconstruct,
                error_abs_value:
                    last.error_abs_value ??
                    Math.abs(
                    (first.point_value_original ?? 0) -
                    (last.point_value_reconstruct ?? 0)
                    )
                };
            })
            .filter(Boolean);

        if (finalRows.length) {
            latestTimeRef.current =
                new Date(finalRows[finalRows.length - 1].read_data_time).getTime();
        }

        // ===== 시계열 / 기본 범위 =====
        let xTimes = finalRows.map(r => new Date(r.read_data_time));
        if (xTimes.length === 0) {
            // 데이터가 없을 경우 빈 차트 보여주기 
            const now = new Date();
            const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            xTimes = [hourAgo, now];
        }
        const xStart = new Date(xTimes[0]); xStart.setSeconds(0, 0);
        const xEnd = new Date(xTimes[xTimes.length - 1]); xEnd.setSeconds(0, 0);

        xTimesRef.current = finalRows.length ? finalRows.map(r => new Date(r.read_data_time)) : [];

        const actual = finalRows.map(r => r.point_value_original);
        const pred = finalRows.map(r => r.point_value_reconstruct);
        const absErr = finalRows.map(r =>
            r.error_abs_value ?? Math.abs((r.point_value_original ?? 0) - (r.point_value_reconstruct ?? 0))
        );

        let globalThr = detections[0]?.reconstruction_error_threshold ?? 0;
        const y2Title = `${i18n.t('sdms.detect.오차값')} (${i18n.t('sdms.detect.임계치')} : ${globalThr})`;

        // 메인y축은 실제값/학습값 원본 스케일 사용, 보조y2축은 오차값 사용
        const thrY = globalThr; // 임계치
        const yActual = actual;
        const yPred = pred;
        
        const MIN_H = 0.02;
        const errHeight = absErr.map(v => (v > 0 && v < MIN_H ? MIN_H : v));

        for (let i = 0; i < errHeight.length; i++) {
            if (errHeight[i] > 0 && errHeight[i] < MIN_H) errHeight[i] = MIN_H;
        }

        // 막대 두께
        const msDiffs = xTimesRef.current.length
            ? xTimesRef.current.slice(1)
                .map((t, i) => t.getTime() - xTimesRef.current[i].getTime())
                .filter(d => d > 0)
            : [];
        const stepMs = msDiffs.length ? Math.min(...msDiffs) : 60_000;
        const barW = Math.max(5_000, Math.floor(stepMs * 0.8)); // 최소 5초
        barWRef.current = barW;

        const xMin = new Date(xStart.getTime() - barW / 2);
        const xMax = new Date(xEnd.getTime() + barW / 2);

        // 색상
        const barColors = absErr.map(v => (v >= globalThr ? "#FF3632" : C.errFill));

        // === trace 정의 ===
        const traces = [];

        if (finalRows.length) {
            traces.push(
                {
                    x: xTimesRef.current,
                    y: yActual,
                    customdata: actual,
                    name: i18n.t('sdms.detect.실제값'),
                    type: "scattergl",
                    mode: "lines",
                    line: { color: C.actual, width: 2.4 },
                    hovertemplate: "<b>%{x|%H:%M}</b><br>" + i18n.t('sdms.detect.실제값') + ": %{customdata:.3f}<extra></extra>",
                    legendgroup: "actual",
                    legendrank: 1,
                    showlegend: true,
                    yaxis: "y"
                },
                {
                    x: xTimesRef.current,
                    y: yPred,
                    customdata: pred,
                    name: i18n.t('sdms.detect.학습값'),
                    type: "scattergl",
                    mode: "lines",
                    line: { color: C.pred, width: 2.4 },
                    hovertemplate: "<b>%{x|%H:%M}</b><br>" + i18n.t('sdms.detect.학습값') + ": %{customdata:.3f}<extra></extra>",
                    legendgroup: "pred",
                    legendrank: 2,
                    showlegend: true,
                    yaxis: "y"
                },
                {
                    x: xTimesRef.current,
                    y: errHeight,
                    width: xTimesRef.current.map(() => barW),
                    customdata: absErr,
                    name: i18n.t('sdms.detect.오차값(실제-학습)'),
                    type: "bar",
                    marker: { color: barColors, line: { color: C.errBorder, width: 0.1 } },
                    opacity: 0.9,
                    hovertemplate: "<b>%{x|%H:%M}</b><br>" + i18n.t('sdms.detect.오차') + ": %{customdata:.3f}<extra></extra>",
                    legendgroup: "error",
                    legendrank: 3,
                    showlegend: true,
                    yaxis: "y2"
                },
                {
                    x: [xStart, xEnd],
                    y: [thrY, thrY],
                    type: "scatter",
                    mode: "lines",
                    name: i18n.t('sdms.detect.임계치'),
                    line: { dash: "dash", width: 1.5, color: C.thrLine },
                    showlegend: false,
                    cliponaxis: false,
                    connectgaps: true,
                    customdata: [globalThr, globalThr],
                    hovertemplate: "" + i18n.t('sdms.detect.임계치') + ":%{customdata}<extra></extra>",
                    xaxis: "x2",
                    yaxis: "y2",
                    simplify: false
                }
            );
        } else {
            // 빈 차트: 축/슬라이더만 보이도록 더미 trace 없이 렌더 (layout 범위만 지정)
        }

        const LEGEND_HEIGHT = 40;

        // Range Slider 높이를 50px로 유지
        const SLIDER_PX = 50;
        const getSliderThickness = () => {
            const h = el?.clientHeight || 400;
            return Math.min(0.5, Math.max(0.02, SLIDER_PX / h));
        };
        const sliderThickness = getSliderThickness();

        // 보조y축 동적 범위
        const maxErr = errHeight.length ? Math.max(...errHeight, 0) : 0;
        const y2MaxData = Math.max(thrY, maxErr);
        const headroom = 1.05;
        const targetTop = y2MaxData * headroom || 0.6;
        const chooseStep = (top) => {
            const steps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
            const desired = 7;
            const rough = top / desired;
            for (const s of steps) if (rough <= s) return s;
            return 10;
        };
        const step = chooseStep(targetTop);
        const y2Top = Math.ceil(targetTop / step) * step;
        const EPS = y2Top * 0.001;
        const rawTickVals = Array.from(
            { length: Math.floor(y2Top / step) },
            (_, i) => +(((i + 1) * step).toFixed(12))
        );
        // 최대 라벨 개수 제한 (겹침 방지)
        const MAX_TICKS = 7;
        const labelEvery = Math.max(1, Math.ceil(rawTickVals.length / MAX_TICKS));
        const tickVals = rawTickVals.filter((_, i) => i % labelEvery === 0);
        const tickTexts = tickVals.map(v =>
            `<span style='color:${v <= thrY ? "#FF3632" : "#939393"}'>${v}</span>`
        );

        // === Hover 구간 하이라이트 shape (초기 비표시) ===
        const HOVER_INTERVAL_MS = 10 * 60 * 1000; // 10분
        const hoverRectShape = {
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: xMin,      // 초기 값 (임의)
            x1: xMin,      // 초기 값 (임의)
            y0: 0,
            y1: 1,
            line: { color: "rgba(0, 133, 255, 0.50)", width: 1 },
            fillcolor: "rgba(0, 133, 255, 0.15)",
            layer: "above",
            visible: false
        };

        // ===== Layout =====
        const layout = {
            paper_bgcolor: C.bg,
            plot_bgcolor: C.bg,
            font: {
                family: "'Spoqa Han Sans Neo', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                color: C.axis,
                size: 12
            },
            hovermode: "x",
            spikedistance: 10,
            hoverdistance: 10,
            autosize: true,
            dragmode: "pan", // 드래그-줌 막고 클릭-줌만 사용

            xaxis: {
                type: "date",
                color: C.axis,
                gridcolor: "rgba(255,255,255,0.15)",
                tickfont: { color: "#939393" },
                tickformat: "%H:%M",
                hoverformat: "%H:%M",
                range: [xMin, xMax],
                rangeslider: {
                    visible: true,
                    bgcolor: C.bg,
                    thickness: sliderThickness
                },
                automargin: true
            },
            xaxis2: {
                overlaying: "x",
                matches: "x",
                showgrid: false,
                showticklabels: false,
                zeroline: false,
                rangeslider: { visible: false }
            },
            yaxis: {
                title: {
                    text: i18n.t('sdms.detect.값 (실제/학습)'),
                    standoff: 8,
                    font: { size: 12, color: "#939393", family: "'Spoqa Han Sans Neo', sans-serif" }
                },
                color: C.axis,
                gridcolor: "rgba(255,255,255,0.15)",
                tickfont: { color: "#939393" },
                zerolinecolor: "rgba(255,255,255,0.15)",
                automargin: true
            },
            yaxis2: {
                title: {
                    text: y2Title,
                    standoff: 8,
                    font: { size: 12, color: "#939393", family: "'Spoqa Han Sans Neo', sans-serif" }
                },
                color: C.axis,
                overlaying: "y",
                side: "right",
                gridcolor: "rgba(255,255,255,0.10)",
                griddash: "dot",
                zerolinecolor: "rgba(255,255,255,0.10)",
                rangemode: "tozero",
                automargin: false,
                tickvals: tickVals,
                ticktext: tickTexts,
                tickmode: "array",
                range: [0, y2Top + EPS],
                autorange: false
            },

            shapes: [hoverRectShape],
            annotations: [],

            legend: {
                orientation: "h",
                x: 0,
                y: 1.2,
                xanchor: "left",
                yanchor: "bottom",
                bgcolor: "#131313",
                bordercolor: "#464B4E",
                borderwidth: 1,
                font: { size: 12, color: "#FFFFFF" },
                itemclick: "toggle",
                itemdoubleclick: "toggleothers",
                traceorder: "normal",
                itemwidth: 2
            },

            margin: { l: 56, r: 56, t: 26 + LEGEND_HEIGHT, b: 24, pad: 0 },
            barmode: "overlay",
            bargap: 0,
            uirevision: "keep-y-locked",
            hoverlabel: {
                bgcolor: "#565B69",
                bordercolor: "#565B69",
                font: { color: "#fff" }
            }
        };

        // ===== Render =====
        Plotly.newPlot(
            el,
            traces,
            layout,
            {
                responsive: true,
                scrollZoom: true,
                displaylogo: false,
                displayModeBar: false
            }
        );

        // 커서 모양 변경
        const setPlotCursor = (cur) => {
            if (!el) return;
            el.style.cursor = cur;                         // 컨테이너
            const dragRect = el.querySelector(".nsewdrag");
            if (dragRect) dragRect.style.cursor = cur;    // 드래그 레이어(최상위)
        };

        // 호버 시 pointer, 벗어나면 원복
        if (typeof el.on === "function") {
            el.on("plotly_hover", () => setPlotCursor("pointer"));
            el.on("plotly_unhover", () => setPlotCursor("auto"));
            // 레이아웃 변화(줌/팬 등) 시에도 기본으로 되돌려두기
            el.on("plotly_relayout", () => setPlotCursor("auto"));
        }
        // 차트 밖으로 마우스 나가면 원복
        el.addEventListener("mouseleave", () => setPlotCursor("auto"));

        // === y축 범위 고정: 범례 토글해도 스케일 안 바뀌게 ===
        const lockYRanges = () => {
            const fl = el?._fullLayout;
            if (!fl) return;
            const r1 = fl.yaxis?.range ? [...fl.yaxis.range] : null;
            const r2 = fl.yaxis2?.range ? [...fl.yaxis2.range] : null;

            const update = {};
            if (r1) { update["yaxis.autorange"] = false; update["yaxis.range"] = r1; }
            if (r2) { update["yaxis2.autorange"] = false; update["yaxis2.range"] = r2; }

            if (Object.keys(update).length) {
                Plotly.relayout(el, update);
            }
        };
        lockYRanges();

        // === Hover 구간 네모박스 갱신 ===
        const showHoverBox = (endMs) => {
            const startMs = endMs - HOVER_INTERVAL_MS;
            Plotly.relayout(el, {
                "shapes[0].x0": new Date(startMs),
                "shapes[0].x1": new Date(endMs),
                "shapes[0].visible": true
            });
        };

        const hideHoverBox = () => {
            Plotly.relayout(el, { "shapes[0].visible": false });
        };

        if (typeof el.on === "function") {
            // 사용자 조작으로 x축 범위가 바뀌면 라디오를 "시간선택"으로 세팅
            el.on("plotly_relayout", (ev) => {
                if (programmaticRef.current) {
                    programmaticRef.current = false;
                    return;
                }
                const keys = ev ? Object.keys(ev) : [];
                const touched = keys.some(k => k.startsWith("xaxis.range"));
                if (touched) setSelectedRange("custom");
            });

            // 호버한 위치 기준 10분 박스 표시/숨김
            // el.on("plotly_hover", (ev) => {
            //     try {
            //         const pt = ev?.points?.[0];
            //         if (!pt || !pt.x) return;
            //         const x0Ms = new Date(pt.x).getTime();
            //         hoverStartRef.current = x0Ms;
            //         showHoverBox(x0Ms);
            //     } catch (_) {}
            // });

            // 호버 박스를 클릭하면 10분 구간으로 확대
            el.on("plotly_click", () => {
                const endMs = hoverStartRef.current;
                const startMs = endMs - HOVER_INTERVAL_MS;

                programmaticRef.current = true;
                Plotly.relayout(el, {
                    "xaxis.range": [new Date(startMs), new Date(endMs)]
                }).then(() => {
                    // 라디오 버튼은 "시간선택"으로
                    setSelectedRange("custom");
                    // 확대 후 박스는 숨김
                    Plotly.relayout(el, { "shapes[0].visible": false });
                }).catch(() => {});
            });

            // 호버할 때 해당 시점(ms)을 기억
            if (typeof el.on === "function") {
                el.on("plotly_hover", (ev) => {
                    try {
                        const pt = ev?.points?.[0];
                        if (!pt || !pt.x) return;
                        const x0Ms = new Date(pt.x).getTime();
                        hoverStartRef.current = x0Ms; // 클릭 확대/콜백용 시작 시간
                    } catch (_) {}
                });
            }

            // 클릭하면 10분 구간으로 확대 + onRangeSelect 콜백 호출
            if (typeof el.on === "function") {
                el.on("plotly_click", (ev) => {
                    try {
                        const pt = ev?.points?.[0];
                        if (!pt?.x) return;

                        const clickMs = new Date(pt.x).getTime();

                        const detections = detectionsRef.current;

                        // base_read_data_time 기준으로 가장 가까운 detection 찾기
                        const idx = detections.findIndex(d =>
                            new Date(d.base_read_data_time).getTime() === clickMs
                        );

                        if (idx === -1) return;

                        const current = detections[idx];
                        const end = new Date(current.base_read_data_time);
                        const start = new Date(end.getTime() - 10 * 60 * 1000);

                        // 이전 3개 anomalyDetection
                        const prev = [
                            detections[idx - 1],
                            detections[idx - 2],
                            detections[idx - 3]
                        ].map((d, i) =>
                            d
                                ? {
                                    title:
                                    i === 0 ? i18n.t('sdms.detect.직전 1분')
                                    : i === 1 ? i18n.t('sdms.detect.직전 2분')
                                    : i18n.t('sdms.detect.직전 3분'),
                                    start: new Date(d.base_read_data_time),
                                    end: new Date(new Date(d.base_read_data_time).getTime() + 10 * 60 * 1000),
                                    details: d.details || []
                                }
                                : null
                        ).filter(Boolean);

                        // 콜백
                        onRangeSelect({
                            start,
                            end,
                            threshold: current.reconstruction_error_threshold,
                            details: current.details || [],
                            prevDetails: prev,
                            patternType: current.pattern_type
                        });

                        setSelectedRange("custom");
                    } catch (e) {
                        console.error(e);
                    }
                });
            }
            
            el.on("plotly_unhover", () => {
                hideHoverBox();
            });
        }

        // === 범례 배경 라운딩 유지 ===
        const roundLegend = () => {
            try {
                const legendBg = el.querySelector(".legend .bg");
                if (!legendBg) return;

                legendBg.setAttribute("rx", "4");
                legendBg.setAttribute("ry", "4");

                if (!legendBg.getAttribute("data-orig-x")) {
                    legendBg.setAttribute("data-orig-x", legendBg.getAttribute("x") || "0");
                    legendBg.setAttribute("data-orig-y", legendBg.getAttribute("y") || "0");
                    legendBg.setAttribute("data-orig-w", legendBg.getAttribute("width") || "0");
                    legendBg.setAttribute("data-orig-h", legendBg.getAttribute("height") || "0");
                }

                const ox = parseFloat(legendBg.getAttribute("data-orig-x") || "0");
                const oy = parseFloat(legendBg.getAttribute("data-orig-y") || "0");
                const ow = parseFloat(legendBg.getAttribute("data-orig-w") || "0");
                const oh = parseFloat(legendBg.getAttribute("data-orig-h") || "0");

                const P = 4; // 범례 내부 padding

                legendBg.setAttribute("x", String(ox - P));
                legendBg.setAttribute("y", String(oy - P));
                legendBg.setAttribute("width", String(ow + P * 2));
                legendBg.setAttribute("height", String(oh + P * 2));

                const legendGroup = el.querySelector(".legend");
                if (legendGroup) legendGroup.style.filter = "none";
            } catch (_) {}
        };

        roundLegend();
        if (typeof el.on === "function") {
            el.on("plotly_afterplot", roundLegend);
            el.on("plotly_relayout", roundLegend);
            el.on("plotly_restyle", roundLegend);
        }

        // ----- 임계치 라인/라벨(라인만) 동기화 -----
        const findThrIndex = () => {
            const dataArr = el.data || [];
            for (let i = dataArr.length - 1; i >= 0; i--) {
                if (dataArr[i].name === "임계치") return i;
            }
            return dataArr.length - 1;
        };

        const updateThresholdSpan = () => {
            if (!finalRows.length) return;
            const xr = el.layout?.xaxis?.range || el._fullLayout?.xaxis?.range || [xStart, xEnd];
            const x0 = new Date(xr[0]);
            const x1 = new Date(xr[1]);
            const idx = findThrIndex();
            Plotly.restyle(el, { x: [[x0, x1]], y: [[thrY, thrY]] }, idx);
        };
        updateThresholdSpan();

        // 윈도우 리사이즈 대응
        const handleResize = () => {
            Plotly.Plots.resize(el);
            roundLegend();
            Plotly.relayout(el, { "xaxis.rangeslider.thickness": getSliderThickness() });
        };
        window.addEventListener("resize", handleResize);

        // rangeslider 위에서만 휠 줌
        const wheelHandler = (evt) => {
            const slider = el.querySelector(".rangeslider-container");
            if (!slider || !slider.contains(evt.target)) return;
            evt.preventDefault();
            const xr = el.layout.xaxis.range || el._fullLayout.xaxis.range;
            const x0 = new Date(xr[0]).getTime();
            const x1 = new Date(xr[1]).getTime();
            const w = x1 - x0;
            const factor = Math.exp(-evt.deltaY * 0.0015);
            const mid = (x0 + x1) / 2;
            const half = w / 2 / factor;
            Plotly.relayout(el, { "xaxis.range": [new Date(mid - half), new Date(mid + half)] });
        };
        el.addEventListener("wheel", wheelHandler, { passive: false });

        return () => {
            window.removeEventListener("resize", handleResize);
            try {
                el.removeEventListener("wheel", wheelHandler);
                if (typeof el.removeAllListeners === "function") {
                    el.removeAllListeners();
                }
                Plotly.purge(el);
            } catch (_) {}
        };
    }, [anomalyDatas]); // props 변경 시 재렌더

    // === 범위 변경 함수 ===
    const changeRange = (range) => {
        const el = chartRef.current;
        if (!el || !latestTimeRef.current) return;

        programmaticRef.current = true;

        const xMax = latestTimeRef.current;
        const xs = xTimesRef.current;
        const bw = barWRef.current;

        const earliest = xs.length
            ? xs[0].getTime() - bw / 2
            : xMax;

        const hourToMs = (h) => h * 60 * 60 * 1000;

        const hoursMap = {
            "1h": 1,
            "3h": 3,
            "6h": 6,
            "12h": 12,
            "24h": 24
        };

        const hours = hoursMap[range] ?? 24;

        const proposedMin = xMax - hourToMs(hours);
        const clampedMin = Math.max(proposedMin, earliest);

        Plotly.relayout(el, {
            "xaxis.range": [
                new Date(clampedMin),
                new Date(xMax + bw / 2)
            ]
        });

        setSelectedRange(range);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            {/* 오른쪽 상단 라디오 버튼 UI */}
            <div className='time'>
                {["custom", "1h", "3h", "6h", "12h", "24h"].map((label) => (
                    <label key={label} style={{ color: "#FFFFFF", cursor: "pointer", fontSize: '12px' }}>
                        <input
                            type="radio"
                            name="timeRange"
                            value={label}
                            checked={selectedRange === label}
                            onChange={() => {
                                if (label === "custom") {
                                    setSelectedRange("custom");
                                } else {
                                    changeRange(label);
                                }
                            }}
                            style={{ marginRight: "4px" }}
                        />
                        {label === "custom" ? i18n.t('sdms.detect.시간선택') : label}
                    </label>
                ))}
            </div>

            {/* 차트 */}
            <div ref={chartRef} style={{ flex: 1, width: "100%", height: "100%" }} />
        </div>
    );
}