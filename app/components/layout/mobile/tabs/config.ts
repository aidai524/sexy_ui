import HomeIcon from "../../../icons/home";
import MemesIcon from "../../../icons/memes";
import CreateIcon from "../../../icons/create-m";
import SmartIcon from "../../../icons/smart";
import EarnIcon from "../../../icons/earn";

export default [
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
    key: ["/trends"],
    path: "/trends",
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
    iconSize: 26
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
