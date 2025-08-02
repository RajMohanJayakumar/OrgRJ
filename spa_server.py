#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/'):
            path = path[1:]
        
        if not path:
            path = 'index.html'
        
        if os.path.exists(path) and os.path.isfile(path):
            return super().do_GET()
        
        if '.' in os.path.basename(path):
            self.send_error(404, "File not found")
            return
        
        self.path = '/index.html'
        return super().do_GET()

PORT = 8080
Handler = SPAHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"SPA Server running at http://localhost:{PORT}")
    print("All SPA routes will be handled by index.html")
    httpd.serve_forever()