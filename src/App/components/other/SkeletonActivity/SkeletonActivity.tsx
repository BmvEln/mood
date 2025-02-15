import ContentLoader from "react-content-loader";

const NUMBER_ACTIVITY = 11,
  WIDTH_ACTIVITY = 70,
  HEIGHT_ACTIVITY = 32,
  INDENT_ACTIVITY = 12,
  ACTIVITY_POSITION_X = Array(NUMBER_ACTIVITY)
    .fill(1)
    .reduce((acc, _, i) => {
      if (!i) {
        acc[i] = i;
        return acc;
      }

      acc[i] = acc[i - 1] + WIDTH_ACTIVITY + INDENT_ACTIVITY;

      return acc;
    }, []);

function SkeletonActivity() {
  return (
    <>
      <ContentLoader
        speed={1}
        width={900}
        height={HEIGHT_ACTIVITY}
        viewBox={`0 0 900 ${HEIGHT_ACTIVITY}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {ACTIVITY_POSITION_X.map((n: number, i: number) => (
          <rect
            key={i}
            x={n}
            y="0"
            rx="16"
            ry="16"
            width={WIDTH_ACTIVITY}
            height={HEIGHT_ACTIVITY}
          />
        ))}
      </ContentLoader>
      <ContentLoader
        speed={1}
        width={900}
        height={HEIGHT_ACTIVITY}
        viewBox={`0 0 900 ${HEIGHT_ACTIVITY}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {ACTIVITY_POSITION_X.slice(0, 3).map((n: number, i: number) => (
          <rect
            key={i}
            x={n}
            y="0"
            rx="16"
            ry="16"
            width={WIDTH_ACTIVITY}
            height={HEIGHT_ACTIVITY}
          />
        ))}
      </ContentLoader>
    </>
  );
}

export default SkeletonActivity;
