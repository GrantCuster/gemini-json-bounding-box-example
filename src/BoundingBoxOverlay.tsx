import { useAtom } from "jotai";
import { responseAtom } from "./atoms";
import { extractJSONFromMarkdown } from "./utils";
import { canvasHeight, canvasWidth } from "./consts";

export function BoundingBoxOverlay() {
  const [response] = useAtom(responseAtom);

  let formatted: {
    name: string;
    coords: { x: number; y: number; width: number; height: number };
  }[] = [];
  try {
    const rawExtracted = extractJSONFromMarkdown(response);
    // if any keys repeat, add incrementing numbers to the end
    let nameCounts: { [key: string]: number } = {};
    const edited = rawExtracted.split("\n").map((line) => {
      const name = line.split(":")[0].trim().split('"')[1];
      if (name) {
        if (nameCounts[name]) {
          nameCounts[name]++;
          return line.replace(name, `${name}_${nameCounts[name]}`);
        } else {
          nameCounts[name] = 1;
          return line;
        }
      } else {
        return line;
      }
    });
    const rawExtractedUnique = edited.join("\n");

    const json = JSON.parse(rawExtractedUnique);
    const boxKeys = Object.keys(json);
    formatted = boxKeys.map((key) => {
      const coords = json[key];
      return {
        name: key,
        // convert from ["y_min", "x_min", "y_max", "x_max"];
        // convert from 1000x1000 space to percentage
        coords: {
          x: coords[1] / 1000,
          y: coords[0] / 1000,
          width: coords[3] / 1000 - coords[1] / 1000,
          height: coords[2] / 1000 - coords[0] / 1000,
        },
      };
    });
  } catch (e) {
    console.error(e);
  }

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: "none",
      }}
    >
      {formatted.map((object) => {
        const { coords } = object;
        return (
          <div
            className="absolute border-2 border-red-500"
            style={{
              left: coords.x * 100 + "%",
              top: coords.y * 100 + "%",
              width: coords.width * 100 + "%",
              height: coords.height * 100 + "%",
            }}
          >
            <div className="absolute bg-red-500 text-xs left-0 bottom-0 font-mono text-white px-1">
              {object.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
