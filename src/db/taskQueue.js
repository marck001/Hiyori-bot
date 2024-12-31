const { Queue } = require('bullmq');

const taskQueue = new Queue('tasks', {
    connection: {
        host: 'localhost', 
        port: 6379,        
    },
});

module.exports = taskQueue;
