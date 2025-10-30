#!/bin/sh
echo "Esperando a MySQL en $DB_HOST..."

# Espera hasta que MySQL acepte conexiones con usuario de la app
until mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME" >/dev/null 2>&1; do
  echo "MySQL no está listo todavía, esperando 2 segundos..."
  sleep 2
done

echo "MySQL listo"
