export default {
  follower: (item: any) => [
    "New Follower",
    "You have a new follower.",
    "Click to view their profile",
    `/profile/user?account=${item.msg_id}&from=messages`,
    "Profile"
  ],
  token_create: (item: any) => [
    "Token Create",
    `Congratulations, you have successfully created ${item.content_2} Token`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}&from=messages`,
    "Detail"
  ],
  token_launching: (item: any) => [
    "Token Launching",
    `Congratulations, the ${item.content_2} Token you Flipped has received a lot of user interest and has successfully entered the Launching stage.`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}&from=messages`,
    "Detail"
  ],
  token_launching_owner: (item: any) => [
    "Token Launching",
    `Congratulations, the ${item.content_2} Token you created has received a lot of user interest and has successfully entered the Launching stage.
Click to view Token details.`,
    "Click to view Token details.",
    `/detail?address=${item.msg_id}&from=messages`,
    "Detail"
  ],
  token_list: (item: any) => [
    "Token List",
    `Congratulations, the ${item.content_2} Token you created has completed the launch and has been listed on Meteora Dex.`,
    "Click to view Token details.",
    `/detail?address=${item.id}&from=messages`,
    "Detail"
  ],
  add_vip: (item: any) => [
    "Add VIP",
    "Congratulations, you have become a prestigious FlipN VIP user.",
    "Click to view your profile.",
    "/profile?from=messages",
    "Profile"
  ],
  add_boost: (item: any) => [
    "Add Boost",
    "Congratulations, you have successfully purchased a Boost privilege.",
    "Click to view your profile.",
    "/profile?from=messages",
    "Profile"
  ]
} as Record<string, any>;
