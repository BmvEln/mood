import ContentLoader from "react-content-loader";

function SkeletonCard() {
  return (
    <ContentLoader
      speed={1}
      width={324}
      height={212}
      viewBox="0 0 324 212"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="8" ry="8" width="324" height="212" />
    </ContentLoader>
  );
}

export default SkeletonCard;
