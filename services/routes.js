export const ROUTES = {
    '/#': {
        filePath: 'pages/landing.html',
        scriptPath: null,
        authRequired: false
    },
    '#/login': {
        filePath: 'pages/login.html',
        scriptPath: 'js/login.js',
        authRequired: false
    },
    '#/register': {
        filePath: 'pages/register.html',
        scriptPath: 'js/register.js',
        authRequired: false
    },
    '#/instructor': {
        filePath: 'pages/instructor.html',
        scriptPath: 'js/instructor.js',
        authRequired: true
    },
    '#/student': {
        filePath: 'pages/student.html',
        scriptPath: 'js/student.js',
        authRequired: true
    },
    '#/profile': {
        filePath: 'pages/profile.html',
        scriptPath: 'js/profile.js',
        authRequired: true
    },
    '#/create-survey': {
        filePath: 'pages/createnewsurvey.html',
        scriptPath: 'js/createnewsurvey.js',
        authRequired: true
    }
}