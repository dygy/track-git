import { spawn } from "child_process";

export const gitExec = (command: readonly string[]) =>
  new Promise((resolve, reject) => {
    const thread = spawn("git", command, {
      stdio: ["inherit", "pipe", "pipe"],
      shell: false,
    });
    const stdOut: any[] = [];
    const stdErr: any[] = [];

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
