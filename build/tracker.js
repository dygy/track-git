"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTroughGroup = void 0;
const git_1 = require("./git");
const regex = /(\d+)\s+(\d+)\s+([a-zA-Z\/.\-{}_]+)/gm;
const getTroughGroup = (pathes, authors) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {};
    for (const project of pathes) {
        for (const author of authors) {
            if (!result[author]) {
                result[author] = Object.assign({}, (pathes.length > 1 && {
                    global: {
                        added: 0,
                        removed: 0,
                        total: 0,
                    },
                }));
            }
            const logInfo = yield (0, git_1.gitExec)([
                "-C",
                project,
                "log",
                "--author",
                author,
                "--numstat",
            ]);
            const data = { author, added: 0, removed: 0 };
            let m;
            while ((m = regex.exec(logInfo)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    switch (groupIndex) {
                        case 1 /* Groups.ADDED */:
                            data.added += parseInt(match);
                            break;
                        case 2 /* Groups.REMOVED */:
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
});
exports.getTroughGroup = getTroughGroup;
