import { Router } from 'express';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';
import { pool } from "../helpers/db.js";
// config dotenv
import dotenv from 'dotenv';
dotenv.config();

const movieRouter = Router();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

movieRouter.get('/search', async (req, res) => {
    console.log('query is: ', req.query.query);
    // console.log('query params is: ', req.query);
    try {
        const response = await axios.get(BASE_URL + '/search/movie', { params: {
            api_key: API_KEY,
            query: req.query.query
        }});
        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get("/findbyid", async (req, res) => {
    const { movie_id } = req.query;
    if (!movie_id) {
        return res.status(400).send("Movie ID is required.");
    }
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movie_id}`, {
            params: { api_key: API_KEY },
        });
        res.send(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});


movieRouter.get('/trending', async(req, res) => {
    try{
        const response = await axios.get(BASE_URL + '/trending/movie/week', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/movie/popular', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/toprated', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/movie/top_rated', { params: { api_key: API_KEY } });

        const data = await response.data.results;
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

movieRouter.get('/showtime/:movie', async (req, res) => {
    try {
        console.log('hello before calling api')
        const response = await fetch('https://www.finnkino.fi/xml/Schedule/');
        console.log('after calling api')

        const xmlText = await response.text();
        
        const xml = new XMLParser().parse(xmlText);

        
        const movie = xml.getElementsByTagName('Show')
        console.log('movie itself is: ', movie);

        let showTimeMovies = [];

        movie.forEach(show => {
            let title = show.getElementsByTagName('Title')[0].value.toLowerCase();
            let outMovie = req.params.movie.toLowerCase();

            if (title === outMovie){
                console.log(show);
                showTimeMovies.push(show);
            }
        });
        res.status(200).json({ message: 'ok baby', xml: xml });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
} )


movieRouter.post("/addFavorite", async (req, res) => {
    const { users_id, movie_id} = req.body;

    if (!users_id || !movie_id) {
        return res.status(400).send("Missing required fields.");
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start a transaction

        // Step 1: Insert movie into the movie table if it doesn't exist
        const movieInsertResult = await client.query(
            `INSERT INTO movie (movie_id) 
             VALUES ($1)
             ON CONFLICT (movie_id) DO NOTHING RETURNING *`,
            [movie_id]
        );

        // Step 2: Insert the movie into the favorite table
        const favoriteInsertResult = await client.query(
            `INSERT INTO favorite (favorite_users_id, favorite_movie_id) 
             VALUES ($1, $2)
             ON CONFLICT (favorite_users_id, favorite_movie_id) DO NOTHING RETURNING *`,
            [users_id, movie_id]
        );

        await client.query('COMMIT'); // Commit the transaction

        // Return response
        if (favoriteInsertResult.rowCount > 0) {
            res.status(200).json({
                message: "Movie added to favorites successfully",
                movie: movieInsertResult.rows[0], // Movie details (if added)
                favorite: favoriteInsertResult.rows[0], // Favorite relation details
            });
        } else {
            res.status(200).json({
                message: "Movie is already in favorites.",
            });
        }
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if there's an error
        console.error(err);
        res.status(500).send("Error adding movie to favorites.");
    } finally {
        client.release(); // Release the database connection
    }
});



export default movieRouter;