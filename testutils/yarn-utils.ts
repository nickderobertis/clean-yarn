import { resolve } from "path";
import { promises } from "fs";
import yaml from "js-yaml";

const { writeFile } = promises;

type YarnRCYaml = Record<string, string | boolean>;

export function createYarnRCYaml(data: YarnRCYaml, cwd = "."): Promise<void> {
  const target = resolve(cwd);
  return writeFile(resolve(target, `.yarnrc.yml`), yaml.dump(data));
}
