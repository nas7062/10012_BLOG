"use client";

import { useEffect, useMemo, useState } from "react";
import { Doughnut, Bar } from "./_components/ChartComponents";

type Item = {
  name: string;
  pkg: string;
  downloads: number;
};

type ApiResponse = {
  period: string;
  frontend: Item[];
  backend: Item[];
  error?: string;
};

const FRAMEWORK_COLORS: Record<string, string> = {
  React: "#61dafb",
  Vue: "#41b883",
  Angular: "#dd1b16",
  Svelte: "#ff3e00",
  "Next.js": "#313030",
  Nuxt: "#00dc82",

  Express: "#303030",
  NestJS: "#e0234e",
  Fastify: "#57b5f9",
  Koa: "#2e7d32",
};

const PERIOD_OPTIONS = [
  { value: "last-day", label: "지난 1일" },
  { value: "last-week", label: "지난 1주" },
  { value: "last-month", label: "지난 1개월" },
  { value: "last-year", label: "지난 1년" },
];

type StackType = "frontend" | "backend";

export default function FrameworkStatsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>("last-month");
  const [stack, setStack] = useState<StackType>("frontend");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/framework-download?period=${period}`);
        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  const frontendItems = useMemo(() => data?.frontend ?? [], [data?.frontend]);
  const backendItems = useMemo(() => data?.backend ?? [], [data?.backend]);

  const frontendTotal = useMemo(
    () => frontendItems.reduce((acc, v) => acc + v.downloads, 0),
    [frontendItems]
  );

  const backendTotal = useMemo(
    () => backendItems.reduce((acc, v) => acc + v.downloads, 0),
    [backendItems]
  );

  if (loading) {
    return (
      <div className="min-h-screen min-w-7xl text-slate-900 dark:text-slate-50 flex items-center justify-center">
        <div className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          차트 그리는중...
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen min-w-7xl text-slate-900 dark:text-slate-50 flex items-center justify-center">
        <div className="px-6 py-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/40 text-red-700 dark:text-red-200">
          데이터를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  const frontendLabels = frontendItems.map((i) => i.name);
  const frontendValues = frontendItems.map((i) => i.downloads);

  const backendLabels = backendItems.map((i) => i.name);
  const backendValues = backendItems.map((i) => i.downloads);

  const makeDoughnutData = (labels: string[], values: number[]) => {
    const backgroundColors = labels.map(
      (label) => FRAMEWORK_COLORS[label] ?? "#94a3b8"
    );

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const makeBarData = (labels: string[], values: number[], label: string) => {
    const backgroundColors = labels.map(
      (label) => FRAMEWORK_COLORS[label] ?? "#94a3b8"
    );

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const periodLabel =
    PERIOD_OPTIONS.find((p) => p.value === data.period)?.label ?? data.period;

  const formatPercent = (value: number, total: number) =>
    total === 0 ? "0.0" : ((value / total) * 100).toFixed(1);

  return (
    <div className="w-full">
      <div className="min-h-screen ">
        <div className="max-w-7xl  mx-auto  px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* 헤더 */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl! sm:text-3xl! font-bold tracking-tight">
                NPM 다운로드 기준
                <span className="ml-2 text-primary-500 dark:text-primary-300">
                  프레임워크 인기도
                </span>
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                기간: {periodLabel} · 데이터 출처: api.npmjs.org
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* 기간 선택 드롭다운 */}
              <select
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/70"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* 스택 탭 (프론트엔드 / 백엔드) */}
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                type="button"
                onClick={() => setStack("frontend")}
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-full transition cursor-pointer ${
                  stack === "frontend"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                프론트엔드
              </button>
              <button
                type="button"
                onClick={() => setStack("backend")}
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-full transition cursor-pointer  ${
                  stack === "backend"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                백엔드
              </button>
            </div>
          </div>

          {/* 프론트엔드 섹션 */}
          {stack === "frontend" && (
            <section className="space-y-4 ">
              <div className="flex flex-col  sm:flex-row items-baseline justify-between gap-2">
                <h2 className="text-xl! font-semibold">
                  프론트엔드 프레임워크
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  React / Vue / Angular / Svelte / Next.js / Nuxt
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2  justify-items-start ">
                <div className="w-full max-w-md md:max-w-none border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                  <h3 className="text-lg! font-medium mb-3">비율 (Doughnut)</h3>
                  <div className="relative h-64 sm:h-96 flex items-center justify-center">
                    <Doughnut
                      data={makeDoughnutData(frontendLabels, frontendValues)}
                    />
                  </div>
                </div>
                <div className="w-full max-w-md md:max-w-none border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                  <h3 className="text-lg! font-medium mb-3">
                    다운로드 수 (Bar)
                  </h3>
                  <div className="relative h-64 sm:h-96 flex items-center justify-center">
                    <Bar
                      data={makeBarData(
                        frontendLabels,
                        frontendValues,
                        "프론트엔드 다운로드 수"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* 프론트엔드 테이블 */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                <h3 className="text-sm font-semibold mb-3">상세 수치</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-2">프레임워크</th>
                        <th className="text-right py-2">다운로드 수</th>
                        <th className="text-right py-2">비율(%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frontendItems.map((item) => (
                        <tr
                          key={item.pkg}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-right">
                            {item.downloads.toLocaleString()}
                          </td>
                          <td className="py-2 text-right">
                            {formatPercent(item.downloads, frontendTotal)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* 백엔드 섹션 */}
          {stack === "backend" && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2">
                <h2 className="text-xl! font-semibold">백엔드 프레임워크</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Express / NestJS / Fastify / Koa
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 justify-items-start ">
                <div className="w-full max-w-md md:max-w-none border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                  <h3 className="text-lg! font-medium mb-3">비율 (Doughnut)</h3>
                  <div className="relative h-64 sm:h-96 flex items-center justify-center">
                    <Doughnut
                      data={makeDoughnutData(backendLabels, backendValues)}
                    />
                  </div>
                </div>
                <div className="w-full max-w-md md:max-w-none border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                  <h3 className="text-lg! font-medium mb-3">
                    다운로드 수 (Bar)
                  </h3>
                  <div className="relative h-64 sm:h-96 flex items-center justify-center">
                    <Bar
                      data={makeBarData(
                        backendLabels,
                        backendValues,
                        "백엔드 다운로드 수"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* 백엔드 테이블 */}
              <div className="border  border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-white/70 dark:bg-slate-900/70 shadow-sm">
                <h3 className="text-sm font-semibold mb-3">상세 수치</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-2">프레임워크</th>
                        <th className="text-right py-2">다운로드 수</th>
                        <th className="text-right py-2">비율(%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backendItems.map((item) => (
                        <tr
                          key={item.pkg}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-right">
                            {item.downloads.toLocaleString()}
                          </td>
                          <td className="py-2 text-right">
                            {formatPercent(item.downloads, backendTotal)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
