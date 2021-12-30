"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardScene = void 0;
const base_1 = require("../base");
const context_1 = require("./context");
const composer_1 = require("../../composer");
class WizardScene extends base_1.default {
    constructor(id, options, ...steps) {
        let opts;
        let s;
        if (typeof options === 'function' || 'middleware' in options) {
            opts = undefined;
            s = [options, ...steps];
        }
        else {
            opts = options;
            s = steps;
        }
        super(id, opts);
        this.steps = s;
    }
    middleware() {
        return composer_1.default.compose([
            (ctx, next) => {
                ctx.wizard = new context_1.default(ctx, this.steps);
                return next();
            },
            super.middleware(),
            (ctx, next) => {
                if (ctx.wizard.step === undefined) {
                    ctx.wizard.selectStep(0);
                    return ctx.scene.leave();
                }
                return composer_1.default.unwrap(ctx.wizard.step)(ctx, next);
            },
        ]);
    }
    enterMiddleware() {
        return composer_1.default.compose([this.enterHandler, this.middleware()]);
    }
}
exports.WizardScene = WizardScene;
