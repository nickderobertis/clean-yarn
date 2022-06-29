import { Command, Flags } from "@oclif/core";
import { clean } from "../clean";

export default class NukeYarnCommand extends Command {
  static description =
    "Delete all node_modules and yarn.lock files in the current project";

  static usage = "[-c <value>]";

  static flags = {
    cwd: Flags.string({
      char: "c",
      description: "Working directory for the project",
      required: false,
      default: ".",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(NukeYarnCommand);

    await clean(flags.cwd);
  }
}
