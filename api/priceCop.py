from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import requests

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/pricesCop":
            try:
                url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
                headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
                data = {
                    "asset": "USDT",
                    "fiat": "COP",
                    "tradeType": "BUY",
                    "page": 1,
                    "rows": 10,
                    "payTypes": [],
                    "countries": [],
                }

                response = requests.post(url, headers=headers, json=data)

                if response.status_code == 200:
                    resultado = response.json()
                    primer_anuncio = resultado.get('data', [])[0]
                    precio = primer_anuncio.get('adv', {}).get('price')
                    response_data = {'price': precio}
                else:
                    response_data = {'error': 'Error fetching data'}
                    
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
    server = HTTPServer(('0.0.0.0', 5000), Handler)  # Cambia el puerto si es necesario
    print("Starting server at http://localhost:5000")
    server.serve_forever()
