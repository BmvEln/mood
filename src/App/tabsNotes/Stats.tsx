import BarChart from "../components/graphics/BarChart";

const SD = {
  // barChart: [1, 0.3, 0.7, 0.4, 0.2, 0.8],
  barChart: [60, 30, 100, 300, 50, 290, 50, 290],
};

function Stats() {
  return (
    <div className="Stats">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <BarChart width={400} height={300} data={SD.barChart} />
      </div>
    </div>
  );
}

export default Stats;
