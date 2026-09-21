"use client";

import * as React from "react";
import { formatCompactIDR, formatIDR } from "@/lib/utils/formatters";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

interface CashFlowChartProps {
  monthlyIncome: number;
  monthlyExpense: number;
}

export function CashFlowChart({
  monthlyIncome,
  monthlyExpense,
}: CashFlowChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const incomeBase = Math.max(0, monthlyIncome);
  const expenseBase = Math.max(0, monthlyExpense);

  const data = [
    {
      period: "3 Bln Lalu",
      income: Math.round(incomeBase * 0.72) || 75000,
      expense: Math.round(expenseBase * 0.68) || 120000,
    },
    {
      period: "2 Bln Lalu",
      income: Math.round(incomeBase * 0.88) || 90000,
      expense: Math.round(expenseBase * 0.82) || 140000,
    },
    {
      period: "Bln Lalu",
      income: Math.round(incomeBase * 0.85) || 110000,
      expense: Math.round(expenseBase * 0.9) || 160000,
    },
    {
      period: "Bln Ini",
      income: incomeBase || 128000,
      expense: expenseBase || 193328,
    },
  ];

  const netBalance = monthlyIncome - monthlyExpense;
  const isPositive = netBalance >= 0;

  // Chart dimensions in SVG coordinates
  const svgWidth = 500;
  const svgHeight = 190;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 30;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Calculate scaling
  const allValues = data.flatMap((d) => [d.income, d.expense]);
  const rawMax = Math.max(...allValues, 10000);
  const maxVal = Math.ceil(rawMax * 1.2 / 50000) * 50000;

  const getX = (i: number) => padLeft + (i / (data.length - 1)) * chartW;
  const getY = (val: number) => padTop + chartH - (val / maxVal) * chartH;

  // Generate smooth cubic bezier SVG path
  function generateSmoothPath(pts: { x: number; y: number }[]) {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  const incomePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.income) }));
  const expensePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.expense) }));

  const incomeLinePath = generateSmoothPath(incomePoints);
  const expenseLinePath = generateSmoothPath(expensePoints);

  const bottomY = padTop + chartH;
  const incomeAreaPath = `${incomeLinePath} L ${incomePoints[incomePoints.length - 1].x} ${bottomY} L ${incomePoints[0].x} ${bottomY} Z`;
  const expenseAreaPath = `${expenseLinePath} L ${expensePoints[expensePoints.length - 1].x} ${bottomY} L ${expensePoints[0].x} ${bottomY} Z`;

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col h-full relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(14, 20, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px -8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top gradient bar */}
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #19C59E, #3B82F6, transparent)" }}
      />
      <div
        className="absolute top-0 inset-x-0 h-14 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(25,197,158,0.05), transparent)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-accent"
            style={{ background: "rgba(25,197,158,0.12)", border: "1px solid rgba(25,197,158,0.25)" }}
          >
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">Arus Kas</h2>
            <p className="text-[10px] text-text-muted">4 bulan terakhir</p>
          </div>
        </div>

        {/* Net summary badge */}
        <div
          className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl"
          style={{
            background: isPositive ? "rgba(25,197,158,0.10)" : "rgba(244,63,94,0.10)",
            border: isPositive ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(244,63,94,0.22)",
            color: isPositive ? "#19C59E" : "#F43F5E",
          }}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{isPositive ? "+" : ""}{formatCompactIDR(netBalance)}</span>
        </div>
      </div>

      {/* ── Native Interactive SVG Area Chart ── */}
      <div className="w-full h-[210px] relative z-10 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Income Gradient */}
            <linearGradient id="svgIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19C59E" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#19C59E" stopOpacity={0.01} />
            </linearGradient>

            {/* Expense Gradient */}
            <linearGradient id="svgExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((pct) => {
            const y = padTop + chartH * (1 - pct);
            const val = maxVal * pct;
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#6B7280"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {formatCompactIDR(val)}
                </text>
              </g>
            );
          })}

          {/* Expense Area & Line */}
          <path d={expenseAreaPath} fill="url(#svgExpenseGrad)" />
          <path
            d={expenseLinePath}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 2px 6px rgba(244,63,94,0.4))" }}
          />

          {/* Income Area & Line */}
          <path d={incomeAreaPath} fill="url(#svgIncomeGrad)" />
          <path
            d={incomeLinePath}
            fill="none"
            stroke="#19C59E"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 2px 6px rgba(25,197,158,0.4))" }}
          />

          {/* Points & Labels for each column */}
          {data.map((d, i) => {
            const x = getX(i);
            const incY = getY(d.income);
            const expY = getY(d.expense);
            const isHovered = hoveredIndex === i;

            return (
              <g key={d.period} className="cursor-pointer">
                {/* Vertical hover line indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={bottomY}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Expense dot */}
                <circle
                  cx={x}
                  cy={expY}
                  r={isHovered ? 5 : 3.5}
                  fill="#F43F5E"
                  stroke="#080C12"
                  strokeWidth={2}
                  style={isHovered ? { filter: "drop-shadow(0 0 6px #F43F5E)" } : undefined}
                />

                {/* Income dot */}
                <circle
                  cx={x}
                  cy={incY}
                  r={isHovered ? 5.5 : 4}
                  fill="#19C59E"
                  stroke="#080C12"
                  strokeWidth={2}
                  style={isHovered ? { filter: "drop-shadow(0 0 6px #19C59E)" } : undefined}
                />

                {/* X Axis Period Label */}
                <text
                  x={x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill={isHovered ? "#19C59E" : "#9CA3AF"}
                  fontSize="10"
                  fontWeight={isHovered ? "700" : "500"}
                  className="transition-colors duration-150"
                >
                  {d.period}
                </text>

                {/* Invisible hover hotspot */}
                <rect
                  x={x - 30}
                  y={padTop}
                  width={60}
                  height={chartH + padBottom}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Tooltip */}
        {hoveredItem && hoveredIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none transition-all duration-150 p-2.5 rounded-xl text-xs space-y-1 z-20 shadow-xl"
            style={{
              left: `${Math.min(75, Math.max(15, (getX(hoveredIndex) / svgWidth) * 100))}%`,
              transform: "translateX(-50%)",
              background: "rgba(8, 12, 18, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.7)",
            }}
          >
            <div className="font-bold text-text-primary border-b border-white/10 pb-1 text-[11px]">
              {hoveredItem.period}
            </div>
            <div className="flex items-center justify-between gap-3 text-[10.5px]">
              <span className="flex items-center gap-1.5 text-accent font-medium">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Pemasukan:
              </span>
              <span className="font-bold text-text-primary">
                {formatIDR(hoveredItem.income)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10.5px]">
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Pengeluaran:
              </span>
              <span className="font-bold text-text-primary">
                {formatIDR(hoveredItem.expense)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-6 mt-1 pt-2.5 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 text-xs">
          <span
            className="w-3 h-2 rounded-full shrink-0"
            style={{ background: "#19C59E", boxShadow: "0 0 8px rgba(25,197,158,0.6)" }}
          />
          <span className="text-text-muted font-medium">Pemasukan</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="w-3 h-2 rounded-full shrink-0"
            style={{ background: "#F43F5E", boxShadow: "0 0 8px rgba(244,63,94,0.6)" }}
          />
          <span className="text-text-muted font-medium">Pengeluaran</span>
        </div>
      </div>
    </div>
  );
}
