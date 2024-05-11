import { PageContainer } from "@ant-design/pro-components";
import { Card } from "antd";
import { useQuery } from "@tanstack/react-query";
import { api, fetchWrap } from "@/utils/connection";
import { useEffect, useRef } from "react";
import _ from "lodash";
import * as echarts from "echarts";
import dayjs from "dayjs";

export default function StatisticsPage() {
  const { data: devices } = useQuery({
    queryKey: ["devices"],
    initialData: [],
    queryFn: fetchWrap(api.device.list),
  });
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    initialData: [],
    queryFn: fetchWrap(api.work_order.list),
  });
  const chart1Ref = useRef<HTMLDivElement>(null);
  const chart2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chart1Ref.current || !chart2Ref.current) return;
    setTimeout(() => {
      console.log(orders);
      const val1 = _(orders)
        .filter((it) => Boolean(it.faultDescription && it.maintenanceResult))
        .groupBy((it) => it.maintainDate)
        .mapValues((it) => it.length)
        .toPairs()
        .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0]), "day"))
        .value();
      echarts.init(chart1Ref.current).setOption({
        title: { text: "每天设备检修数量" },
        tooltip: { trigger: "axis" },
        legend: { data: ["设备检修数量"] },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: val1.map((it) => it[0]),
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "设备检修数量",
            type: "line",
            stack: "总量",
            data: val1.map((it) => it[1]),
            itemStyle: { color: "#1e8152" },
          },
        ],
      });
    }, 100);
    echarts.init(chart2Ref.current).setOption({
      title: { text: "设备故障类型分析", left: "center" },
      tooltip: { trigger: "item" },
      legend: { orient: "vertical", left: "left" },
      series: [
        {
          name: "故障类型",
          type: "pie",
          radius: "50%",
          data: _(orders)
            .filter((it) => Boolean(it.faultDescription))
            .groupBy((it) => it.device.name)
            .mapValues((it) => it.length)
            .entries()
            .map(([name, value]) => ({ name, value }))
            .value(),
          // data: [
          //   { value: 10, name: "心电图机" },
          //   { value: 8, name: "超声波设备" },
          //   { value: 19, name: "X光机" },
          //   { value: 40, name: "核磁共振设备" },
          //   { value: 201, name: "血压计" },
          // ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  }, [devices, orders]);
  return (
    <PageContainer>
      <div className="grid grid-cols-4 gap-8">
        <Card>
          <span className="text-black/50">设备总数</span>
          <div className="text-2xl">{devices.length}</div>
        </Card>
        <Card>
          <span className="text-black/50">故障</span>
          <div className="text-2xl">
            {
              orders.filter(
                (it) => it.faultDescription && !it.maintenanceResult
              ).length
            }
          </div>
        </Card>
        <Card>
          <span className="text-black/50">待检修</span>
          <div className="text-2xl">
            {
              orders.filter(
                (it) => it.faultDescription && !it.maintenanceResult
              ).length
            }
          </div>
        </Card>
        <Card>
          <span className="text-black/50">库存告急</span>
          <div className="text-2xl">0</div>
        </Card>
        <Card className="col-span-4">
          <div className="h-80" ref={chart1Ref}></div>
        </Card>
        <Card className="col-span-4">
          <div className="h-80" ref={chart2Ref}></div>
        </Card>
      </div>
    </PageContainer>
  );
}
