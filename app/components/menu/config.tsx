import HomeIcon from "../icons/home";
import Trends from "../icons/trends";
import Create from "../icons/create";
import Reward from "../icons/reward";
import Profile from "../icons/profile";

export default [
  {
    icon: <HomeIcon />,
    label: "Home",
    key: ["/"],
    path: "/"
  },
  {
    icon: <Trends />,
    label: "Trends",
    key: ["/trends"],
    path: "/trends"
  },
  {
    icon: <Create />,
    label: "Create",
    key: ["/create"],
    path: "/create",
    needLogin: true
  },
  {
    icon: <Reward />,
    label: "Reward",
    key: ["/reward"],
    path: "/reward"
  },
  {
    icon: <Profile />,
    label: "Profile",
    key: ["/profile"],
    path: "/profile",
    needLogin: true
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
