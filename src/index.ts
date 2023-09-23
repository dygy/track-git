import { getTroughGroup } from "./tracker";

getTroughGroup(
  process.argv[2].split(",").filter((el) => el.length),
  process.argv[3].split(",").filter((el) => el.length),
);
