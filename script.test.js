/**
 * @class Model
 */

import { Model } from "./script";

describe("Todo", () => {
    const model = new Model();
  
    test("add Task", () => {
        const output = [{
            id: Date.now(),
            text: asd,
            complete: false,
            edit: false,
        }]
      expect(model.addTask('asd')).toBe(output);
    });
  });