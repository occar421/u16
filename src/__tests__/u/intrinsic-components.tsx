/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { u } from "../../index";

describe("Intrinsic components", function() {
  describe("with simple usage", function() {
    it("self-closing & plain", async function() {
      const rootElGen = <div />;
      //{`gen`| values: [], return: { tag: "div", attributes: {}, children: {`gen`| values: [], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: {}, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({});
        const childrenGen = rootEl.children;
        //{`gen`| values: [], return: ! }

        const childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("self-closing with 1 attr", async function() {
      const rootElGen = <div id="1" />;
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [], return: ! }

        const childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 string child", async function() {
      const rootElGen = <div id="1">buz</div>;
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [
      //  "buz"
      //], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  "buz"
        //], return: ! }

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        expect(childrenGenResult.value).toBe("buz");

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 intrinsic child", async function() {
      const rootElGen = (
        <div id="1">
          <div id="2" />
        </div>
      );
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [
      //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`| values: [], return: ! } } }
      //], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }
        //], return: ! }

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        if (
          !childrenGenResult.done &&
          typeof childrenGenResult.value === "object"
        ) {
          const childElGen = childrenGenResult.value;
          //{`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }

          const childElGenResult = await childElGen.next();
          expect(childElGenResult.done).toBe(true);
          if (
            childElGenResult.done &&
            typeof childElGenResult.value === "object"
          ) {
            const childEl = childElGenResult.value;
            //{ tag: "div", attributes: { "id": "2" }, children: {`gen`} }
            expect(childEl.tag).toBe("div");
            expect(childEl.attributes).toStrictEqual({ id: "2" });

            const grandchildrenGen = childEl.children;
            //{`gen`| value: [], return: ! }

            const grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(true);
          } else {
            throw new Error("failed");
          }
        } else {
          throw new Error("failed");
        }

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("2 intrinsic children", async function() {
      const rootElGen = (
        <div id="1">
          <div id="2" />
          <div id="3" />
        </div>
      );
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [
      //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`| values: [], return: ! } } },
      //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`| values: [], return: ! } } }
      //], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } },
        //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`} } }
        //]

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        if (
          !childrenGenResult.done &&
          typeof childrenGenResult.value === "object"
        ) {
          const childElGen = childrenGenResult.value;
          //{`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }

          const childElGenResult = await childElGen.next();
          expect(childElGenResult.done).toBe(true);
          if (
            childElGenResult.done &&
            typeof childElGenResult.value === "object"
          ) {
            const childEl = childElGenResult.value;
            //{ tag: "div", attributes: { "id": "2" }, children: {`gen`} }
            expect(childEl.tag).toBe("div");
            expect(childEl.attributes).toStrictEqual({ id: "2" });

            const grandchildrenGen = childEl.children;
            //{`gen`| value: [], return: ! }

            const grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(true);
          } else {
            throw new Error("failed");
          }
        } else {
          throw new Error("failed");
        }

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        if (
          !childrenGenResult.done &&
          typeof childrenGenResult.value === "object"
        ) {
          const childElGen = childrenGenResult.value;
          //{`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`} } }

          const childElGenResult = await childElGen.next();
          expect(childElGenResult.done).toBe(true);
          if (
            childElGenResult.done &&
            typeof childElGenResult.value === "object"
          ) {
            const childEl = childElGenResult.value;
            //{ tag: "div", attributes: { "id": "3" }, children: {`gen`} }
            expect(childEl.tag).toBe("div");
            expect(childEl.attributes).toStrictEqual({ id: "3" });

            const grandchildrenGen = childEl.children;
            //{`gen`| value: [], return: ! }

            const grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(true);
          } else {
            throw new Error("failed");
          }
        } else {
          throw new Error("failed");
        }

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 string grandchild", async function() {
      const rootElGen = (
        <div id="1">
          <div id="2">buz</div>
        </div>
      );
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [
      //  { `gen` values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`| values: [
      //    "buz"
      //  ], return: ! } } }
      //], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } },
        //]

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        if (
          !childrenGenResult.done &&
          typeof childrenGenResult.value === "object"
        ) {
          const childElGen = childrenGenResult.value;
          //{`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }

          const childElGenResult = await childElGen.next();
          expect(childElGenResult.done).toBe(true);
          if (
            childElGenResult.done &&
            typeof childElGenResult.value === "object"
          ) {
            const childEl = childElGenResult.value;
            //{ tag: "div", attributes: { "id": "2" }, children: {`gen`} }
            expect(childEl.tag).toBe("div");
            expect(childEl.attributes).toStrictEqual({ id: "2" });

            const grandchildrenGen = childEl.children;
            //{`gen`| values: [
            //  "buz"
            //], return: ! }

            let grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(false);
            expect(grandchildrenGenResult.value).toBe("buz");

            grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(true);
          } else {
            throw new Error("failed");
          }
        } else {
          throw new Error("failed");
        }

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });

    it("1 intrinsic grandchild", async function() {
      const rootElGen = (
        <div id="1">
          <div id="2">
            <div id="3" />
          </div>
        </div>
      );
      //{`gen`| values: [], return: { tag: "div", attributes: { "id": "1" }, children: {`gen`| values: [
      //  { `gen` values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`| values: [
      //    {`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`| values: [], return: ! } } }
      //  ], return: ! } } }
      //], return: ! } } }

      const rootElGenResult = await rootElGen.next();
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "div", attributes: { "id": "1" }, children: {`gen`} }
        expect(rootEl.tag).toBe("div");
        expect(rootEl.attributes).toStrictEqual({ id: "1" });
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }
        //]

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        if (
          !childrenGenResult.done &&
          typeof childrenGenResult.value === "object"
        ) {
          const childElGen = childrenGenResult.value;
          //{`gen`| values: [], return: { tag: "div", attributes: { "id": "2" }, children: {`gen`} } }

          const childElGenResult = await childElGen.next();
          expect(childElGenResult.done).toBe(true);
          if (
            childElGenResult.done &&
            typeof childElGenResult.value === "object"
          ) {
            const childEl = childElGenResult.value;
            //{ tag: "div", attributes: { "id": "2" }, children: {`gen`} }
            expect(childEl.tag).toBe("div");
            expect(childEl.attributes).toStrictEqual({ id: "2" });

            const grandchildrenGen = childEl.children;
            //{`gen`| values: [
            //  {`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`} } }
            //], return: ! }

            let grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(false);
            if (
              !grandchildrenGenResult.done &&
              typeof grandchildrenGenResult.value === "object"
            ) {
              const grandchildElGen = grandchildrenGenResult.value;
              //{`gen`| values: [], return: { tag: "div", attributes: { "id": "3" }, children: {`gen`} } }

              const grandchildElGenResult = await grandchildElGen.next();
              expect(grandchildElGenResult.done).toBe(true);
              if (
                grandchildElGenResult.done &&
                typeof grandchildElGenResult.value === "object"
              ) {
                const grandchildEl = grandchildElGenResult.value;
                //{ tag: "div", attributes: { "id": "3" }, children: {`gen`}
                expect(grandchildEl.tag).toBe("div");
                expect(grandchildEl.attributes).toStrictEqual({ id: "3" });

                const grandGrandchildrenGen = grandchildEl.children;
                //{`gen`| value: [], return: ! }

                const grandGrandchildrenGenResult = await grandGrandchildrenGen.next();
                expect(grandGrandchildrenGenResult.done).toBe(true);
              } else {
                throw new Error("failed");
              }
            } else {
              throw new Error("failed");
            }

            grandchildrenGenResult = await grandchildrenGen.next();
            expect(grandchildrenGenResult.done).toBe(true);
          } else {
            throw new Error("failed");
          }
        } else {
          throw new Error("failed");
        }

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    });
  });
});
