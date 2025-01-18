import "./style.less";

// прокрутка
// тема горизонтальный бар

/**
 *
 * @param {number[]} data
 * @param {number} [width=number|undefined]
 * @param {number} [height=number|undefined]
 * @param {number} max
 * @param {number} [indentBar=6]
 * @param {boolean} [revers]
 * @returns {Element}
 * @constructor
 */

type BarChartProps = {
  data: number[];
  width?: number;
  height?: number;
  max?: number;
  indentBar?: number;
};

function BarChart({ data, width, height, max, indentBar = 6 }: BarChartProps) {
  const maxNumber = max || Math.max(...data),
    // someNumber % 1 === 0 --> определяем целое ли число
    numberPoints = (maxNumber / 6) % 1 === 0 ? 6 : 5,
    deductible = max
      ? Number((maxNumber / numberPoints).toFixed(1))
      : Math.round(maxNumber / numberPoints),
    heightBar = height || 300;

  let leftPoints = [];
  Array(numberPoints)
    .fill(1)
    .map((_, i) => {
      if (!i) {
        return leftPoints.push(maxNumber);
      }

      leftPoints.push(leftPoints[i - 1] - deductible);
    });

  return (
    <div
      className="BarChart"
      style={{ width: width || "100%", height: height || "100%" }}
    >
      <div
        style={{ gridTemplateRows: heightBar / numberPoints }}
        className="BarChart__leftPoints"
      >
        {leftPoints.map((point, i) => {
          const calcPoint = point % 1 === 0 ? point : point.toFixed(1);

          return (
            // Первый div - линии горизонтальные (отметки)
            <div key={i}>
              <div>{calcPoint}</div>
            </div>
          );
        })}
      </div>
      <div
        className="BarChart__bars"
        style={{
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          columnGap: indentBar,
        }}
      >
        {data.map((item, i) => {
          const calcItem = item % 1 === 0 ? item : item.toFixed(1);

          return (
            <div
              className="BarChart__bar"
              key={i}
              style={{
                height: max
                  ? (item / max) * heightBar
                  : (item / heightBar) * heightBar,
              }}
            >
              {/* Значения */}
              <div>{calcItem}</div>
            </div>
          );
        })}

        <div className="BarChart__startPoint">0</div>
      </div>
    </div>
  );
}

export default BarChart;
