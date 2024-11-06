from aiohttp import web
from PIL import Image
import os

# Ruta del directorio estático
static_dir = os.path.join(os.path.dirname(__file__), 'static')
# Configuración para GitHub Pages

# Manejador para la página principal
async def handle_index(request):
    return web.FileResponse(os.path.join(static_dir, 'index.html'))

# Manejador para la API
# Se espera que la imagen sea enviada por POST
# http://[host]/convert
async def handle_api(request):
    # Obtener la imagen enviada por POST
    data = await request.post()
    image = data['image'].file.read()
    # Crear un objeto Image
    img = Image.open(io.BytesIO(image))
    # Convertir la imagen a escala de grises
    img = img.convert('L')
    # Guardar la imagen en un buffer
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    # Devolver la imagen convertida
    return web.Response(body=buffer.getvalue(), content_type='image/png')

# Crear la aplicación y configurar las rutas
app = web.Application()
app.add_routes([
    web.get('/', handle_index),
    web.post('/convert', handle_api),
    web.static('/static', static_dir)  # Servir archivos estáticos
])

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0') # obtener dirección del host
    port = int(os.getenv('PORT', 8080)) # obtener puerto del host
    web.run_app(app, host=host, port=port) # iniciar la aplicación