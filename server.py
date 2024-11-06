import io
from threading import local
from aiohttp import web
from PIL import Image
import os
import aiohttp_cors

# Ruta del directorio estático
static_dir = os.path.join(os.path.dirname(__file__), 'static')
local_host = '0.0.0.0' # Cambiar por la dirección IP de tu máquina

# Manejador para la página principal
async def handle_index(request):
    return web.FileResponse(os.path.join(static_dir, 'index.html'))

# Manejador para la API
# Se espera que la imagen sea enviada por POST
# http://[host]/convert
async def handle_api(request):
    # Obtener la imagen y el formato enviados por POST
    data = await request.post()
    image = data['image'].file.read()
    format = data['format']
    quality = 100

    if format == 'meme':
        format = 'jpeg'
        quality = 1

    # Crear un objeto Image
    img = Image.open(io.BytesIO(image))
    
    # Convertir la imagen al formato deseado
    buffer = io.BytesIO()
    img.save(buffer, format=format.upper(), quality=quality)
    buffer.seek(0)
    
    # Guardar la imagen convertida en el directorio estático
    output_filename = f'converted_image.{format}'
    output_path = os.path.join(static_dir, output_filename)
    print(f"Saving image to {output_path}")
    with open(output_path, 'wb') as f:
        f.write(buffer.getvalue())
    
    # Devolver la imagen convertida
    response_data = {'filename': output_filename}
    return web.json_response(response_data)

# Crear la aplicación y configurar las rutas
app = web.Application()
app.add_routes([
    web.get('/', handle_index),
    web.post('/convert', handle_api),
    web.static('/static', static_dir)  # Servir archivos estáticos
])

# Configurar CORS
cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*",
    )
})

# Añadir CORS a las rutas
for route in list(app.router.routes()):
    cors.add(route)

if __name__ == '__main__':
    host = os.getenv('HOST', local_host)
    port = int(os.getenv('PORT', 8080))
    print(f"Starting server on {host}:{port}")
    web.run_app(app, host=host, port=port)