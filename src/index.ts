import { configDotenv } from "dotenv";
import * as process from "process";

import { getTroughGroup } from "./tracker";

configDotenv();

let projects = process.argv[2]?.split(",").filter((el) => el.length),
  authors = process.argv[3]?.split(",").filter((el) => el.length);

if (!authors) {
  if (process.env.authors) {
    authors = process.env.authors.split(",").filter((el) => el.length);
  } else {
    throw Error("provide an authors");
  }
}
if (!projects) {
  if (process.env.projects) {
    projects = process.env.projects.split(",").filter((el) => el.length);
  } else {
    throw Error("provide an projects");
  }
}

getTroughGroup(projects, authors).then(() => {
  console.log("DONE");
});
