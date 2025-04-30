import { ROUTES } from './routes.js'

const app = document.querySelector('#divContent')
let currentRoute = location.hash || '/#'  // default landing page

// load the content of the page for a route
const renderContent = async (route) => {
    try {
        console.log('Loading:', route)
        const objRouteInfo = ROUTES[route];
        if (!objRouteInfo) {
            throw new Error('Route not found');
        }

        const response = await fetch(`${objRouteInfo.filePath}?t=${Date.now()}`)
        if (!response.ok) {
            throw new Error(`Error loading ${objRouteInfo.filePath}: ${response.statusText}`);
        }

        const strContent = await response.text()
        app.innerHTML = strContent

        const existingScript = document.querySelector(`script[data-route-script]`)
        if (existingScript) {
            existingScript.remove()
        }

        if (objRouteInfo.scriptPath) {
            const script = document.createElement('script')
            script.src = `${objRouteInfo.scriptPath}?t=${Date.now()}`
            script.type = 'module'
            script.setAttribute("data-route-script", "true")
            document.body.appendChild(script);
        }
    } catch (error) {
        console.error(error);
        app.innerHTML = '<h1 class="text-white">Error loading content.</h1>';
    }
}

// use to navigate to a new route
const navigate = async (route) => {
    const objRouteInfo = ROUTES[route]

    if (objRouteInfo && objRouteInfo.authRequired && !(await isSessionValid())) {
        console.log("Redirecting to landing page due to invalid session.")
        location.hash = ''
        return
    }

    if (location.hash !== route) {
        location.hash = route
    }
}

// handle hash changes
window.addEventListener('hashchange', async () => {
    const newRoute = location.hash || '/#'
    const objRouteInfo = ROUTES[newRoute]

    if (objRouteInfo && objRouteInfo.authRequired && !(await isSessionValid())) {
        console.log("Redirecting to landing page due to invalid session.")
        location.hash = ''
        return
    }

    if (newRoute !== currentRoute) {
        currentRoute = newRoute
        renderContent(currentRoute)
    }
})

// load initial page
const initializeRoutes = async () => {
    let strValidatedRoute
    if (await isSessionValid()) {
        strValidatedRoute = '#/dashboard'
    } else {
        strValidatedRoute = '/#'  // landing page
    }

    const strInitialRoute = location.hash || strValidatedRoute
    renderContent(strInitialRoute)
}

// use endpoint to check if session is valid
const isSessionValid = async () => {
    const response = await fetch('http://localhost:8000/sessions', {
        credentials: 'include'
    })
    const data = await response.json()
    return data.status === 'success'
}

export { initializeRoutes, navigate }