import React from 'react';
import { Line } from 'react-chartjs-2';

const hexToRgba = (hex, a) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(
        h.length === 3 ? h.split('').map((c) => c + c).join('') : h,
        16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const getYScale = (chart) =>
    chart.scales?.['y-axis-0'] ||
    chart.scales?.y ||
    Object.values(chart.scales || {}).find((s) => s.isHorizontal === false);

const LineChart = ({
    labels = ['0s', '60s', '120s', '180s'],
    sensorData,
    typeName,
    lineColor = '#0085FF',
    fill = true,
    lineTension = 0,
    height = 150,
    showLegend = false,
    unit = '',
    thresholds = null,
}) => {
    const DANGER = '#FF3632';
    const NORMAL = '#939393';

    // -------------------- 다운샘플 --------------------
    const downsampleXY = (lab, dat, maxPoints = 300) => {
        if (!Array.isArray(lab) || !Array.isArray(dat))
            return { labels: lab, data: dat };
        const n = Math.min(lab.length, dat.length);
        if (n <= maxPoints)
            return { labels: lab.slice(0, n), data: dat.slice(0, n) };
        const step = Math.ceil(n / (maxPoints - 1));
        const dsLabels = [];
        const dsData = [];
        for (let i = 0; i < n; i += step) {
            dsLabels.push(lab[i]);
            dsData.push(dat[i]);
        }
        if (dsLabels[dsLabels.length - 1] !== lab[n - 1]) {
            dsLabels.push(lab[n - 1]);
            dsData.push(dat[n - 1]);
        }
        return { labels: dsLabels, data: dsData };
    };

    const { labels: dsLabels, data: dsData } = downsampleXY(labels, sensorData, 300);
    const dense = dsLabels.length > 200;

    // -------------------- min/max/h/l 계산 --------------------
    const rawMax =
        thresholds?.max ??
        Math.max(...dsData.filter((v) => typeof v === 'number' && isFinite(v)));
    const rawMin =
        thresholds?.min ??
        Math.min(...dsData.filter((v) => typeof v === 'number' && isFinite(v)));

    const h = thresholds?.h;
    const l = thresholds?.l;

    const hasThresholds =
        thresholds &&
        [thresholds.hh, thresholds.h, thresholds.l, thresholds.ll].some(
            (v) => v !== null && v !== undefined
        );

    const topTick = Math.ceil(rawMax);
    const bottomTick = Math.floor(rawMin);

    // -------------------- 데이터셋 --------------------
    const data = (canvas) => {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, hexToRgba(lineColor, 0.18));
        gradient.addColorStop(0.5, hexToRgba(lineColor, 0.06));
        gradient.addColorStop(1, hexToRgba(lineColor, 0));

        const datasets = [
            {
                label: typeName,
                data: dsData,
                lineTension,
                borderColor: lineColor,
                backgroundColor: fill ? gradient : 'rgba(0,0,0,0)',
                borderWidth: 1,
                fill,
                pointRadius: dense ? 0 : 3,
                pointHoverRadius: dense ? 2 : 4,
                pointBackgroundColor: lineColor,
                spanGaps: true,
            },
        ];

        if (hasThresholds && h != null && l != null) {
            const dashed = (y) => ({
                data: new Array(dsLabels.length).fill(y),
                borderColor: DANGER,
                borderDash: [4, 3],
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
            });
            datasets.push(dashed(h));
            datasets.push(dashed(l));
        }

        return { labels: dsLabels, datasets };
    };

    // -------------------- 플러그인 (임계치 있을 때만 라벨 4개) --------------------
    const fourLabelPlugin = hasThresholds
        ? {
            id: 'fourLabelPlugin',
            afterBuildTicks(chart) {
                const y = getYScale(chart);
                if (!y) return;
                y.options.ticks.min = bottomTick;
                y.options.ticks.max = topTick;
                y.min = bottomTick;
                y.max = topTick;
            },
            afterDraw(chart) {
                const y = getYScale(chart);
                const ctx = chart.ctx;
                if (!y) return;

                ctx.save();
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.font = '12px Arial';
                ctx.fillStyle = DANGER;

                const entries = [
                    { v: topTick, label: `${topTick}` },
                    ...(h != null ? [{ v: h, label: `${h}(H)` }] : []),
                    ...(l != null ? [{ v: l, label: `${l}(L)` }] : []),
                    { v: bottomTick, label: `${bottomTick}` },
                ];

                const labelX = y.left - 10;

                entries.forEach(({ v, label }) => {
                    const py = y.getPixelForValue(v);
                    if (py >= y.top - 1 && py <= y.bottom + 1)
                        ctx.fillText(label, labelX, py);
                });
                ctx.restore();
            },
        }
        : null;

    // -------------------- 옵션 --------------------
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: showLegend },
        layout: hasThresholds ? { padding: { top: 6, left: 43 } } : { padding: { top: 6 } },
        tooltips: {
            enabled: true,
            mode: 'nearest',
            position: 'average',
            intersect: false,
            displayColors: false,
            callbacks: {
                title: () => [],
                label: (ti) => `${ti.label} : ${ti.yLabel}${unit}`,
            },
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        fontColor: NORMAL,
                        autoSkip: true,
                        maxTicksLimit: 10,
                        minRotation: 0, // 라벨 회전 최소 각도 (0도)
                        maxRotation: 0, // 라벨 회전 최대 각도 (0도)
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.15)',
                        borderDash: [4, 4],
                    },
                },
            ],
            yAxes: [
                hasThresholds
                    ? {
                        ticks: { display: false, min: bottomTick, max: topTick },
                        gridLines: {
                            color: 'rgba(255,255,255,0.15)',
                            borderDash: [4, 4],
                        },
                    }
                    : {
                        ticks: {
                            beginAtZero: false,
                            maxTicksLimit: 6,
                            fontColor: NORMAL,
                            padding: 8,
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.15)',
                            borderDash: [4, 4],
                        },
                    },
            ],
        },
        plugins: hasThresholds ? [fourLabelPlugin] : [],
    };

    return (
        <div style={{ width: '100%', height, marginBottom: '12px' }}>
            <Line
                data={data}
                options={options}
                plugins={hasThresholds ? [fourLabelPlugin] : []}
            />
        </div>
    );
};

export default LineChart;
