import { ROUTES } from './routes.js'
import { ApiService } from './apiService.js'

const app = document.querySelector('#divContent')
let currentRoute = location.hash || '/#'  // default landing page

// load the content of the page for a route
const renderContent = async (route) => {
    try {
        const objRouteInfo = ROUTES[route];
        if (!objRouteInfo) {
            throw new Error('Route not found');
        }

        // check if session is valid
        if (objRouteInfo && objRouteInfo.authRequired && !(await isSessionValid())) {
            console.log("Redirecting to landing page due to invalid session.")
            location.hash = ''
            return
        }

        console.log('Loading:', route)

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

    if (newRoute !== currentRoute) {
        currentRoute = newRoute
        renderContent(currentRoute)
    }
})

// load initial page
const initializeRoutes = async () => {
    let strValidatedRoute
    if (await isSessionValid()) {
        strValidatedRoute = '#/student'
    } else {
        strValidatedRoute = '/#'  // landing page
    }

    const strInitialRoute = location.hash || strValidatedRoute
    renderContent(strInitialRoute)
}

// use endpoint to check if session is valid
const isSessionValid = async () => {
    const objResponse = await ApiService.checkSession()
    return objResponse.success
}

export { initializeRoutes, navigate }