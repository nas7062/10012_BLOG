"use client";

import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Chart.js 등록은 한 번만 실행되도록 보장
if (typeof window !== "undefined") {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
  );
}

const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted rounded-full w-full h-full min-h-[256px]" />
    ),
  }
);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-lg w-full h-full min-h-[256px]" />
  ),
});

export { Doughnut, Bar };
