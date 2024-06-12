import { computeLimit, computeSkip } from "../reports"

describe("Test reports.ts", () => {
    describe("Test computeLimit function", () => {
        describe("Given string value of 10", () => {
            it("should convert to the value to number", () => {
                const limit: number = computeLimit("10")
                expect(typeof limit).toBe("number")
            })
    
            it("should be a value of 10", () => {
                const limit: number = computeLimit("10")
                expect(limit).toBe(10)
            })
        })
    })

    describe("Test computeSkip function", () => {
        describe("Given string value of 1 for page and number value of 10", () => {
            it("should convert to the value to number", () => {
                const skip: number = computeSkip("1", 10)
                expect(typeof skip).toBe("number")
            })

            it("should be a value of 0", () => {
                const skip: number = computeSkip("1", 10)
                expect(skip).toBe(0)
            })
        })

        describe("Given string value of 2 for page and number value of 10", () => {
            it("should convert to the value to number", () => {
                const skip: number = computeSkip("2", 10)
                expect(typeof skip).toBe("number")
            })

            it("should be a value of 10", () => {
                const skip: number = computeSkip("2", 10)
                expect(skip).toBe(10)
            })
        })        
    })
})