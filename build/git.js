"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitExec = void 0;
const child_process_1 = require("child_process");
const gitExec = (command) => new Promise((resolve, reject) => {
    const thread = (0, child_process_1.spawn)("git", command, {
        stdio: ["inherit", "pipe", "pipe"],
        shell: false,
    });
    const stdOut = [];
    const stdErr = [];
    thread.stdout.on("data", (data) => {
        stdOut.push(data.toString("utf8"));
    });
    thread.stderr.on("data", (data) => {
        stdErr.push(data.toString("utf8"));
    });
    thread.on("close", () => {
        if (stdErr.length) {
            reject(stdErr.join(""));
            return;
        }
        resolve(stdOut.join());
    });
});
exports.gitExec = gitExec;
