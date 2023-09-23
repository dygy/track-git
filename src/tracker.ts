import { gitExec } from "./git";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type TrackerArguments = ArgumentTypes<typeof getTroughGroup>;
type ResultObject = Record<
    ArrayElement<TrackerArguments[1]>,
  Record<
      ArrayElement<TrackerArguments[0]> | "global",
    {
      added: number;
      removed: number;
      total: number;
    }
  >
>;

const enum Groups {
  ADDED = 1,
  REMOVED = 2,
  WHERE = 3,
}

const regex = /(\d+)\s+(\d+)\s+([a-zA-Z\/.\-{}_]+)/gm;

export const getTroughGroup = async (pathes: string[], authors: string[]) => {
  const result: ResultObject = {};
  for (const project of pathes) {
    for (const author of authors) {
      if (!result[author]) {
        result[author] = {
          ...(pathes.length > 1 && {
            global: {
              added: 0,
              removed: 0,
              total: 0,
            },
          }),
        };
      }
      const logInfo = await gitExec([
        "-C",
        project,
        "log",
        "--author",
        author,
        "--numstat",
      ]);
      const data = { author, added: 0, removed: 0 };
      let m;

      while ((m = regex.exec(<string>logInfo)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          switch (groupIndex) {
            case Groups.ADDED:
              data.added += parseInt(match);
              break;
            case Groups.REMOVED:
              data.removed += parseInt(match);
          }
        });
      }

      result[author][project] = {
        added: data.added,
        removed: data.removed,
        total: data.added + data.removed,
      };

      if (pathes.length > 1) {
        result[author].global = {
          added: result[author].global.added + data.added,
          removed: result[author].global.removed + data.removed,
          total: result[author].global.total + data.added + data.removed,
        };
      }
    }
  }
  console.log(result);
};
