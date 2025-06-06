export type Msg =
  | ["profile/select", { userid: string }]
  | ["posts/load", {}]
  | ["locations/load", {}];
