import { Command, Flags } from "@oclif/core";
import { clean } from "../clean";

export default class CleanYarnCommand extends Command {
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
    const { flags } = await this.parse(CleanYarnCommand);

    await clean(flags.cwd);
  }
}
