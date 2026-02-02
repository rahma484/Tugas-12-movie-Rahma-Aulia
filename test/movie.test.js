const request = require('supertest');
const express = require('express');
const router = require('../routes/movie-route'); 
const cache = require('../config/node-cache');
const app = express();
app.use(express.json());
app.use('/api', router);

describe('Comprehensive Movie API Unit Tests', () => {
    beforeEach(() => {
        cache.flushAll(); 
    });

    describe('GET /api/popular', () => {
        it('Harus berhasil mengambil data film populer dari server TMDb (First Hit)', async () => {
            const res = await request(app).get('/api/popular');
            
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('title');
                expect(res.body[0]).toHaveProperty('overview');
                expect(res.body[0]).toHaveProperty('background');
            }
        });

        it('Harus mengambil data dari Cache setelah pemanggilan pertama', async () => {
            await request(app).get('/api/popular');
            
            const res = await request(app).get('/api/popular');
            expect(res.statusCode).toEqual(200);
            expect(cache.has('popular_movies')).toBe(true); 
        });
    });

    describe('GET /api/movie', () => {
        it('Harus berhasil mencari film berdasarkan query', async () => {
            const query = 'Avengers';
            const res = await request(app).get(`/api/movie?query=${query}`);
            
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(cache.has(query)).toBe(true);
        });

        it('Harus mengembalikan error 500 jika query kosong', async () => {
            const res = await request(app).get('/api/movie'); 
            
            expect(res.statusCode).toEqual(500); //
            expect(res.body).toHaveProperty('msg', 'Query is required!!');
        });
    });

    describe('Data Integrity (Movie Model)', () => {
        it('Harus memastikan data yang dikirim tidak mengandung data mentah TMDb yang tidak perlu', async () => {
            const res = await request(app).get('/api/popular');
            
            if (res.body.length > 0) {
                const movie = res.body[0];
                expect(movie.adult).toBeUndefined();
                expect(movie.popularity).toBeUndefined();
                expect(movie.title).toBeDefined();
            }
        });
    });
});