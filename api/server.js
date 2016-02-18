'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});

//Load plugins
server.register([require('hapi-auth-cookie'), require('bell')], (err) => {
    if (err) {
        console.error('Failed to load a plugin:', err);
    }
});

//Setup the session strategy
server.auth.strategy('session', 'cookie', {
    password: 'secret_cookie_encryption_password', //Use something more secure in production
    redirectTo: '/auth/twitter', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
});

//Setup the social Twitter login strategy
server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: 'secret_cookie_encryption_password', //Use something more secure in production
    clientId: 'Zjwlt9aWsj12IKX4pgu6GsTUw',
    clientSecret: 'IpeRTRGR8sHAjsQVPLjvIoxWr7BUyJhdx5Csr8wIQK8LFwBM45',
    isSecure: false //Should be set to true (which is the default) in production
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
        return reply('hello world');
    }
});


server.route({
    method: 'GET',
    path: '/auth/twitter',
    config: {
        auth: 'twitter', //<-- use our twitter strategy and let bell take over
        handler: function (request, reply) {
            if (!request.auth.isAuthenticated) {
                return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
            }

            //Just store the third party credentials in the session as an example. You could do something
            //more useful here - like loading or setting up an account (social signup).
            console.log(JSON.stringify(request.auth.credentials))

            return reply.redirect('/hello');
        }
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});