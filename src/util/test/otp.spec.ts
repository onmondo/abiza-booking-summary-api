import assert from 'assert';
import { describe } from 'mocha';
import { generateOtp } from '../otp';

describe("Test otp.ts", () => {
    context("Test generateOtp function", () => {
        // before(() => {
        //     console.log(">>>> before")
        // })
        // after(() => {
        //     console.log(">>>> after")
        // })
        // beforeEach(() => {
        //     console.log(">> before each")
        // })
        // afterEach(() => {
        //     console.log(">> after each")
        // })
        it("should generate a six digit otp", () => {
            const otp = generateOtp();
            assert.notEqual(otp, null)
            assert.equal(otp.expectedOTP.length, 6)
        })
    })
})