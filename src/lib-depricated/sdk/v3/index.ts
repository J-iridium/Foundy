// sdk/index.ts
import { runPipeline } from "./orchestra/runPipeline";
import { createPipelineContext } from "./orchestra/createPipelineContext";
import type { PipelineContext, PipelineConfig } from "./orchestra/types";
import { scan } from "./pipeline/01-scan/scan";


class FoundySDK {
  private ctx: PipelineContext | null = null;

  configure(config: PipelineConfig) {
    this.ctx = createPipelineContext(config);
  }

  async run() {
    if (!this.ctx) throw new Error("Foundy SDK not configured. Call configure() first.");
    return await runPipeline(this.ctx);
  }

  scan() {
    if (!this.ctx) throw new Error("Foundy SDK not configured. Call configure() first.");
    this.ctx.scanTasks = scan();
    return this.ctx.scanTasks;
  }

  getState() {
    return this.ctx;
  }
}

export const foundy = new FoundySDK();
