"use strict";

var cmsControllers = angular.module('cmsControllers', [
    'cmsServices'
]);

cmsControllers.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

cmsControllers.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    operator: 'operator',
    manager: 'manager',
    agency: 'agency'
});








