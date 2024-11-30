from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import requests

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/prices":
            try:
                url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
                headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }

                # Configuración para VES
                data_ves = {
                    "asset": "USDT",
                    "fiat": "VES",
                    "tradeType": "BUY",
                    "page": 1,
                    "rows": 10,
                    "payTypes": [],
                    "countries": []
                }
                
                # Configuración para COP
                data_cop = {
                    "asset": "USDT",
                    "fiat": "COP",
                    "tradeType": "BUY",
                    "page": 1,
                    "rows": 10,
                    "payTypes": [],
                    "countries": []
                }

                # Solicitud para VES
                response_ves = requests.post(url, headers=headers, json=data_ves)
                if response_ves.status_code == 200:
                    resultado_ves = response_ves.json()
                    primer_anuncio_ves = resultado_ves.get('data', [])[0]
                    precio_ves = primer_anuncio_ves.get('adv', {}).get('price')
                else:
                    precio_ves = None

                # Solicitud para COP
                response_cop = requests.post(url, headers=headers, json=data_cop)
                if response_cop.status_code == 200:
                    resultado_cop = response_cop.json()
                    primer_anuncio_cop = resultado_cop.get('data', [])[0]
                    precio_cop = primer_anuncio_cop.get('adv', {}).get('price')
                else:
                    precio_cop = None

                # Crear respuesta combinada
                response_data = {
                    'priceVES': precio_ves,
                    'priceCOP': precio_cop
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', 5000), Handler)
    print("Starting server at http://localhost:5000")
    server.serve_forever()
