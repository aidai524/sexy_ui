import HomeIcon from "../icons/home";
import MemesIcon from "../icons/memes";
import SmartIcon from "../icons/smart";
import EarnIcon from "../icons/earn";
import Profile from "../icons/profile";
import { SHOW_COPY_TRADE } from "@/app/utils/config";

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
    key: ["/memes"],
    path: "/memes",
    iconSize: 26
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
  },
  {
    icon: Profile,
    label: "Profile",
    key: ["/profile"],
    path: "/profile",
    needLogin: true,
    iconSize: 25
  }
];

export const Links = [
  {
    icon: "/img/community/x.svg",
    href: "https://x.com/flipndotfun"
  },
  {
    icon: "/img/community/telegram.svg",
    href: "https://t.me/Flip_N"
  }
  // {
  //   icon: "/img/community/discard.svg",
  //   href: ""
  // }
];
