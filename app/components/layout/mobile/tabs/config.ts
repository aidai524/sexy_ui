import HomeIcon from "../../../icons/home";
import MemesIcon from "../../../icons/memes";
import CreateIcon from "../../../icons/create-m";
import SmartIcon from "../../../icons/smart";
import EarnIcon from "../../../icons/earn";
import { SHOW_COPY_TRADE } from "@/app/utils/config";
const tabs = [
  {
    icon: HomeIcon,
    label: "Home",
    key: ["/"],
    path: "/",
    iconSize: 26
  },
  {
    icon: MemesIcon,
    label: "Memes",
    key: ["/memes"],
    path: "/memes",
    iconSize: 26
  },
  {
    icon: CreateIcon,
    label: "Create",
    key: ["/create"],
    path: "/create",
    needLogin: true,
    iconSize: 32
  },
  {
    icon: SmartIcon,
    label: "Smart",
    key: ["/smart"],
    path: "/smart",
    iconSize: 26,
    comingSoon: !SHOW_COPY_TRADE
  },
  {
    icon: EarnIcon,
    label: "Earn",
    key: ["/reward"],
    path: "/reward",
    needLogin: true,
    iconSize: 26
  }
];

export default tabs;
export const tabsPath = tabs.map((tab) => tab.path);
