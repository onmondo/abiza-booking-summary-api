import supertest from 'supertest'
import {app} from '../../../app'

describe('Test GuestBookings', () => {
    describe('Get booking reports for the month of March', () => {
        describe('Given month of March', () => {
            it('should expect JSON as a response', () => {
                // expect(true).toBe(true);
                supertest(app).get('/api/v1/bookings/2024/February?sort=asc&page=1&limit=10')
                .expect('Content-Type', /json/)
                .expect(200)
            })
        })
    })
})