export default {
  follower: (item: any) => [
    "New Follower",
    "You have a new follower.",
    "Click to view their profile",
    `/profile/user?account=${item.msg_id}`,
    "Profile"
  ],
  token_create: (item: any) => [
    "Token Create",
    `Congratulations, you have successfully created ${item.content_2} Token`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}`,
    "Detail"
  ],
  token_launching: (item: any, userInfo: any) => [
    "Token Launching",
    item.account !== userInfo.address
      ? `Congratulations, the ${item.content_2} Token you Flipped has received a lot of user interest and has successfully entered the Launching stage.`
      : `Congratulations, the ${item.content_2} Token you created has received a lot of user interest and has successfully entered the Launching stage.
Click to view Token details.`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}`,
    "Detail"
  ],
  token_launching_owner: (item: any) => [
    "Token Launching",
    `Congratulations, the ${item.content_2} Token you created has received a lot of user interest and has successfully entered the Launching stage.
Click to view Token details.`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}`,
    "Detail"
  ],
  token_list: (item: any) => [
    "Token List",
    `Congratulations, the ${item.content_2} Token you created has completed the launch and has been listed on [Orca] Dex.`,
    "Click to view Token details.",
    `/detail?address=${item.id}`,
    "Detail"
  ],
  add_vip: (item: any) => [
    "Add VIP",
    "Congratulations, you have become a prestigious FlipN VIP user.",
    "Click to view your profile.",
    "/profile",
    "Profile"
  ],
  add_boost: (item: any) => [
    "Add Boost",
    "Congratulations, you have successfully purchased a Boost privilege.",
    "Click to view your profile.",
    "/profile",
    "Profile"
  ]
} as Record<string, any>;
