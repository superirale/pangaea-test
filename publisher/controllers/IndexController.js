"use strict";

const axios = require('axios').default;
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv').config();
const Queue = require('bull');
const httpRequestQueue = new Queue('Process HTTP requests', process.env.REDIS_URL);
const knex = require('knex')({
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    }
});


exports.validatorMiddleware = (method) => {
  switch (method) {
    case 'createTopic': {
        return [ 
            body('url', 'Url does not exist').exists(),
            body('url', 'Invalid Url').isURL(),
        ]   
    }
  }
}

exports.createTopic = (req, res) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { url } = req.body;
    const { topic } = req.params;

    // Using transaction as a query builder:
    knex.transaction(function(trans) {
        return trans('topics')
            .where('name', topic)
            .select('id')
            .first()
            .then(res => {
                if (!res) {
                    return trans('topics').insert({ name: topic }, 'id').then((id) => {
                        return trans('subscribers').insert({
                            topic_id: id,
                            url: url
                        });
                    });
                } else {
                    return trans('subscribers').insert({
                        topic_id: res.id,
                        url: url
                    });
                }
          });
    })
    .catch(function(error) {
        console.error(error);
    });

    res.send({
        topic: topic,
        url: url
    });
}

exports.publishMessage = async (req, res) => {

    const { topic } = req.params;
    const message = req.body

    try {
        // check if topic exists
        const { cnt }  = await knex('topics')
                                .where('name', topic)
                                .count('id as cnt')
                                .first();             
        if (cnt <= 0) {
            res.status(422).json({message: "Topic does not exist"});
            return;
        }
        // get all the topics subscribers
        const urls = await knex('topics')
                .join('subscribers', 'topics.id', 'subscribers.topic_id')
                .select('subscribers.url')
                .where('topics.name', topic)

        const postData = {
            topic: topic,
            data: message
        }
        
        httpRequestQueue.add({
            urls: urls,
            data: postData
        })
        
    } catch (error) {
        res.status(422).json({message: "Message was not published"});
        return;
    }

    res.send({
        message: "Message published successfully"
    });
}


httpRequestQueue.process(async (job) => {
  
    const { urls, data } = job.data;
    urls.map((item) => {
        axios.post(item.url, data).catch(err => {
            console.error(err.response.status);
        });
    });
});