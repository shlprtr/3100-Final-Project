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
    '#/dashboard': {
        filePath: 'pages/dashboard.html',
        scriptPath: 'js/dashboard.js',
        authRequired: true
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
    }
}