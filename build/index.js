"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracker_1 = require("./tracker");
(0, tracker_1.getTroughGroup)(process.argv[2].split(",").filter((el) => el.length), process.argv[3].split(",").filter((el) => el.length));
