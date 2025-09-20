import yaml from "js-yaml";

export function toYaml(data: any): string {
    return yaml.dump(data, { noRefs: true });
}

export function fromYaml(yamlText: string): any | null {
    try {
        return yaml.load(yamlText);
    } catch (err) {
        throw err;
    }
}
