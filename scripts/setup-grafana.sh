#!/bin/bash

GRAFANA_URL="http://grafana:3000"
GRAFANA_USER="admin"
GRAFANA_PASS="admin123"

echo "Waiting for Grafana to be ready..."
until curl -s -f "$GRAFANA_URL/api/health" >/dev/null 2>&1; do
    echo "Grafana not ready, waiting..."
    sleep 1
done
echo "Grafana is ready!"

echo "Installing ClickHouse plugin..."
curl -X POST \
  -H "Content-Type: application/json" \
  -u "$GRAFANA_USER:$GRAFANA_PASS" \
  -d '{
    "pluginId": "grafana-clickhouse-datasource",
    "version": ""
  }' \
  "$GRAFANA_URL/api/plugins/grafana-clickhouse-datasource/install" || echo "Plugin may already be installed"

echo "Waiting for plugin installation..."
sleep 10

echo "Creating ClickHouse datasource..."
curl -X POST \
  -H "Content-Type: application/json" \
  -u "$GRAFANA_USER:$GRAFANA_PASS" \
  -d '{
    "name": "ClickHouse-API",
    "type": "grafana-clickhouse-datasource", 
    "url": "http://clickhouse:8123",
    "access": "proxy",
    "database": "analytics",
    "basicAuth": false,
    "jsonData": {
      "host": "clickhouse",
      "port": 8123,
      "username": "default",
      "defaultDatabase": "analytics",
      "protocol": "http"
    },
    "secureJsonData": {
      "password": ""
    }
  }' \
  "$GRAFANA_URL/api/datasources" || echo "Datasource may already exist"

echo "Importing dashboards..."
for dashboard_file in /app/grafana/dashboards/*.json; do
    if [ -f "$dashboard_file" ]; then
        echo "Importing $(basename "$dashboard_file")..."
        curl -X POST \
          -H "Content-Type: application/json" \
          -u "$GRAFANA_USER:$GRAFANA_PASS" \
          -d "{\"dashboard\": $(cat "$dashboard_file"), \"overwrite\": true}" \
          "$GRAFANA_URL/api/dashboards/db" || echo "Failed to import $(basename "$dashboard_file")"
    fi
done

echo "Grafana setup completed!"