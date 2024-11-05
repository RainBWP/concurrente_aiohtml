from aiohttp import web
import os

# Ruta del directorio estático
static_dir = os.path.join(os.path.dirname(__file__), 'static')

# Manejador para la página principal
async def handle_index(request):
    return web.FileResponse(os.path.join(static_dir, 'index.html'))

# Manejador para una ruta de backend
async def handle_api(request):
    data = {'message': 'Hola desde el backend'}
    return web.json_response(data)

# Crear la aplicación y configurar las rutas
app = web.Application()
app.add_routes([
    web.get('/', handle_index),
    web.get('/api', handle_api),
    web.static('/static', static_dir)  # Servir archivos estáticos
])

if __name__ == '__main__':
    web.run_app(app)