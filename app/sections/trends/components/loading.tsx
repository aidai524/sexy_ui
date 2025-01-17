import CircleLoading from "@/app/components/icons/loading";

const TrendsLoading = () => {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 300,
        color: "rgb(146, 144, 177)",
        fontFamily: "Unbounded",
        textAlign: "center",
        height: 70,
        width: "100%"
      }}
    >
      <CircleLoading size={30} />
    </div>
  );
};

export default TrendsLoading;
