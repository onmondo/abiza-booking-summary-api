import assert from 'assert';
import { describe } from 'mocha';
import jwt from 'jsonwebtoken'

import { generateAccessToken, generateRefreshToken } from '../accessToken';
import { envKeys } from '../config';

describe("Test accessToken.ts", () => {
    context("Test generateAccessToken function", () => {
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
        it("should generate an access token", () => {
            const accessToken = generateAccessToken({ 
                username: "john.raymond.blando@gmail.com", 
                secret: envKeys().AUTHORIZER_SECRET_KEY
            }, 1000)

            assert.notEqual(accessToken, null);
        })

        it("should expire in 10 seconds", () => {
            const accessToken = generateAccessToken({ 
                username: "john.raymond.blando@gmail.com", 
                secret: envKeys().AUTHORIZER_SECRET_KEY
            }, 10)

            let isVerified = null
            
            setTimeout(() => {
                isVerified = jwt.verify(accessToken, envKeys().AUTHORIZER_SECRET_KEY)
            }, 10000)
            assert.equal(isVerified, null);
        })
    })
    context("Test generateRefreshToken function", () => {
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
        it("should generate a refresh token", () =>  {
            const refreshToken = generateRefreshToken({ 
                username: "john.raymond.blando@gmail.com", 
                secret: envKeys().REFRESHER_SECRET_KEY
            }, 10000)

            assert.notEqual(refreshToken, null);
        })
    })
})