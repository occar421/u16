/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { u } from "../../index";

describe("Intrinsic components", function() {
  describe("with simple usage", function() {
    it("simple one should wait once for the result", function() {
      const c = <div />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("div");
        expect(result.value.attributes).toStrictEqual({});
        const child = result.value.children.next();
        expect(child.done).toBe(true);
        expect(child.value).toBeUndefined();
      } else {
        throw new Error("failed");
      }
    });

    it("1 arg one should wait once for the result", function() {
      const c = <div id="1" />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("div");
        expect(result.value.attributes).toStrictEqual({ id: "1" });
        const child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 string child one should wait once for the result", function() {
      const c = <div id="1">buz</div>;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("div");
        expect(result.value.attributes).toStrictEqual({ id: "1" });
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        expect(child.value).toStrictEqual({ node: "buz" });
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 intrinsic child one should wait once for the result", function() {
      const c = (
        <div id="1">
          <div id="2" />
        </div>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("div");
        expect(result.value.attributes).toStrictEqual({ id: "1" });
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("div");
          expect(node.attributes).toStrictEqual({ id: "2" });
          const grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("2 intrinsic children one should wait once for the result", function() {
      const c = (
        <div id="1">
          <div id="2" />
          <div id="3" />
        </div>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("div");
        expect(result.value.attributes).toStrictEqual({ id: "1" });
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("div");
          expect(node.attributes).toStrictEqual({ id: "2" });
          const grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("div");
          expect(node.attributes).toStrictEqual({ id: "3" });
          const grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });
  });
});
