import Main from "./main";
import GuidingTour from "@/app/components/guiding-tour";
import { MaskPlacement } from "@/app/components/guiding-tour/get-style-rect";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/hooks/useUserInfo";

export default function Laptop() {
  const { address } = useAccount();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  return (
    <>
      <GuidingTour
        steps={[
          {
            selector: () => {
              return document.getElementById("guid-home-dislike");
            },
            content: (
              <>
                Clicking{" "}
                <span style={{ fontWeight: "bold" }}>{'"Unlike"'}</span>{" "}
                {
                  "means you don't think much of the project and won't push it for you next time."
                }
              </>
            ),
            placement: MaskPlacement.TopLeft
          },
          {
            selector: () => {
              return document.getElementById("guid-home-like");
            },
            content: (
              <>
                Swipe through new projects and{" "}
                <span style={{ fontWeight: "bold" }}>“like”</span> the ones you
                believe in.
              </>
            ),
            placement: MaskPlacement.TopLeft
          },
          {
            selector: () => {
              return document.getElementById("guid-home-smoke");
            },
            content: (
              <>
                With <span style={{ fontWeight: "bold" }}>Pre-Launch</span>{" "}
                tokens, you can{" "}
                <span style={{ fontWeight: "bold" }}>Pre-Buy</span> first to get
                a better price.
              </>
            ),
            placement: MaskPlacement.TopLeft
          },
          {
            selector: () => {
              return document.getElementById("guid-home-trends");
            },
            content: (
              <>
                Here are the <span style={{ fontWeight: "bold" }}>hottest</span>{" "}
                tokens, all can be traded.
              </>
            ),
            placement: MaskPlacement.Top,
            type: "button"
          },
          {
            selector: () => {
              return document.getElementById("guid-home-create");
            },
            content: (
              <>
                Set up your{" "}
                <span style={{ fontWeight: "bold" }}>Token project</span> on
                FlipN and promote it to achieve bonding curve graduation.
              </>
            ),
            placement: MaskPlacement.TopLeft,
            type: "button"
          },
          {
            selector: () => {
              return document.getElementById("layout-mining");
            },
            content: (
              <>
                <span style={{ fontWeight: "bold" }}>Like</span>
                {"the projects you love, participate in FlipN's points"}{" "}
                <span style={{ fontWeight: "bold" }}>mining</span> campaign.
              </>
            ),
            placement: MaskPlacement.BottomRight
          },
          {
            selector: () => {
              return document.getElementById("layout-points-label");
            },
            content: (
              <>
                Receive{" "}
                <span style={{ fontWeight: "bold" }}>platform tokens</span> when
                your likes align with successful projects.
              </>
            ),
            placement: MaskPlacement.Bottom,
            type: "button"
          },
          {
            selector: () => {
              return document.getElementById("layout-zoom-out");
            },
            content: <>Try a smoother browsing experience.</>,
            placement: MaskPlacement.BottomRight
          }
        ]}
      />
      <Main address={address} userInfo={userInfo} />
    </>
  );
}
