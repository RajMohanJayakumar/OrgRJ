#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If path is empty, serve index.html
        if not path:
            path = 'index.html'
        
        # Check if the requested file exists
        if os.path.exists(path) and os.path.isfile(path):
            # File exists, serve it normally
            return super().do_GET()
        
        # Check if it's a request for a static asset (has file extension)
        if '.' in os.path.basename(path):
            # It's a file request but file doesn't exist
            self.send_error(404, "File not found")
            return
        
        # For all other routes (SPA routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

# Set up the server
PORT = 8080
Handler = SPAHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"SPA Server running at http://localhost:{PORT}")
    print("All SPA routes will be handled by index.html")
    httpd.serve_forever()
